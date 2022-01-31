import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../store/actions";

import api from "../../../../../services/api";
import { API_GUARD } from "../../../../../services/env";

import styles from '../styles.module.css';
import Input, { Radio } from "../../../../../components/Input";
import Alert from "../../../../../components/Modals/Alert";
import { validateEmail, validateName, validatePassword } from "../../../../../services/helpers";

export default function UserForm({ props }) {
    const { refresh, user } = props;

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const success = useRef(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [blockedPassword, setBlockedPassword] = useState(false);

    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        name: {
            isInvalid: false,
            message: ''
        },
        email: {
            isInvalid: false,
            message: ''
        },
        password: {
            isInvalid: false,
            message: ''
        },
        blockedPassword: {
            isInvalid: false,
            message: ''
        },
    }
    const [validation, setValidation] = useState(initialValidation);

    const validate = () => {
        let newValidation = initialValidation;
        let veredict = true;

        if (!validateName(name)) {
            newValidation.name = {
                isInvalid: true,
                message: "Nome inválido!",
            }
        }

        if (!validateEmail(email)) {
            newValidation.email = {
                isInvalid: true,
                message: "E-mail inválido!",
            }
        }

        if ((!user && !validatePassword(password)) || (user && password && !validatePassword(password))) {
            newValidation.password = {
                isInvalid: true,
                message: "Senha inválida!",
            }
        }

        if (Object.values(newValidation).some(item => item.isInvalid)) {
            veredict = false;
        }

        setValidation(newValidation);
        setIsValidated(true);

        return veredict;
    }

    const validateByResponse = (errors) => {
        const APIFields = {
            'name': 'name',
            'email': 'email',
            'password': 'password',
            'blocked_password': 'blockedPassword',
        }

        const fields = Object.keys(errors);

        const invalidFields = fields.map(field => APIFields[field]);

        let newValidation = initialValidation;

        invalidFields.forEach((key, index) => {
            const message = errors[fields[index]];

            newValidation[key] = {
                isInvalid: true,
                message,
            }
        });

        setValidation(newValidation);
        setIsValidated(true);
    }

    const cleanValidation = () => setValidation(initialValidation);

    const handleChange = (callback) => {
        if (isValidated) {
            setIsValidated(false);
            cleanValidation();
        }

        callback.call();
    }

    const showAlert = (content, response = false) => {
        success.current = response;

        setAlertContent(content);
        setIsAlertActive(true);
    }

    const submit = async () => {
        dispatch(setIsLoading(true));

        const body = {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            password_blocked: blockedPassword,
        }

        try {
            const access_token = localStorage.getItem("access_token");
            const response = user 
            ? await api.put(`/v1/${API_GUARD}/user/${user.id}`, body, {
                headers: { Authorization: "Bearer " + access_token }
            })
            : await api.post(`/v1/${API_GUARD}/user`, body, {
                headers: { Authorization: "Bearer " + access_token }
            });

            if (response.status && response.status === 200) {
                const { title, message } = response.data;
                const content = { title, message };

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

                if (error.response.status === 401) {
                    content = {
                        title: "Token expirou!",
                        message: "Faça login novamente para continuar...",
                    }
                }
                
                if (error.response.status === 422) {
                    content = {
                        title: "Formulário inválido!",
                        message: "Verifique se os campos do formulário foram preenchidos corretamente.",
                    }

                    const { errors } = error.response.data;

                    validateByResponse(errors);
                }

                console.log(error.response.data);
            }

            showAlert(content);
        } finally {
            dispatch(setIsLoading(false));
        }
    }

    const initialRender = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            const access_token = localStorage.getItem("access_token");

            if (access_token) {
                try {
                    const response = await api.get(`/v1/${API_GUARD}/user/${user.id}`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const { name, email, password_blocked } = response.data.user;

                        setName(name);
                        setEmail(email);
                        setBlockedPassword(!!password_blocked);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (initialRender.current) {
            initialRender.current = false;

            if (user) {
                dispatch(setIsLoading(true));
    
                fetchData().finally(() => {
                    dispatch(setIsLoading(false));
                });
            }
        }
    });

    return (
        <>
            <article className={styles.form}>
                <h2>{user ? "Editar" : "Adicionar"}</h2>
                <form autoComplete="off" onSubmit={(event) => {
                    event.preventDefault();

                    if (validate()) {
                        submit();
                    }
                }}>
                    <fieldset>
                        <Input
                            id="user-name"
                            name="name"
                            label="Nome"
                            placeholder="Nome"
                            value={name}
                            onChange={(event) => handleChange(() => {
                                setName(event.target.value);
                            })}
                            validation={validation.name}
                        />

                        <Input
                            id="user-email"
                            type="email"
                            name="email"
                            label="E-mail"
                            value={email}
                            onChange={(event) => handleChange(() => {
                                setEmail(event.target.value);
                            })}
                            validation={validation.email}
                        />

                        <Input
                            id="user-password"
                            type="password"
                            name="password"
                            label="Senha"
                            value={password}
                            onChange={(event) => handleChange(() => {
                                setPassword(event.target.value);
                            })}
                            validation={validation.password}
                        />

                        <Radio 
                            id="user-blockedPassword"
                            name="blockedPassword"
                            label="Senha bloqueada"
                            value={blockedPassword}
                            onChange={(event) => handleChange(() => {
                                setBlockedPassword(event.target.value);
                            })}
                            validation={validation.blockedPassword}
                        >
                            <option value={true}>Sim</option>
                            <option value={false}>Não</option>
                        </Radio>
                    </fieldset>

                    <div className={styles.formActions}>
                        <button
                            className="main-color-4"
                            type="button"
                            onClick={refresh}
                        >
                            Cancelar
                        </button>
                        {
                            user 
                            ? <button
                                className="main-color-2"
                                type="submit"
                            >
                                Editar
                            </button>
                            : <button
                                className="main-color-1"
                                type="submit"
                            >
                                Adicionar
                            </button>
                        }
                    </div>
                </form>
            </article>
            <Alert
                title={alertContent.title}
                message={alertContent.message}
                state={[isAlertActive, setIsAlertActive]}
                onClose={() => {
                    if (success.current) {
                        refresh();
                    }
                }}
            />
        </>
    );
}