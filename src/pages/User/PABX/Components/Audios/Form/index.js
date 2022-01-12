import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../../store/actions";

import api from "../../../../../../services/api";
import { API_GUARD } from "../../../../../../services/env";

import styles from '../../styles.module.css';
import Input from "../../../../../../components/Input";
import Audio from "../../../../../../components/Audio";
import Alert from "../../../../../../components/Modals/Alert";
import { fileToBase64 } from "../../../../../../services/helpers";

export default function AudioForm({ props }) {
    const { refresh, PABX, audio, category = "sound" } = props;
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const success = useRef(false);

    const [name, setName] = useState('');
    const [file, setFile] = useState(null);

    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        audio: {
            isInvalid: false,
            message: ''
        },
    }

    const fileConstraints = {
        nameLength: {
            min: 3,
            max: 100,
        },
        size: 10000000,
        types: [
            "audio/wav",
            "audio/x-wav",
            "audio/gsm",
            "audio/x-gsm"
        ],
    }

    const [validation, setValidation] = useState(initialValidation);

    const validate = () => {
        let newValidation = initialValidation;
        let veredict = true;

        if (!name) {
            newValidation.audio = {
                isInvalid: true,
                message: "Nome inválido!",
            }
        }

        if (name.length < fileConstraints.nameLength.min) {
            newValidation.audio = {
                isInvalid: true,
                message: "Nome do áudio é curto demais!",
            }
        }
        
        if (name.length > fileConstraints.nameLength.max) {
            newValidation.audio = {
                isInvalid: true,
                message: "Nome do áudio é longo demais!",
            }
        }

        if (file) {
            if (file.size === 0) {
                newValidation.audio = {
                    isInvalid: true,
                    message: "Nenhum arquivo selecionado!",
                }
            }
    
            if (!fileConstraints.types.includes(file.type)) {
                newValidation.audio = {
                    isInvalid: true,
                    message: "Tipo de arquivo de áudio inválido!",
                }
            }
            
            if (file.size > fileConstraints.size) {
                newValidation.audio = {
                    isInvalid: true,
                    message: "Arquivo grande demais!",
                }
            }
        } else {
            newValidation.audio = {
                isInvalid: true,
                message: "Nenhum arquivo selecionado!",
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
            'name': 'audio',
            'file': 'audio',
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

    const preview = useMemo(() => {
        cleanValidation();

        
        if (fileConstraints.types.includes(file?.type)) {
            const nameInput = document.getElementById('audio-file-filename');

            nameInput.focus();

            return URL.createObjectURL(file);
        }

        return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);

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
            file: await fileToBase64(file),
        }

        try {
            const access_token = localStorage.getItem("access_token");
            const response = audio 
            ? await api.put(`/v1/${API_GUARD}/pabx/${ID}/${category}/${audio.id}`, body, {
                headers: { Authorization: "Bearer " + access_token }
            })
            : await api.post(`/v1/${API_GUARD}/pabx/${ID}/${category}`, body, {
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
                    const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/${category}/${audio.id}/edit`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const {
                            name,
                            full_audio_link: url,
                        } = response.data.sound;

                        const requestOptions = {
                            method: 'GET',
                            headers: {
                                'Authorization': "Bearer " + access_token
                            },
                        };

                        const fetchFile = async () => {
                            return await fetch(url, requestOptions)
                            .then(response => response.arrayBuffer())
                            .then(arrayBuffer => {
                                const blob = new Blob([arrayBuffer], { type: "audio/wav" });
                            
                                return blob;
                            })
                            .then(blob => {
                                return URL.createObjectURL(blob);
                            })
                            .catch((error) => {
                                return null;
                            });
                        }
                    
                        const file = await fetchFile();

                        if (file) {
                            setFile(file);
                        }

                        setName(name);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (initialRender.current) {
            initialRender.current = false;

            if (audio) {
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
                <form onSubmit={(event) => {
                    event.preventDefault();

                    if (validate()) {
                        submit();
                    }
                }}>
                    <fieldset>
                        <legend>{audio ? "Editar" : "Adicionar"}</legend>
                        <Input
                            id="audio-file"
                            type="file"
                            accept="audio/*"
                            name="file"
                            label={category === "sound" ? "Áudio" : "Áudio de espera"}
                            placeholder="Escolher arquivo de áudio..."
                            onChange={(event) => handleChange(() => {
                                setFile(event.target.value);
                            })}
                            validation={validation.audio}
                            filename={{
                                value: name,
                                onChange: (event) => handleChange(() => {
                                    setName(event.target.value)
                                }),
                                validation: validation.name,
                            }}
                        />
                        {preview && <Audio src={preview} title={`Reproduzir: ${file.name}`}/>}
                        
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
                            audio 
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