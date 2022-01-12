import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../../store/actions";

import api from "../../../../../../services/api";
import { API_GUARD } from "../../../../../../services/env";

import styles from '../../styles.module.css';
import Input from "../../../../../../components/Input";
import Alert from "../../../../../../components/Modals/Alert";

export default function DepartmentForm({ props }) {
    const { refresh, PABX, department } = props;
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const success = useRef(false);

    const [name, setName] = useState('');

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
            newValidation.city = {
                isInvalid: true,
                message: "Nome inválido!",
            }

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
            name,
        }

        try {
            const access_token = localStorage.getItem("access_token");
            const response = department 
            ? await api.put(`/v1/${API_GUARD}/pabx/${ID}/classification/${department.id}`, body, {
                headers: { Authorization: "Bearer " + access_token }
            })
            : await api.post(`/v1/${API_GUARD}/pabx/${ID}/classification`, body, {
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
                    const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/classification/${department.id}/edit`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const { name } = response.data.classification;

                        setName(name);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (initialRender.current) {
            initialRender.current = false;

            if (department) {
                dispatch(setIsLoading(true));
    
                fetchData().finally(() => {
                    dispatch(setIsLoading(false));
                });
            }
        }
    });

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
                        <legend>{department ? "Editar" : "Adicionar"}</legend>
                        <Input
                            id="department-name"
                            name="name"
                            label="Nome"
                            placeholder="Nome do departamento"
                            value={name}
                            onChange={(event) => handleChange(() => {
                                setName(event.target.value);
                            })}
                            validation={validation.name}
                        />
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
                            department 
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