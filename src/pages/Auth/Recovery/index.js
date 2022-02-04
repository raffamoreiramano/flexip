import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../../../store/actions";

import Input from "../../../components/Input";

import { 
    validateEmail,
    validatePassword,
} from '../../../services/helpers';
import api from "../../../services/api";
import { API_GUARD } from "../../../services/env";

import styles from './styles.module.css';
import Alert from "../../../components/Modals/Alert";

export default function Recovery(props) {
    const { token } = props.match.params;

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });

    const success = useRef(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        email: {
            isInvalid: false,
            message: ""
        },
        password: {
            isInvalid: false,
            message: ""
        },
        passwordConfirm: {
            isInvalid: false,
            message: ""
        },
    };
    const [validation, setValidation] = useState(initialValidation);

    const showAlert = (content, response = false) => {
        success.current = response;

        setAlertContent(content);
        setIsAlertActive(true);
    }

    const validate = () => {
        let newValidation = initialValidation;
        let veredict = true;

        if (!validateEmail(email)) {
            newValidation.email = {
                isInvalid: true,
                message: "E-mail inválido!",
            }
        }

        if (!validatePassword(password)) {
            newValidation.password = {
                isInvalid: true,
                message: "Deve ter de 8 a 32 caracteres [a-Z, 0-9, !@#$%&*-_.]!",
            }
        }

        if (password !== passwordConfirm) {
            newValidation.passwordConfirm = {
                isInvalid: true,
                message: "As senhas não correspondem uma com a outra!",
            }
        }

        if (Object.values(newValidation).some(item => item.isInvalid)) {
            veredict = false;
        }

        setValidation(newValidation);
        setIsValidated(true);

        return veredict;
    }

    const cleanValidation = () => setValidation(initialValidation);

    const handleChange = (callback) => {
        if (isValidated) {
            setIsValidated(false);
            cleanValidation();
        }

        callback.call();
    }

    const recover = async () => {
        dispatch(setIsLoading(true));

        const body = {
            email: email.trim(),
            password: password.trim(),
            passwordConfirm: passwordConfirm.trim(),
            token,
        }

        try {
            const response = await api.post(`/v1/${API_GUARD}/auth/password/reset`, body);

            if (response.status && response.status === 200) {
                const { title, message } = response.data;

                let content = {
                    title: title || "Pronto...",
                    message: message || "Sua senha foi alterada com sucesso!"
                }

                showAlert(content, true);
            }
        } catch (error) {
            let content = {
                title: "Ops!",
                message: "Parece que houve um erro... Por favor, tente mais tarde!",
            }            

            if (error.response) {
                const { title, message } = error.response.data;

                content = {
                    title: title || content.title,
                    message: message || content.message,
                }
                
                if (error.response.status === 422) {
                    content = {
                        title: "Formulário inválido!",
                        message: "Verifique se os campos do formulário foram preenchidos corretamente.",
                    }

                    const { errors } = error.response.data;
                    const fields = Object.keys(errors);

                    let newValidation = initialValidation;

                    fields.forEach((item) => {
                        const message = errors[item];

                        newValidation[item] = {
                            isInvalid: true,
                            message,
                        }
                    });

                    setValidation(newValidation);
                }
            }

            showAlert(content);
        } finally {
            dispatch(setIsLoading(false));
        }
    }

    return (
        <>
            <main className={styles.main}>
                <div className={styles.recovery}>
                    <form className={styles.form} onSubmit={(event) => {
                        event.preventDefault();

                        if (validate()) {
                            recover();
                        }
                    }}>
                        <h1>Alterar senha</h1>
                        <fieldset>
                            <Input
                                label="E-mail"
                                placeholder="usuario@email.com"
                                id="recovery-email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(event) => handleChange(() => {
                                    setEmail(event.target.value);
                                })}
                                validation={validation.email}
                            />
                            <Input
                                label="Nova senha"
                                id="recovery-password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(event) => handleChange(() => {
                                    setPassword(event.target.value);
                                })}
                                validation={validation.password}
                            />
                            <Input
                                label="Confirmar senha"
                                id="recovery-passwordConfirm"
                                type="password"
                                name="passwordConfirm"
                                value={passwordConfirm}
                                onChange={(event) => handleChange(() => {
                                    setPasswordConfirm(event.target.value);
                                })}
                                validation={validation.passwordConfirm}
                            />
                        </fieldset>
                        <div className={styles.actions}>
                            <button
                                className="main-color-4"
                                onClick={(e) => {
                                    e.preventDefault();

                                    props.history.push("/auth");
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="main-color-2"
                                type="submit"
                            >
                                Confirmar
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Alert
                title={alertContent.title}
                message={alertContent.message}
                state={[isAlertActive, setIsAlertActive]}
                onClose={() => {
                    if (success.current) {
                        props.history.push("/auth");
                    }
                }}
            />
        </>
    );
}