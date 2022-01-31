import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../../store/actions";

import api from "../../../../../../services/api";
import { API_GUARD } from "../../../../../../services/env";

import styles from '../../styles.module.css';
import Input, { Radio, Select } from "../../../../../../components/Input";
import Alert from "../../../../../../components/Modals/Alert";
import { IPMask, phoneMask } from "../../../../../../services/helpers";

export default function InputRouteForm({ props }) {
    const { refresh, PABX, route } = props;
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const success = useRef(false);

    const [name, setName] = useState('');
    const [DDR, setDDR] = useState('');
    const [recordCalls, setRecordCalls] = useState(true);
    const [destinationType, setDestinationType] = useState('branch');
    const [destination, setDestination] = useState('');

    const [fetchedData, setFetchedData] = useState(null);

    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        name: {
            isInvalid: false,
            message: ''
        },
        DDR: {
            isInvalid: false,
            message: ''
        },
        recordCalls: {
            isInvalid: false,
            message: ''
        },
        destinationType: {
            isInvalid: false,
            message: ''
        },
        destination: {
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
        
        if (!DDR) {
            newValidation.DDR = {
                isInvalid: true,
                message: "Selecione um número!",
            }
        }
        
        if (!destinationType) {
            newValidation.destinationType = {
                isInvalid: true,
                message: "Selecione um tipo de destino!",
            }
        }
        
        if (!destination) {
            newValidation.destination = {
                isInvalid: true,
                message: "Destino inválido!",
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
            'telephone_id': 'DDR',
            'record_call': 'recordCalls',
            'destination': 'destinationType',
            'destination_items': 'destination',
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
            telephone_id: DDR,
            record_call: recordCalls,
            destination: destinationType,
            destination_items: [destination],
        }

        try {
            const access_token = localStorage.getItem("access_token");
            const response = route 
            ? await api.put(`/v1/${API_GUARD}/pabx/${ID}/entry_route/${route.id}`, body, {
                headers: { Authorization: "Bearer " + access_token }
            })
            : await api.post(`/v1/${API_GUARD}/pabx/${ID}/entry_route`, body, {
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
                const action = route ? `${route.id}/edit` : 'create';

                try {
                    const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/entry_route/${action}`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const {
                            branches: branchList,
                            queues,
                            telephones,
                            uras,
                        } = response.data;

                        if (route) {
                            const {
                                name,
                                telephone_id: DDR,
                                record_call,
                                destination: destinationType,
                                destination_items,
                            } = response.data.entry_route;

                            const recordCalls = !!record_call;
                            const destination = destination_items[0];

                            setName(name);
                            setDDR(DDR);
                            setRecordCalls(recordCalls);
                            setDestinationType(destinationType);
                            setDestination(destination);
                        }

                        const branches = branchList.map(branch => {
                            const { id, number, branch_users, nat } = branch;
                            const { name } = branch_users;
                            const { name: NAT } = nat;

                            return {
                                id,
                                number,
                                name,
                                NAT
                            }
                        });
                        
                        setFetchedData({
                            branches,
                            queues,
                            telephones,
                            uras,
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

    const Destination = () => {
        if (destinationType === "ip") {
            return (
                <Input
                    id="input-route-destination"
                    name="destination"
                    label="IP"
                    placeholder="IP de destino"
                    value={destination}
                    onChange={(event) => handleChange(() => {
                        setDestination(IPMask(event.target.value));
                    })}
                    validation={validation.destination}
                />
            );
        }

        let key = `${destinationType}s`;
        let label;

        let map = ((item, index) => {
            return (
                <option
                    key={index}
                    value={item.id}
                >
                    {item.name}
                </option>
            );
        });

        switch (destinationType) {
            case "queue":
                label = "Fila de atentimento";
                break;
            case "ura":
                label = "URA";
                break;
            default:
                label = "Ramal";
                key = "branches";
                map = (item, index) => {
                    return (
                        <option
                            key={index}
                            value={item.id}
                        >
                            {item.name} {`(${item.number})`}
                        </option>
                    );
                }
        }



        return (
            <Select
                id="input-route-destination"
                name="destination"
                label={label}
                search
                value={destination}
                onChange={(event) => handleChange(() => {
                    setDestination(event.target.value);
                })}
                validation={validation.destination}
            >
                {
                    fetchedData[key].map(map)
                }
            </Select>
        );
    }

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
                        <legend>{route ? "Editar" : "Adicionar"}</legend>
                        <Input
                            id="input-route-name"
                            name="name"
                            label="Nome"
                            placeholder="Nome da rota"
                            value={name}
                            onChange={(event) => handleChange(() => {
                                setName(event.target.value);
                            })}
                            validation={validation.name}
                        />

                        <Select
                            id="input-route-DDR"
                            name="DDR"
                            label="DDR"
                            search
                            value={DDR}
                            onChange={(event) => handleChange(() => {
                                setDDR(event.target.value);
                            })}
                            validation={validation.DDR}
                        >
                            {
                                fetchedData.telephones.map((item, index) => {
                                    return (
                                        <option key={index} value={item.id}>{phoneMask(item.ddd + item.number)}</option>
                                    );
                                })
                            }
                        </Select>

                        <Radio 
                            id="input-route-recordCalls"
                            name="recordCalls"
                            label="Gravar chamadas"
                            value={recordCalls}
                            onChange={(event) => handleChange(() => {
                                setRecordCalls(event.target.value);
                            })}
                            validation={validation.recordCalls}
                        >
                            <option value={true}>Sim</option>
                            <option value={false}>Não</option>
                        </Radio>
                    </fieldset>

                    <fieldset>
                        <legend>Destino</legend>
                        <Select
                            id="input-route-destinationType"
                            name="destinationType"
                            label="Tipo"
                            value={destinationType}
                            onChange={(event) => handleChange(() => {
                                setDestinationType(event.target.value);
                                setDestination('');
                            })}
                            validation={validation.destinationType}
                        >
                            <option value="branch">Ramal</option>
                            <option value="queue">Fila de atendimento</option>
                            <option value="ura">URA</option>
                            <option value="ip">IP</option>
                        </Select>

                        { Destination() }
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
                            route 
                            ? <button
                                className="main-color-2"
                                type="submit"
                            >
                                Salvar
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