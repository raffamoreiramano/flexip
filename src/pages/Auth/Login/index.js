import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setIsLoading, updatePABX, updateUser } from "../../../store/actions";

import Input from "../../../components/Input";

import { 
    validateEmail,
    validatePassword,
} from '../../../services/helpers';
import Logo from "../../../assets/images/logo/flexip-white.svg";
import api from "../../../services/api";
import { API_GUARD } from "../../../services/env";

import styles from './styles.module.css';
import Alert from "../../../components/Modals/Alert";
import Prompt from "../../../components/Modals/Prompt";

export default function Login(props) {
    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [isPromptActive, setIsPromptActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRecovery, setPasswordRecovery] = useState("");

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
        passwordRecovery: {
            isInvalid: false,
            message: ""
        },
    };
    const [validation, setValidation] = useState(initialValidation);

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

    const login = async () => {
        dispatch(setIsLoading(true));

        const body = {
            email: email.trim(),
            password: password.trim(),
        }

        try {
            const response = await api.post(`/v1/${API_GUARD}/auth/login`, body);

            if (response.status && response.status === 200) {
                dispatch(setIsLoading(false));

                const { access_token } = response.data.token;
                const { user } = response.data;
                const { company } = user;
                const { pabx } = company;

                localStorage.setItem("access_token", access_token);

                if (props.location.pathname.match('auth')) {
                    props.history.push("/");
                }

                dispatch(updateUser(user.name, user.email));
                dispatch(updatePABX(pabx[0].id, pabx[0].name));
            }
        } catch (error) {
            dispatch(setIsLoading(false));

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
                        title: "Ops!",
                        message: "Usuário e/ou senha inválidos...",
                    }
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

            setAlertContent(content);
            setIsAlertActive(true);
        }
    }

    const recover = async () => {
        dispatch(setIsLoading(true));

        const body = {
            email: passwordRecovery.trim(),
        }

        try {
            const response = await api.post(`/v1/${API_GUARD}/auth/recover`, body);

            if (response.status && response.status === 200) {
                dispatch(setIsLoading(false));

                const content = {
                    title: "Envio realizado...",
                    message: "Cheque sua caixa de entrada!"
                }

                setAlertContent(content);
                setIsAlertActive(true);
            }
        } catch (error) {
            dispatch(setIsLoading(false));

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
                        title: "E-mail não encontrado!",
                        message: "Não há nenhum usuário cadastrado com esse e-mail.",
                    }
                }
                
                if (error.response.status === 422) {
                    content = {
                        title: "E-mail inválido!",
                        message: "Verifique se o e-mail foi digitado corretamente.",
                    }
                }

                setValidation({
                    ...validation,
                    passwordRecovery: {
                        isInvalid: true,
                        message: "E-mail inválido!"
                    }
                })
            }

            setAlertContent(content);
            setIsAlertActive(true);
        }
    }

    return (
        <>
            <main className={styles.main}>
                <div className={`${styles.login} container`}>
                    <form className={styles.form} onSubmit={(event) => {
                        event.preventDefault();

                        if (validate()) {
                            login();
                        }
                    }}>
                        <h1>Login</h1>
                        <fieldset>
                            <Input
                                label="E-mail"
                                placeholder="usuario@email.com"
                                id="login-email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(event) => handleChange(() => {
                                    setEmail(event.target.value);
                                })}
                                validation={validation.email}
                            />
                            <Input
                                label="Senha"
                                id="login-password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(event) => handleChange(() => {
                                    setPassword(event.target.value);
                                })}
                                validation={validation.password}
                            />
                        </fieldset>
                        <a href="/auth" onClick={(event) => {
                            event.preventDefault();

                            setPasswordRecovery(passwordRecovery || email);

                            setIsPromptActive(true);
                        }}>
                            Esqueci minha senha!
                        </a>
                        <button
                            className={`${styles.btnSignin} full-size`}
                            type="submit"
                        >
                            Entrar
                        </button>
                        <button
                            className={`${styles.btnSignup} transparent`}
                            onClick={(e) => {
                                e.preventDefault();

                                props.history.push("/auth/cadastrar");
                            }}
                        >
                            Cadastrar
                        </button>
                    </form>
                </div>
                <div className={`${styles.advertising} container dark-theme gradient`}>
                    <article>
                        <img src={Logo} alt="FLEXIP" className="logo" />
                        <h2>Seja bem-vindo!</h2>
                        <p>Não conhece o <span>FLEXIP</span>?
                        <br/>
                        <span>FLEXIP</span> é a plataforma de gerenciamento de <strong>PABX</strong>
                        <br/>feita pra você!</p>
                        
                        <p>Com ela você tem:</p>
                        <ul className={styles.ul}>
                            <li>
                                Custo ZERO entre Filiais;
                            </li>
                            <li>
                                Relatórios detalhados;
                            </li>
                            <li>
                                Fácil expansão;
                            </li>
                            <li>
                                Flexibilidade.
                            </li>
                        </ul>
                        <button
                            className="main-color-2"
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();

                                props.history.push("/auth/cadastrar");
                            }}
                        >
                            Cadastre-se agora!
                        </button>
                    </article>
                </div>
            </main>
            <Alert
                title={alertContent.title}
                message={alertContent.message}
                state={[isAlertActive, setIsAlertActive]}
            />
            <Prompt
                title="Recuperação de senha"
                message="Insira seu e-mail de cadastro"
                state={[isPromptActive, setIsPromptActive]}
                inputProps={{
                    autoComplete: "off",
                    type:"email",
                    label: "E-mail",
                    name: "passwordRecovery",
                    value: passwordRecovery,
                    validation: validation.passwordRecovery,
                    onFocus: (event) => {
                        setPasswordRecovery(event.target.value)
                    },
                    onChange: (event) => {
                        setPasswordRecovery(event.target.value);

                        setValidation({
                            ...validation,
                            passwordRecovery: {
                                isInvalid: false,
                                message: "",
                            }
                        });
                    },
                }}
                onSubmit={() => {
                    if (validateEmail(passwordRecovery)) {
                        setIsPromptActive(false);
                        recover();
                    } else {
                        setValidation({
                            ...validation,
                            passwordRecovery: {
                                isInvalid: true,
                                message: "E-mail inválido!",
                            }
                        });
                    }
                }}
            />
        </>
    );
}