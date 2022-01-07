import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../../store/actions";

import api from "../../../../../../services/api";
import { API_GUARD } from "../../../../../../services/env";

import { phoneMask } from '../../../../../../services/helpers';

import styles from '../../styles.module.css';
import { Select } from "../../../../../../components/Input";
import Alert from "../../../../../../components/Modals/Alert";

export default function TelephoneForm({ props }) {
    const { refresh, PABX } = props;
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const success = useRef(false);

    const [cities, setCities] = useState(null);
    const [city, setCity] = useState('');

    const [telephones, setTelephones] = useState(null);
    const [telephone, setTelephone] = useState('');

    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        city: {
            isInvalid: false,
            message: ''
        },
        telephone: {
            isInvalid: false,
            message: ''
        },
    }
    const [validation, setValidation] = useState(initialValidation);

    const validate = () => {
        let newValidation = initialValidation;
        let veredict = true;

        if (!city) {
            newValidation.city = {
                isInvalid: true,
                message: "Selecione uma cidade!",
            }
        }

        if (!telephone) {
            newValidation.telephone = {
                isInvalid: true,
                message: "Selecione um número!",
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

    const showAlert = (content, response = false) => {
        success.current = response;

        setAlertContent(content);
        setIsAlertActive(true);
    }

    const submit = async () => {
        dispatch(setIsLoading(true));

        const body = {
            telephone_id: telephone,
        }

        try {
            const access_token = localStorage.getItem("access_token");
            const response = await api.post(`/v1/${API_GUARD}/pabx/${ID}/telephone`, body, {
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
                    const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/telephone/create`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const { cities } = response.data;

                        setCities(cities);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (initialRender.current) {
            initialRender.current = false;
            dispatch(setIsLoading(true));

            fetchData().finally(() => {
                dispatch(setIsLoading(false));
            });
        }
    });

    useEffect(() => {
        const fetchPhones = async () => {
            try {
                const response = await api.get(`/v1/${API_GUARD}/auth/telephones/city/${city}`);

                if (response.status && response.status === 200) {
                    const { telephones } = response.data;

                    setTelephones(null);
                    setTelephones(telephones);
                }
            } catch (error) {
                if (error.response) {
                    console.log(error.response);
                } else {
                    console.log(error);
                }
            } finally {
                dispatch(setIsLoading(false));
                
            }
        }

        if (cities) {
            dispatch(setIsLoading(true));

            fetchPhones();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city]);

    if (!cities) {
        return <p className={styles.nodata}>. . .</p>
    }

    return (
        <>
            <section className={styles.form}>
                <form onSubmit={(event) => {
                    event.preventDefault();

                    if (validate()) {
                        submit();
                    }
                }}>
                    <fieldset>
                        <legend>Vincular novo telefone</legend>
                        <div>
                            <Select
                                id="city"
                                label="Cidade"
                                name="city"
                                placeholder="Cidades disponíveis..."
                                value={city}
                                onChange={(event) => handleChange(() => {
                                    setCity(event.target.value);
                                })}
                                validation={validation.city}
                            >
                                {
                                    cities.map((item, index) => {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        );
                                    })
                                }
                            </Select>
                            {
                                telephones && 
                                <Select
                                    id="telephone"
                                    label="Telefone"
                                    name="telephone"
                                    value={telephone}
                                    onChange={(event) => handleChange(() => {
                                        setTelephone(event.target.value);
                                    })}
                                    validation={validation.telephone}
                                >
                                    {
                                        telephones.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{phoneMask(item.ddd + item.number)}</option>
                                            );
                                        })
                                    }
                                </Select>
                            }
                        </div>
                    </fieldset>

                    <div className={styles.formActions}>
                        <button
                            className="main-color-4"
                            type="button"
                            onClick={refresh}
                        >
                            Cancelar
                        </button>
                        <button
                            className="main-color-2"
                            type="submit"
                        >
                            Vincular
                        </button>
                    </div>
                </form>
            </section>
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