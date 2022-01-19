import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../../store/actions";

import api from "../../../../../../services/api";
import { API_GUARD } from "../../../../../../services/env";

import styles from '../../styles.module.css';
import Input, { Radio, Select } from "../../../../../../components/Input";
import Alert from "../../../../../../components/Modals/Alert";
import Reorderable from "../../../../../../components/Reorderable";

import { MdOutlineAdd } from 'react-icons/md';

export default function QueueForm({ props }) {
    const { refresh, PABX, queue } = props;
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
    const [distribute, setDistribute] = useState(true);
    const [giveUpTime, setGiveUpTime] = useState('');
    const [join, setJoin] = useState(true);
    const [max, setMax] = useState('');
    const [sound, setSound] = useState('');
    const [playSound, setPlaySound] = useState(true);
    const [callTime, setCallTime] = useState('');
    const [record, setRecord] = useState(true);
    const [seconds, setSeconds] = useState('');
    const [strategy, setStrategy] = useState('');
    const [branches, setBranches] = useState([]);

    const [fetchedData, setFetchedData] = useState(null);
    const [available, setAvailable] = useState([]);
    const [pick, setPick] = useState({});


    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        name: {
            isInvalid: false,
            message: '',
        },
        description: {
            isInvalid: false,
            message: '',
        },
        seconds: {
            isInvalid: false,
            message: '',
        },
        distribute: {
            isInvalid: false,
            message: '',
        },
        giveUpTime: {
            isInvalid: false,
            message: '',
        },
        join: {
            isInvalid: false,
            message: '',
        },
        max: {
            isInvalid: false,
            message: '',
        },
        sound: {
            isInvalid: false,
            message: '',
        },
        playSound: {
            isInvalid: false,
            message: '',
        },
        callTime: {
            isInvalid: false,
            message: '',
        },
        record: {
            isInvalid: false,
            message: '',
        },
        strategy: {
            isInvalid: false,
            message: '',
        },
    }
    const [validation, setValidation] = useState(initialValidation);

    const validate = () => {
        let newValidation = initialValidation;
        let veredict = true;

        if (name.length < 3) {
            newValidation.name = {
                isInvalid: true,
                message: "Nome curto demais!",
            }
        }

        if (name.length > 40) {
            newValidation.name = {
                isInvalid: true,
                message: "Nome longo demais!",
            }
        }

        if (description.length < 3) {
            newValidation.description = {
                isInvalid: true,
                message: "Descrição curta demais!",
            }
        }

        if (description.length > 140) {
            newValidation.description = {
                isInvalid: true,
                message: "Descrição longa demais!",
            }
        }

        if (seconds < 0) {
            newValidation.seconds = {
                isInvalid: true,
                message: "Tempo curto demais!",
            }
        }

        if (callTime < 0) {
            newValidation.callTime = {
                isInvalid: true,
                message: "Tempo curto demais!",
            }
        }

        if (giveUpTime < 0) {
            newValidation.giveUpTime = {
                isInvalid: true,
                message: "Tempo curto demais!",
            }
        }

        if (max < 0) {
            newValidation.giveUpTime = {
                isInvalid: true,
                message: "Limite inválido!",
            }
        }

        if (!sound) {
            newValidation.sound = {
                isInvalid: true,
                message: "Áudio inválido!",
            }
        }

        if (!strategy) {
            newValidation.strategy = {
                isInvalid: true,
                message: "Estragégia inválida!",
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
            'distribute_calls': 'distribute',
            'give_up_time': 'giveUpTime',
            'join_empty_queue': 'join',
            'max_call_waiting': 'max',
            'music_on_hold_id': 'sound',
            'play_music_on_hold': 'playSound',
            'queue_call_time': 'callTime',
            'record_call': 'record',
            'seconds': 'seconds',
            'strategy_id': 'strategy',
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

    const addBranch = () => {
        const add = () => {
            let newAvailable = [];

            available.forEach((item) => {
                if (pick !== item) {
                    newAvailable.push(item);
                }
            });

            const [branch] = available;

            setBranches([...branches, branch]);

            setAvailable(newAvailable);
            
            const [newPick] = newAvailable;

            setPick(newPick);
        }

        if (available.length > 0) {
            add();
        }
    }

    useEffect(() => {
        if (fetchedData) {
            let newAvailable = [];
            
            fetchedData.branches.forEach(branch => {
                if (!branches.some(item => item.id === branch.id)) {
                    newAvailable.push(branch);
                }
            });


            setAvailable(newAvailable);

            const [newPick] = newAvailable;
            setPick(newPick);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branches.length]);

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
            distribute_calls: distribute,
            give_up_time: giveUpTime,
            join_empty_queue: join,
            max_call_waiting: max,
            music_on_hold_id: sound,
            play_music_on_hold: playSound,
            queue_call_time: callTime,
            record_call: record,
            seconds,
            strategy_id: strategy,
            branches: branches.map(branch => branch.id),
        }

        try {
            const access_token = localStorage.getItem("access_token");
            const response = queue 
            ? await api.put(`/v1/${API_GUARD}/pabx/${ID}/queue/${queue.id}`, body, {
                headers: { Authorization: "Bearer " + access_token }
            })
            : await api.post(`/v1/${API_GUARD}/pabx/${ID}/queue`, body, {
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
                const action = queue ? `${queue.id}/edit` : 'create';

                try {
                    const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/queue/${action}`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const {
                            music_on_holds: sounds,
                            strategies,
                        } = response.data;

                        const { branches: available } = response.data;
                        let newAvailable = available;

                        if (queue) {
                            const {
                                name,
                                description,
                                distribute_calls: distribute,
                                give_up_time: giveUpTime,
                                join_empty_queue: join,
                                max_call_waiting: max,
                                music_on_hold_id: sound,
                                play_music_on_hold: playSound,
                                queue_call_time: callTime,
                                record_call: record,
                                seconds,
                                strategy_id: strategy,
                                branches,
                            } = response.data.queue;

                            newAvailable = available.filter(item => {
                                return !branches.some(branch => branch.id === item.id);
                            });

                            setName(name);
                            setDescription(description);
                            setDistribute(!!distribute);
                            setGiveUpTime(giveUpTime);
                            setJoin(!!join);
                            setMax(max);
                            setSound(sound);
                            setPlaySound(!!playSound);
                            setCallTime(callTime);
                            setRecord(!!record);
                            setSeconds(seconds);
                            setStrategy(strategy);
                            setBranches(branches.map(branch => {
                                const { id, number, pabx_id } = branch;

                                return { id, number, pabx_id };
                            }));
                        }

                        setAvailable(newAvailable);

                        const [pick] = newAvailable;
                        setPick(pick);

                        setFetchedData({
                            sounds,
                            strategies,
                            branches: available,
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
                        <legend>{queue ? "Editar" : "Adicionar"}</legend>
                        <div>
                            <Input
                                id="queue-name"
                                name="name"
                                label="Nome"
                                placeholder="Nome da fila"
                                value={name}
                                onChange={(event) => handleChange(() => {
                                    setName(event.target.value);
                                })}
                                validation={validation.name}
                            />

                            <Input
                                id="queue-description"
                                name="description"
                                label="Descrição"
                                placeholder="Descrição da fila"
                                value={description}
                                onChange={(event) => handleChange(() => {
                                    setDescription(event.target.value);
                                })}
                                validation={validation.description}
                            />
                        </div>

                        <div>
                            <Input
                                id="queue-seconds"
                                type="number"
                                name="seconds"
                                label="Segundos"
                                placeholder="Tempo que irá tocar em cada ramal"
                                value={seconds}
                                onChange={(event) => handleChange(() => {
                                    setSeconds(event.target.value);
                                })}
                                validation={validation.seconds}
                            />

                            <Input
                                id="queue-callTime"
                                type="number"
                                name="callTime"
                                label="Tempo de chamada na fila"
                                placeholder="Em segundos"
                                value={callTime}
                                onChange={(event) => handleChange(() => {
                                    setCallTime(event.target.value);
                                })}
                                validation={validation.callTime}
                            />
                        </div>

                        <div>
                            <Select
                                id="queue-strategy"
                                name="strategy"
                                label="Estratégia"
                                value={strategy}
                                onChange={(event) => handleChange(() => {
                                    setStrategy(event.target.value);
                                })}
                                validation={validation.strategy}
                            >
                                {
                                    fetchedData.strategies.map((item, index) => {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        );
                                    })
                                }
                            </Select>
                            
                            <Radio 
                                id="queue-distribute"
                                name="distribute"
                                label="Distribuir chamadas..."
                                value={distribute}
                                onChange={(event) => handleChange(() => {
                                    setDistribute(event.value);
                                })}
                                validation={validation.distribute}
                            >
                                <option value={true}>MESMO SE NÃO ATENDIDAS.</option>
                                <option value={false}>SOMENTE SE ATENDIDAS</option>
                            </Radio>
                        </div>

                        <div>
                            <Select
                                id="queue-sound"
                                name="sound"
                                label="Áudio de espera"
                                value={sound}
                                search
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

                            <Radio 
                                id="queue-playSound"
                                name="playSound"
                                label="Reproduzir..."
                                value={playSound}
                                onChange={(event) => handleChange(() => {
                                    setPlaySound(event.value);
                                })}
                                validation={validation.playSound}
                            >
                                <option value={true}>ÁUDIO SELECIONADO</option>
                                <option value={false}>RING PADRÃO</option>
                            </Radio>
                        </div>

                        

                        <div>
                            <Input
                                id="queue-giveUpTime"
                                type="number"
                                name="giveUpTime"
                                label="Tempo de desistência"
                                placeholder="Se o cliente desligar dentro do tempo em segundos é contada desistência"
                                value={giveUpTime}
                                onChange={(event) => handleChange(() => {
                                    setGiveUpTime(event.target.value);
                                })}
                                validation={validation.giveUpTime}
                            />
                            
                            <Input
                                id="queue-max"
                                type="number"
                                name="max"
                                label="Máximo de chamadas"
                                placeholder="Limite de chamadas em espera. (0 = ilimitado)"
                                value={max}
                                onChange={(event) => handleChange(() => {
                                    setMax(event.target.value);
                                })}
                                validation={validation.max}
                            />
                        </div>


                        <div>
                            <Radio 
                                id="queue-join"
                                name="join"
                                label="Entrar na fila mesmo sem ramais"
                                value={join}
                                onChange={(event) => handleChange(() => {
                                    setJoin(event.value);
                                })}
                                validation={validation.join}
                            >
                                <option value={true}>SIM</option>
                                <option value={false}>NÃO</option>
                            </Radio>

                            <Radio 
                                id="queue-record"
                                name="record"
                                label="Gravar chamadas que passarem da fila"
                                value={record}
                                onChange={(event) => handleChange(() => {
                                    setRecord(event.value);
                                })}
                                validation={validation.record}
                            >
                                <option value={true}>SIM</option>
                                <option value={false}>NÃO</option>
                            </Radio>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>RAMAIS</legend>
                        {
                            Object.values(available).length > 0 &&
                            <div>{
                                <Input.Group
                                    id={`queue-add-option-`}
                                    label="Adicionar"
                                >
                                    <Select
                                        id="pick"
                                        label="Adicionar ramal"
                                        search
                                        value={pick.id}
                                        onChange={(event) => handleChange(() => {
                                            const { value } = event.target;
                                            const pick = Object.values(available).find(item => item.id == value);

                                            setPick(pick);
                                        })}
                                    >
                                        {
                                            Object.values(available).map((branch, index) => (
                                                <option key={index} value={branch.id}>{branch.number}</option>
                                            ))
                                        }
                                    </Select>

                                    <button
                                        className="main-color-1"
                                        type="button"
                                        onClick={() => handleChange(() => addBranch())}
                                    >
                                        <MdOutlineAdd fill="white"/>
                                    </button>
                                </Input.Group>
                            }</div>
                        }

                        {
                            Object.values(branches).length > 0 &&
                            <div>
                                <Reorderable
                                    state={[branches, setBranches]}
                                    content={(branch) => (
                                        <>
                                            <p>{branch.number}</p>
                                        </>
                                    )}
                                />
                            </div>
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
                            queue 
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