import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../../store/actions";

import api from "../../../../../../services/api";
import { API_GUARD } from "../../../../../../services/env";

import styles from '../../styles.module.css';
import Input, { Select } from "../../../../../../components/Input";
import Alert from "../../../../../../components/Modals/Alert";

export default function ReportForm({ props }) {
    const { setData } = props;

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });

    const date = new Date(Date.now());
    date.setHours(date.getHours() - date.getTimezoneOffset() / 60);

    const todayStart = date.toJSON().slice(0, 10) + "T00:00";
    const todayEnd = date.toJSON().slice(0, 10) + "T23:59";


    const [start, setStart] = useState(todayStart);
    const [end, setEnd] = useState(todayEnd);

    const [type, setType] = useState('');
    const [trunk, setTrunk] = useState('');

    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');

    const [flow, setFlow] = useState('');
    const [disposition, setDisposition] = useState('');

    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        start: {
            isInvalid: false,
            message: '',
        },
        end: {
            isInvalid: false,
            message: '',
        },
        source: {
            isInvalid: false,
            message: '',
        },
        destination: {
            isInvalid: false,
            message: '',
        },
        type: {
            isInvalid: false,
            message: '',
        },
        trunk: {
            isInvalid: false,
            message: '',
        },
        flow: {
            isInvalid: false,
            message: '',
        },
        disposition: {
            isInvalid: false,
            message: '',
        },
    }
    const [validation, setValidation] = useState(initialValidation);

    const validate = () => {
        let newValidation = initialValidation;
        let veredict = true;

        if (Object.values(newValidation).some(item => item.isInvalid)) {
            veredict = false;
        }

        setValidation(newValidation);
        setIsValidated(true);

        return veredict;
    }

    const validateByResponse = (errors) => {
        const APIFields = {
            'time_call_started': 'start',
            'time_call_ended': 'end',
            'disposition': 'disposition',
            'account_code': 'source',
            'destination': 'destination',
            'destination_context': 'flow',
            'call_type': 'type',
            'last_apps_arguments': 'trunk',
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

    const cleanFilters = () => {
        setValidation(initialValidation);

        setType('');
        setTrunk('');

        setSource('');
        setDestination('');

        setFlow('');
        setDisposition('');

        setIsValidated(true);
    }

    const handleChange = (callback) => {
        if (isValidated) {
            setIsValidated(false);
            cleanValidation();
        }

        callback.call();
    }

    const showAlert = (content) => {
        setAlertContent(content);
        setIsAlertActive(true);
    }

    const submit = async () => {
        dispatch(setIsLoading(true));

        const body = {
            call_type: type,
            disposition,
            time_call_started: start.replace("/", "-").replace("T", " ") + ":00",
            time_call_ended: end.replace("/", "-").replace("T", " ") + ":00",
            account_code: source,
            destination,
            last_apps_arguments: trunk,
            destination_context: flow,
        }

        try {
            const access_token = localStorage.getItem("access_token");
            const response = await api.post(`/v1/${API_GUARD}/call_detail_record/filter`, body, {
                headers: { Authorization: "Bearer " + access_token }
            });

            if (response.status && response.status === 200) {
                const {
                    call_detail_records,
                    total_amount: amount,
                    total_call_duration: duration,
                } = response.data;

                const records = Array.isArray(call_detail_records) ? call_detail_records : Object.values(call_detail_records) || [];

                setData({
                    records,
                    amount,
                    duration,
                });
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
                        <legend>Filtros</legend>
                        <div>
                            <Input
                                id="filter-start"
                                type="datetime-local"
                                name="start"
                                label="Início"
                                value={start}
                                onChange={(event) => handleChange(() => {
                                    setStart(event.target.value);
                                })}
                                validation={validation.start}
                            />

                            <Input
                                id="filter-end"
                                type="datetime-local"
                                name="end"
                                label="Fim"
                                value={end}
                                onChange={(event) => handleChange(() => {
                                    setEnd(event.target.value);
                                })}
                                validation={validation.end}
                            />

                            <Select
                                id="filter-disposition"
                                name="disposition"
                                label="Status"
                                value={disposition}
                                placeholder={'. . .'}
                                onChange={(event) => handleChange(() => {
                                    setDisposition(event.target.value);
                                })}
                                validation={validation.disposition}
                            >
                                <option value="">. . .</option>
                                <option value="Atendida">Atendida</option>
                                <option value="Não Atendida">Não Atendida</option>
                                <option value="Não">Não</option>
                                <option value="Ocupado">Ocupado</option>
                                <option value="Falhou">Falhou</option>
                                <option value="Desconhecida">Desconhecida</option>
                            </Select>
                        </div>

                        <div>
                            <Input
                                id="filter-source"
                                type="tel"
                                name="source"
                                label="Origem"
                                value={source}
                                placeholder={'. . .'}
                                onChange={(event) => handleChange(() => {
                                    setSource(event.target.value);
                                })}
                                validation={validation.source}
                            />

                            <Input
                                id="filter-destination"
                                type="tel"
                                name="destination"
                                label="Destino"
                                value={destination}
                                placeholder={'. . .'}
                                onChange={(event) => handleChange(() => {
                                    setDestination(event.target.value);
                                })}
                                validation={validation.destination}
                            />

                            <Select
                                id="filter-flow"
                                name="flow"
                                label="Fluxo"
                                value={flow}
                                placeholder={'. . .'}
                                onChange={(event) => handleChange(() => {
                                    setFlow(event.target.value);
                                })}
                                validation={validation.flow}
                            >
                                <option value="">. . .</option>
                                <option value="Entrada">Entrada</option>
                                <option value="Saída">Saída</option>
                            </Select>
                        </div>

                        <div>
                            <Select
                                id="filter-type"
                                name="type"
                                label="Tipo"
                                value={type}
                                placeholder={'. . .'}
                                onChange={(event) => handleChange(() => {
                                    setType(event.target.value);
                                })}
                                validation={validation.type}
                            >
                                <option value="">. . .</option>
                                <option value="Fixo">Fixo</option>
                                <option value="Móvel">Móvel</option>
                                <option value="Internacional">Internacional</option>
                                <option value="0800">0800</option>
                                <option value="Fila">Fila</option>
                                <option value="URA">URA</option>
                            </Select>

                            <Input
                                id="filter-trunk"
                                name="trunk"
                                label="Tronco"
                                value={trunk}
                                placeholder={'. . .'}
                                onChange={(event) => handleChange(() => {
                                    setTrunk(event.target.value);
                                })}
                                validation={validation.trunk}
                            />
                        </div>
                    </fieldset>

                    <div className={styles.formActions}>
                        <button
                            className="main-color-4"
                            type="button"
                            onClick={cleanFilters}
                        >
                            Limpar
                        </button>
                        <button
                            className="main-color-1"
                            type="submit"
                        >
                            Buscar
                        </button>
                    </div>
                </form>
            </section>
            <Alert
                title={alertContent.title}
                message={alertContent.message}
                state={[isAlertActive, setIsAlertActive]}
            />
        </>
    );
}