import React, { useState, useRef } from "react";
import _uniqueId from 'lodash/uniqueId';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserActions from "../../../store/actions/user";

import Input from "../../../components/Input";

import Logo from "../../../assets/images/logo/flexip-white.svg";

import api from "../../../services/api";

import { API_GUARD } from "../../../services/env";

import styles from './styles.module.css';

function Login(props) {
    //   constructor(props) {
    //     super(props);
    //     this.state = {
    //       login: true,
    //       register: false,
    //       email: "",
    //       password: "",
    //       isLoading: false,
    //       isAlertOn: false,
    //       forgotModal: false,
    //       validate: {
    //         email: {
    //           message: "",
    //           isInvalid: false
    //         },
    //         password: {
    //           message: "",
    //           isInvalid: false
    //         }
    //       },
    //       alertMessage: {
    //         title: "",
    //         message: ""
    //       }
    //     };
    //     this.checkIfTokenExists = this.checkIfTokenExists.bind(this);
    //     this.toggleAlert = this.toggleAlert.bind(this);
    //     this.error = this.error.bind(this);
    //   }

    //   error() {
    //     const alert = {
    //       title: "Ops... Algo deu errado.",
    //       message: "Não foi possível completar sua requisição."
    //     }
    //     this.activeAlert(alert);
    //   }

    //   componentDidMount() {
    //     this.checkIfTokenExists();
    //   }

    //   toggleIsLoad(boolean) {
    //     this.setState({ isLoading: boolean });
    //   }

    //   toggleAlert() {
    //     this.setState({
    //       isAlertOn: !this.state.isAlertOn
    //     });
    //   }

    //   activeAlert(alertMessage) {
    //     const { title, message } = alertMessage;
    //     this.setState({
    //       ...this.state,
    //       isAlertOn: true,
    //       alertMessage: {
    //         title,
    //         message
    //       }
    //     });
    //   }

    //   toggleForgotModal() {
    //     this.setState({ forgotModal: !this.state.forgotModal });
    //   }

    //   handlerForgotLink(event) {
    //     event.preventDefault();
    //     this.toggleForgotModal();
    //   }

    //   async checkIfTokenExists() {
    //     // const { history, updateUser } = this.props;
    //     // const access_token = await localStorage.getItem("access_token");
    //     // if (access_token) {
    //     //   try {
    //     //     const response = await api.post('/v1/admin/auth/me', null, {
    //     //       headers: { Authorization: "Bearer " + access_token }
    //     //     });
    //     //     if (response.status === 200) {
    //     //       const { name, email } = response.data;
    //     //       updateUser(name, email);
    //     //       history.push("/admin/dashboard");
    //     //     }
    //     //   }
    //     //   catch (error) {
    //     //     localStorage.removeItem("access_token");
    //     //   }
    //     // }
    //   }

    //   handlerForgotModal(event) {
    //     event.preventDefault();
    //     this.forgotModal();
    //   }

    //   handlerChangeInput(value) {
    //     const key = Object.keys(value)[0];
    //     this.setState({
    //       ...value,
    //       validate: {
    //         ...this.state.validate,
    //         [key]: {
    //           message: "",
    //           isInvalid: false
    //         }
    //       }
    //     });
    //   }

    //   async handlerLogin(event) {
    //     event.preventDefault();
    //     if (!this.state.isLoading) {
    //       this.toggleIsLoad(true);
    //       const { history, updateUser, updatePABX } = this.props;
    //       const { email, password } = this.state;
    //       try {
    //         const response = await api.post(`/v1/${API_GUARD}/auth/login`, {
    //           email,
    //           password
    //         });
    //         if (response.status && response.status === 200) {
    //           const { access_token } = response.data.token;
    //           const { user } = response.data;
    //           const { company } = user;
    //           const { pabx } = company;

    //           updateUser(user.name, user.email);
    //           updatePABX(pabx[0].id, pabx[0].name);
    //           localStorage.setItem("access_token", access_token);
    //           history.push("/admin/dashboard");
    //         }
    //         this.toggleIsLoad(false);
    //       } catch (error) {
    //         if (error.response) {
    //           switch (error.response.status) {
    //             case 401:
    //               const { message, title } = error.response.data;
    //               const alertMessage = {
    //                 title,
    //                 message
    //               };
    //               this.activeAlert(alertMessage);
    //               break;
    //             case 422:
    //               const { errors } = error.response.data;
    //               for (let key in errors) {
    //                 this.setState({
    //                   validate: {
    //                     ...this.state.validate,
    //                     [key]: {
    //                       message: errors[key],
    //                       isInvalid: true
    //                     }
    //                   }
    //                 });
    //               }
    //               break;
    //             default:
    //               this.error();
    //           }
    //         }
    //         this.toggleIsLoad(false);
    //       }
    //     }
    //   }

    //   openLogin(history) {
    //     history.push("/");
    //   }

    //   openRegister(history) {
    //     history.push("/auth/cadastrar");
    //   }
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailId = useRef(_uniqueId(`email-id-`)).current;
    const passwordId = useRef(_uniqueId(`password-id-`)).current;

    const [validation, setValidation] = useState({
        email: {
            isInvalid: false,
            message: ""
        },
        password: {
            isInvalid: false,
            message: ""
        },
    });

    const atraso = (delay) => new Promise(function(resolve) {
        setTimeout(resolve, delay);
    });

    const teste = async () => {
        props.setIsLoading(true);
        await atraso(5000);
        props.setIsLoading(false);
    }

    return (
        <>
            <main className={styles.main}>
                <div className={`${styles.login} container`}>
                    <form className={styles.form}>
                        <h1>Login</h1>
                        <fieldset>
                            <Input
                                label="E-mail"
                                placeholder="usuario@email.com"
                                id={emailId}
                                type="email"
                                name="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                }}
                                validation={validation.email}
                            />
                            <Input
                                label="Senha"
                                id={passwordId}
                                type="password"
                                name="password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                }}
                                validation={validation.password}
                            />
                        </fieldset>
                        <a href="/auth/esqueci-minha-senha">Esqueci minha senha!</a>
                        <button
                            className={`${styles.btnSignin} full-size`}
                            onClick={(e) => {
                                e.preventDefault();

                                setValidation({...validation,
                                    email: {
                                        isInvalid: true,
                                        message: "E-mail inválido!"
                                    },
                                    password: {
                                        isInvalid: true,
                                        message: "E-mail inválido!"
                                    },
                                });

                                teste();
                            }}
                        >
                            Entrar
                        </button>
                        <button
                            className={`${styles.btnSignup} transparent`}
                            onClick={(e) => {
                                e.preventDefault();

                                props.history.push("/auth");
                            }}
                        >
                            Cadastrar
                        </button>
                    </form>
                </div>
                <div className={`${styles.advertising} container dark-theme gradient`}>
                    <article>
                        <img src={Logo} alt="Flex IP" className="logo" />
                        <h2>Seja bem-vindo!</h2>
                        <p>Não conhece o <span>Flex IP</span>?
                        <br/>
                        <span>Flex IP</span> é a plataforma de gerenciamento de <strong>PABX</strong>
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
        </>
    );
}

const mapDispatchToProps = dispatch => bindActionCreators(UserActions, dispatch);

export default connect(null, mapDispatchToProps)(Login);