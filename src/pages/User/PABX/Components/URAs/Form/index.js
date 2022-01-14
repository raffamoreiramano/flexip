import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../../store/actions";

import api from "../../../../../../services/api";
import { API_GUARD } from "../../../../../../services/env";

import styles from '../../styles.module.css';
import Input, { Select } from "../../../../../../components/Input";
import Alert from "../../../../../../components/Modals/Alert";

import { MdOutlineAdd, MdOutlineRemove } from 'react-icons/md';

export default function URAForm({ props }) {
    const { refresh, PABX, ura } = props;
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const success = useRef(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [seconds, setSeconds] = useState(1);
    const [sound, setSound] = useState('');

    const [available, setAvailable] = useState({
        0: { 
            option: "0",
            label: "Opção 0",
        },
        1: { 
            option: "1",
            label: "Opção 1",
        },
        2: { 
            option: "2",
            label: "Opção 2",
        },
        3: { 
            option: "3",
            label: "Opção 3",
        },
        4: { 
            option: "4",
            label: "Opção 4",
        },
        5: { 
            option: "5",
            label: "Opção 5",
        },
        6: { 
            option: "6",
            label: "Opção 6",
        },
        7: { 
            option: "7",
            label: "Opção 7",
        },
        8: { 
            option: "8",
            label: "Opção 8",
        },
        9: { 
            option: "9",
            label: "Opção 9",
        },
        10: {
            option: "i",
            label: "Inválida",
        },
        11: {
            option: "t",
            label: "Timeout",
        },
    });
    const [pick, setPick] = useState(available[0]);
    const [options, setOptions] = useState({});


    const [fetchedData, setFetchedData] = useState(null);

    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        name: {
            isInvalid: false,
            message: ''
        },
        description: {
            isInvalid: false,
            message: ''
        },
        seconds: {
            isInvalid: false,
            message: ''
        },
        sound: {
            isInvalid: false,
            message: ''
        },
        options: {
            '0': {
                isInvalid: false,
                message: ''
            },
            '1': {
                isInvalid: false,
                message: ''
            },
            '2': {
                isInvalid: false,
                message: ''
            },
            '3': {
                isInvalid: false,
                message: ''
            },
            '4': {
                isInvalid: false,
                message: ''
            },
            '5': {
                isInvalid: false,
                message: ''
            },
            '6': {
                isInvalid: false,
                message: ''
            },
            '7': {
                isInvalid: false,
                message: ''
            },
            '8': {
                isInvalid: false,
                message: ''
            },
            '9': {
                isInvalid: false,
                message: ''
            },
            'i': {
                isInvalid: false,
                message: '',
            },
            't': {
                isInvalid: false,
                message: ''
            },
        }
    }
    const [validation, setValidation] = useState(initialValidation);

    const validate = () => {
        let newValidation = initialValidation;
        let veredict = true;

        if (name.length > 40) {
            newValidation.name = {
                isInvalid: true,
                message: "Nome longo demais!",
            }
        }

        if (name.length < 3) {
            newValidation.name = {
                isInvalid: true,
                message: "Nome curto demais!",
            }
        }

        if (description.length > 140) {
            newValidation.description = {
                isInvalid: true,
                message: "Descrição longa demais!",
            }
        }

        if (seconds > 120) {
            newValidation.seconds = {
                isInvalid: true,
                message: "Tempo longo demais!",
            }
        }

        if (seconds < 1) {
            newValidation.seconds = {
                isInvalid: true,
                message: "Tempo curto demais!",
            }
        }

        if (!sound) {
            newValidation.sound = {
                isInvalid: true,
                message: "Áudio não selecionado!",
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
            'description': 'description',
            'seconds': 'seconds',
            'sound_id': 'sound',
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

    const handleDestinationChange = (props) => {
        console.log(props)
    }

    const handleOptionChange = (props) => {
        console.log(props)
    }

    const addOption = () => {
        const newAvailable = Object.values(available).filter((option) => {
            return option != pick;
        });

        if (newAvailable.length >= 1) {
            const [branch] = fetchedData.branches;
            const { id: value } = branch;

            setOptions({
                ...options,
                [pick.option]: {
                    ...pick,
                    destination: "branch",
                    value,
                }
            });
            
            setAvailable(newAvailable);
            setPick(newAvailable[0] || available[0]);
        }
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
            description: description.trim(),
            seconds,
            sound_id: sound,
            // options: optionsArray,
        }

        try {
            const access_token = localStorage.getItem("access_token");
            const response = ura 
            ? await api.put(`/v1/${API_GUARD}/pabx/${ID}/ura/${ura.id}`, body, {
                headers: { Authorization: "Bearer " + access_token }
            })
            : await api.post(`/v1/${API_GUARD}/pabx/${ID}/ura`, body, {
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
                const action = ura ? `${ura.id}/edit` : 'create';

                try {
                    const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/ura/${action}`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const {
                            branches,
                            uras,
                            queues,
                            sounds,
                        } = response.data;

                        if (ura) {
                            const {
                                name
                            } = response.data.ura;

                            setName(name);
                        }
                        
                        setFetchedData({
                            branches,
                            uras,
                            queues,
                            sounds,
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
                        <legend>{ura ? "Editar" : "Adicionar"}</legend>
                        <div>
                            <Input
                                id="ura-name"
                                name="name"
                                label="Nome"
                                placeholder="Nome da URA"
                                value={name}
                                onChange={(event) => handleChange(() => {
                                    setName(event.target.value);
                                })}
                                validation={validation.name}
                            />

                            <Input
                                id="ura-description"
                                name="description"
                                label="Descrição"
                                placeholder="Descrição da URA"
                                value={description}
                                onChange={(event) => handleChange(() => {
                                    setDescription(event.target.value);
                                })}
                                validation={validation.description}
                            />
                        </div>

                        <div>    
                            <Input
                                id="ura-seconds"
                                type="number"
                                name="seconds"
                                label="Timeout"
                                placeholder="Tempo em segundos"
                                value={seconds}
                                onChange={(event) => handleChange(() => {
                                    setSeconds(event.target.value);
                                })}
                                validation={validation.seconds}
                            />

                            <Select
                                id="ura-sound"
                                name="sound"
                                label="Áudio"
                                value={sound}
                                onChange={(event) => handleChange(() => {
                                    setSound(event.target.value);
                                })}
                                validation={validation.sound}
                            >
                                {
                                    fetchedData.sounds.map((item, index) => {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        );
                                    })
                                }
                            </Select>
                        </div>
                    </fieldset>

                    <fieldset className={styles.options}>
                        <legend>Opções</legend>
                        <div>
                            <Input.Group
                                id="ura-option-"
                                label="Adicionar"
                                validation={validation.options[0]}
                            >
                                <Select
                                    id="ura-pick"
                                    label="Adicionar opção"
                                    value={pick.option}
                                    onChange={(event) => handleChange(() => {
                                        const { value } = event.target;
                                        const pick = Object.values(available).find(item => item.option === value);

                                        setPick(pick);
                                    })}
                                >
                                    {
                                        Object.values(available).map((item, index) => (
                                            <option key={index} value={item.option}>{item.label}</option>
                                        ))
                                    }
                                </Select>

                                <button
                                    className="main-color-1"
                                    type="button"
                                    onClick={addOption}
                                >
                                    <MdOutlineAdd fill="white"/>
                                </button>
                            </Input.Group>
                        </div>
                        {
                            Object.values(options).length > 0 &&
                            <div>{
                                Object.values(options).map((option, index) => (
                                    <Input.Group
                                        key={index}
                                        id={`ura-option-${option.option}`}
                                        label={option.label}
                                        validation={validation.options[option.option]}
                                    >
                                        <Select
                                            id="ura-destination"
                                            onChange={(event) => handleDestinationChange(event)}
                                        >
                                            <option value="branch">Ramal</option>
                                            <option value="queue">Fila de atendimento</option>
                                            <option value="ura">URA</option>
                                        </Select>

                                        <Select
                                            id="ura-option"
                                            onChange={(event) => handleOptionChange(event)}
                                        >
                                            {
                                                fetchedData[option.destination === 'branch' ? 'branches' : option.destination].map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.id}>
                                                            {
                                                                option.destination === 'branch'
                                                                ? `${item.branch_users.name} (${item.number})`
                                                                : item.name
                                                            }
                                                        </option>
                                                    );
                                                })
                                            }
                                        </Select>

                                        <button
                                            className="main-color-4"
                                            type="button"
                                        >
                                            <MdOutlineRemove fill="white"/>
                                        </button>
                                    </Input.Group>
                                ))
                            }</div>
                        }
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
                            ura 
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