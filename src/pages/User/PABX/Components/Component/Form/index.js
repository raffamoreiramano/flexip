import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../../store/actions";

import api from "../../../../../../services/api";
import { API_GUARD } from "../../../../../../services/env";

import styles from '../../styles.module.css';
import Input, { Radio, Select } from "../../../../../../components/Input";
import Alert from "../../../../../../components/Modals/Alert";

export default function ComponentForm({ props }) {
    const { refresh, PABX, komponent } = props;
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const success = useRef(false);

    const [name, setName] = useState('');
    const [SELECT, setSELECT] = useState('');
    const [RADIO, setRADIO] = useState('');

    const [fetchedData, setFetchedData] = useState(null);

    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        name: {
            isInvalid: false,
            message: ''
        },
    }
    const [validation, setValidation] = useState(initialValidation);

    const validate = () => {
        let newValidation = initialValidation;
        let veredict = true;

        if (!name) {
            newValidation.name = {
                isInvalid: true,
                message: "Nome inválido!",
            }
        }

        if (!SELECT) {
            newValidation.SELECT = {
                isInvalid: true,
                message: "SELECT inválido!",
            }
        }

        if (!RADIO) {
            newValidation.RADIO = {
                isInvalid: true,
                message: "RADIO inválido!",
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
        }

        try {
            const access_token = localStorage.getItem("access_token");
            const response = komponent 
            ? await api.put(`/v1/${API_GUARD}/pabx/${ID}/komponent/${komponent.id}`, body, {
                headers: { Authorization: "Bearer " + access_token }
            })
            : await api.post(`/v1/${API_GUARD}/pabx/${ID}/komponent`, body, {
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
                const action = komponent ? `${komponent.id}/edit` : 'create';

                try {
                    const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/komponent/${action}`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const {
                            SELECT
                        } = response.data;

                        if (komponent) {
                            const {
                                name
                            } = response.data.komponent;

                            setName(name);
                        }
                        
                        setFetchedData({
                            SELECT,
                        });
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

    if (!fetchedData) {
        return <p className={styles.nodata}>. . .</p>
    }

    return (
        <>
            <section className={styles.form}>
                <form autoComplete="off" onSubmit={(event) => {
                    event.preventDefault();

                    if (validate()) {
                        submit();
                    }
                }}>
                    <fieldset>
                        <legend>{komponent ? "Editar" : "Adicionar"}</legend>
                        <Input
                            id="komponent-name"
                            name="name"
                            label="Nome"
                            placeholder="Nome"
                            value={name}
                            onChange={(event) => handleChange(() => {
                                setName(event.target.value);
                            })}
                            validation={validation.name}
                        />

                        <Select
                            id="komponent-SELECT"
                            name="SELECT"
                            label="Select"
                            value={SELECT}
                            onChange={(event) => handleChange(() => {
                                setSELECT(event.target.value);
                            })}
                            validation={validation.SELECT}
                        >
                            {
                                fetchedData.SELECT.map((item, index) => {
                                    return (
                                        <option key={index} value={item.id}>{item.name}</option>
                                    );
                                })
                            }
                        </Select>

                        <Radio 
                            id="komponent-RADIO"
                            name="RADIO"
                            label="Radio"
                            value={RADIO}
                            onChange={(event) => handleChange(() => {
                                setRADIO(event.value);
                            })}
                            validation={validation.RADIO}
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
                            komponent 
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