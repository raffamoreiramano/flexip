import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../store/actions";

import api from "../../../../services/api";
import { API_GUARD } from "../../../../services/env";
import { BRLMask } from "../../../../services/helpers";

import Alert from "../../../../components/Modals/Alert";
import Input, { Radio } from "../../../../components/Input";
import Reorderable from "../../../../components/Reorderable";

import { MdOutlineAdd } from 'react-icons/md';

import styles from './styles.module.css';
import { validateEmail } from "../../../../services/helpers";

export default function GeneralSettings() {
    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });

    const [enable, setEnable] = useState(false);
    const [amount, setAmount] = useState(100);
    const [email, setEmail] = useState('');
    const [emails, setEmails] = useState([]);

    const [fetched, setFetched] = useState(false);
    const [changed, setChanged] = useState(false);

    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        enable: {
            isInvalid: false,
            message: ''
        },
        amount: {
            isInvalid: false,
            message: ''
        },
        email: {
            isInvalid: false,
            message: ''
        },
    }
    const [validation, setValidation] = useState(initialValidation);
    const cleanValidation = () => setValidation(initialValidation);

    const handleChange = (callback) => {
        setChanged(true);

        if (isValidated) {
            setIsValidated(false);
            cleanValidation();
        }

        callback.call();
    }

    const validate = () => {
        let newValidation = initialValidation;
        let veredict = true;

        if (enable) {
            if (emails.length < 1) {
                newValidation.email = {
                    isInvalid: true,
                    message: "Você precisa definir ao menos um email!",
                }
            }
    
            if (amount < 100) {
                newValidation.amount = {
                    isInvalid: true,
                    message: "Quantia precisa ser maior que R$ 1,00",
                }
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
            'enable': 'enable',
            'amount': 'amount',
            'emails': 'email',
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

    const addEmail = (value) => {
        try {
            if (emails.some(email => email === value)) {
                throw new Error('E-mail já está na lista!');
            }

            if (!validateEmail(value)) {
                throw new Error('E-mail inválido!');
            }

            setEmails([...emails, value]);

            setEmail('');
        } catch ({ message }) {
            setValidation({
                ...validation,
                email: {
                    isInvalid: true,
                    message,
                }
            });

            setIsValidated(true);
        }
    }

    useEffect(() => {
        if (!initialRender.current) {
            setChanged(true);
        }
    }, [emails]);

    const submit = async () => {
        dispatch(setIsLoading(true));

        const body = {
            enable,
            amount,
            emails,
        }

        try {
            const access_token = localStorage.getItem("access_token");
            const response = await api.post(`/v1/${API_GUARD}/general_configs/low_balance_notice`, body, {
                headers: { Authorization: "Bearer " + access_token }
            });

            if (response.status && response.status === 200) {
                const { title, message } = response.data;
                const content = { title, message };

                showAlert(content);
                setChanged(false);
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

    const fetchData = async () => {
        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            try {
                const response = await api.get(`/v1/${API_GUARD}/general_configs/low_balance_notice`, {
                    headers: { Authorization: "Bearer " + access_token }
                });

                if (response.status === 200) {
                    const { general_configs } = response.data;
                    const { low_balance_notice } = general_configs;
                    const {
                        enable,
                        amount,
                        emails,
                    } = low_balance_notice;


                    setEnable(enable);
                    setEmails(emails);
                    setAmount(amount);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            dispatch(setIsLoading(true));
            
            fetchData().finally(() => {
                dispatch(setIsLoading(false));

                setFetched(true);
            });
        }
    });

    const showAlert = (content) => {
        setAlertContent(content);
        setIsAlertActive(true);
    }

    if (!fetched) {
        return (
            <main className={styles.main}>
                <p className={styles.nodata}>. . .</p>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <article>
                <h2>Alerta de saldo</h2>
                <p>Habilite o alerta de saldo e quando seu crédito estiver abaixo do esperado nós enviaremos um aviso nos e-mails cadastrados!</p>
            </article>
            <div className={styles.form}>
                <form autoComplete="off" onSubmit={(event) => {
                    event.preventDefault();

                    if (changed && validate()) {
                        submit();
                    }
                }}>
                    <fieldset>
                        <div>
                            <Radio 
                                id="general-enable"
                                name="enable"
                                label="Alerta"
                                value={enable}
                                onChange={(event) => handleChange(() => {
                                    setEnable(event.value);
                                })}
                                validation={validation.enable}
                            >
                                <option value={true}>Ativado</option>
                                <option value={false}>Desativado</option>
                            </Radio>

                            
                        </div>
                    </fieldset>
                    {
                        enable &&
                        <fieldset>
                            <Input
                                id="general-amount"
                                name="amount"
                                label="Quantia"
                                placeholder="Em reais"
                                value={BRLMask(amount, 100, 2)}
                                onChange={(event) => handleChange(() => {
                                    const string = event.target.value.replace(/\D/g, "");
                                    let number = 0;

                                    if (!isNaN(string)) {
                                        number = parseInt(string);
                                    }
                                    
                                    setAmount(number);
                                })}
                                validation={validation.amount}
                            />

                            <Input.Group
                                id={`general-add-email-`}
                                label="E-mails"
                                validation={validation.email}
                            >
                                <Input
                                    id="general-email"
                                    type="email"
                                    name="email"
                                    label="E-mail"
                                    value={email}
                                    onChange={(event) => handleChange(() => {
                                        setEmail(event.target.value);
                                    })}
                                />

                                <button
                                    className="main-color-1"
                                    type="button"
                                    onClick={() => handleChange(() => addEmail(email))}
                                >
                                    <MdOutlineAdd fill="white"/>
                                </button>
                            </Input.Group>
                            {
                                emails.length > 0 &&
                                <div>
                                    <Reorderable
                                        id="general-emails-list"
                                        state={[emails, setEmails]}
                                        content={(email) => (
                                            <>
                                                <p>{email}</p>
                                            </>
                                        )}
                                    />
                                </div>
                            }
                        </fieldset>
                    }
                    <button
                        className="main-color-1"
                        type="submit"
                        disabled={!changed}
                    >
                        Salvar
                    </button>
                </form>
            </div>
            <Alert
                title={alertContent.title}
                message={alertContent.message}
                state={[isAlertActive, setIsAlertActive]}
            />
        </main>
    );
}