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
            isInvalid: false,
            message: 'Adicione ao menos uma opção válida!',
        },
        option: {
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

        if (!name) {
            newValidation.name = {
                isInvalid: true,
                message: "Nome inválido!",
            }
        }

        if (!description) {
            newValidation.description = {
                isInvalid: true,
                message: "Descrição inválida!",
            }
        }

        if (seconds > 120) {
            newValidation.seconds = {
                isInvalid: true,
                message: "Tempo longo demais!",
            }
        }

        if (!seconds) {
            newValidation.seconds = {
                isInvalid: true,
                message: "Valor não inserido!",
            }
        }

        if (seconds < 0) {
            newValidation.seconds = {
                isInvalid: true,
                message: "Valor inválido!",
            }
        }

        if (!sound) {
            newValidation.sound = {
                isInvalid: true,
                message: "Áudio não selecionado!",
            }
        }

        const OPTIONS = Object.values(options);

        if (OPTIONS.length < 1) {
            newValidation.options = {
                isInvalid: true,
                message: "Adicione ao menos uma opção válida!",
            }
        }

        OPTIONS.forEach(option => {
            const destination = option.destination === 'branch' ? 'branches' : option.destination + 's';

            if (!fetchedData[destination].some(item => item.id == option.value)) {
                newValidation.option[option.option] = {
                    isInvalid: true,
                    message: 'Valor inválido!',
                }
            }
        });

        if (Object.values(newValidation).some(item => item.isInvalid)) {
            veredict = false;
        }

        if (Object.values(newValidation.option).some(item => item.isInvalid)) {
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
            'options': 'options'
        }

        const fields = Object.keys(errors);

        const invalidFields = fields.map(field =>{
            if (field.match(/^options\./)) {
                return field.split('.');
            }

            return APIFields[field];
        });

        let newValidation = initialValidation;

        invalidFields.forEach((field, index) => {
            if (Array.isArray(field)) {
                const [, key] = field;
                const [message] = errors[field.join('.')];

                const option = Object.keys(options)[key];

                newValidation.option[option] = {
                    isInvalid: true,
                    message,
                }
            } else {
                const message = errors[fields[index]];
    
                newValidation[field] = {
                    isInvalid: true,
                    message,
                }
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

    const handleDestinationChange = (event, item) => {
        const newOptions = {...options};

        const [key, option] = Object.entries(newOptions).find(([index, option]) => option.option === item.option);

        newOptions[key] = {
            ...option,
            destination: event.target.value,
            value: '',
        };

        setOptions(newOptions);
    }

    const handleOptionChange = (event, item) => {
        const newOptions = {...options};

        const [key, option] = Object.entries(newOptions).find(([index, option]) => option.option === item.option);

        newOptions[key] = {
            ...option,
            value: event.target.value,
        };

        setOptions(newOptions);
    }

    const addOption = () => {
        const add = () => {
            let newAvailable = {};

            Object.entries(available).forEach(([index, item]) => {
                if (pick !== item) {
                    index = isNaN(index) ? index : parseInt(index);

                    if (index === 'i') {
                        index = 10;
                    }

                    if (index === 't') {
                        index = 11;
                    }

                    newAvailable[index] = {
                        option: item.option,
                        label: item.label,
                    }
                }
            });

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
            
            const [newPick] = Object.values(newAvailable);

            setPick(newPick);
        }

        if (Object.keys(options).length < 12) {
            add();
        }
    }

    const removeOption = (option) => {
        const remove = () => {
            let newOptions = {};
            let newAvailable = {...available};

            Object.entries(options).forEach(([index, item]) => {
                if (option === item) {
                    index = isNaN(index) ? index : parseInt(index);

                    if (index === 'i') {
                        index = 10;
                    }

                    if (index === 't') {
                        index = 11;
                    }

                    newAvailable[index] = {
                        option: item.option,
                        label: item.label,
                    }
                } else {
                    newOptions[index] = item;
                }
            });

            
            setOptions(newOptions);
            setAvailable(newAvailable);

            const [newPick] = Object.values(newAvailable);

            setPick(newPick);
        }

        if (Object.keys(options).length > 1) {
            remove();
        }
    }

    const showAlert = (content, response = false) => {
        success.current = response;

        setAlertContent(content);
        setIsAlertActive(true);
    }

    const submit = async () => {
        dispatch(setIsLoading(true));
        const OPTIONS = Object.values(options).map((item) => {
            const { option, destination, value } = item;

            return {
                option,
                destination,
                value,
            }
        })

        const body = {
            name: name.trim(),
            description: description.trim(),
            seconds,
            sound_id: sound,
            options: OPTIONS,
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
                                name,
                                description,
                                sound_id: sound,
                                seconds,
                                options,
                            } = response.data.ura;

                            setName(name);
                            setDescription(description);
                            setSeconds(seconds);
                            setSound(sound);

                            let newAvailable = available, newOptions = {};

                            options.forEach(item => {
                                const { option, destination, value } = item;
                                let index = option;

                                if (index === 'i') {
                                    index = '10';
                                }

                                if (index === 't') {
                                    index = '11';
                                }

                                newOptions[index] = {
                                    ...available[index],
                                    option,
                                    destination,
                                    value,
                                }

                                index = parseInt(index);

                                delete newAvailable[index];
                            });

                            setAvailable(newAvailable);
                            setOptions(newOptions);

                            const [newPick] = Object.values(newAvailable);

                            setPick(newPick);
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
                        {
                            Object.values(options).length < 12 &&
                            <div>{
                                <Input.Group
                                    id={`ura-add-option-`}
                                    label="Adicionar opções"
                                    validation={{
                                        isInvalid: validation.options.isInvalid,
                                        message: initialValidation.options.message,
                                    }}
                                >
                                    <Select
                                        id="pick"
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
                                        onClick={() => handleChange(() => addOption())}
                                    >
                                        <MdOutlineAdd fill="white"/>
                                    </button>
                                </Input.Group>
                            }</div>
                        }

                        {
                            Object.values(options).length > 0 &&
                            <div>{
                                Object.values(options).map((option, index) => (
                                    <Input.Group
                                        key={index}
                                        id={`ura-option-${option.option}-`}
                                        label={option.label}
                                        validation={validation.option[option.option]}
                                    >
                                        <Select
                                            id="destination"
                                            value={option.destination}
                                            onChange={(event) => handleChange(() => handleDestinationChange(event, option))}
                                        >
                                            <option value="branch">Ramal</option>
                                            <option value="queue">Fila de atendimento</option>
                                            <option value="ura">URA</option>
                                        </Select>

                                        <Select
                                            id="value"
                                            value={option.value}
                                            search
                                            onChange={(event) => handleChange(() => handleOptionChange(event, option))}
                                        >
                                            {
                                                fetchedData[option.destination === 'branch' ? 'branches' : option.destination + "s"].map((item, index) => {
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
                                            onClick={() => handleChange(() => removeOption(option))}
                                            disabled={Object.keys(options).length === 1}
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