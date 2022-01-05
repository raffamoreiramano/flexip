import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../../store/actions";

import api from "../../../../../../services/api";
import { API_GUARD } from "../../../../../../services/env";

import { phoneMask, validateEmail, validatePassword, validatePhone } from '../../../../../../services/helpers';

import styles from '../../styles.module.css';
import Input, { Checkboxes, Radio, Select } from "../../../../../../components/Input";
import { IoIosArrowUp } from "react-icons/io";
import Alert from "../../../../../../components/Modals/Alert";

export default function AddBranch({ props }) {
    const { refresh, PABX } = props
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const alertRef = useRef(false);

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [webPassword, setWebPassword] = useState('');
    const [blockedPassword, setBlockedPassword] = useState(false);
    
    const [externalNumber, setExternalNumber] = useState('');
    const [NAT, setNAT] = useState(4);
    const [port, setPort] = useState(5060);
    const [callLimit, setCallLimit] = useState(1);
    const [DTMF, setDTMF] = useState(1);
    const [CODEC, setCODEC] = useState([1, 2, 3]);
    const [department, setDepartment] = useState('');
    const [pickUpGroup, setPickUpGroup] = useState('');
    const [latency, setLatency] = useState(true);

    const [fetchedData, setFetchedData] = useState(null);

    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        name: {
            isInvalid: false,
            message: ''
        },
        number: {
            isInvalid: false,
            message: ''
        },
        email: {
            isInvalid: false,
            message: ''
        },
        password: {
            isInvalid: false,
            message: ''
        },
        webPassword: {
            isInvalid: false,
            message: ''
        },
        blockedPassword: {
            isInvalid: false,
            message: ''
        },
        externalNumber: {
            isInvalid: false,
            message: ''
        },
        NAT: {
            isInvalid: false,
            message: ''
        },
        port: {
            isInvalid: false,
            message: ''
        },
        callLimit: {
            isInvalid: false,
            message: ''
        },
        DTMF: {
            isInvalid: false,
            message: ''
        },
        department: {
            isInvalid: false,
            message: ''
        },
        pickUpGroup: {
            isInvalid: false,
            message: ''
        },
        latency: {
            isInvalid: false,
            message: ''
        },
    }
    const [validation, setValidation] = useState(initialValidation);

    const validate = () => {
        let newValidation = initialValidation;
        let veredict = true;

        if (name.length < 4) {
            newValidation.name = {
                isInvalid: true,
                message: "Nome inválido!",
            }
        }

        if (!validatePhone(number)) {
            newValidation.number = {
                isInvalid: true,
                message: "Número inválido!",
            }
        }

        if (!validateEmail(email)) {
            newValidation.email = {
                isInvalid: true,
                message: "E-mail inválido!",
            }
        }

        if (!validatePassword(password)) {
            newValidation.password = {
                isInvalid: true,
                message: "Senha inválida!",
            }
        }

        if (!validatePassword(webPassword)) {
            newValidation.webPassword = {
                isInvalid: true,
                message: "Senha inválida!",
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

    const submit = async () => {
        dispatch(setIsLoading(true));

        const selectedExternalNumber = fetchedData.phoneList.find(item => item.id === externalNumber);
        const externalNumberDigits = selectedExternalNumber.ddd + selectedExternalNumber.number;

        const body = {
            name: name.trim(),
            number,
            email: email.trim(),
            secret: password.trim(),
            password: webPassword.trim(),
            password_blocked: blockedPassword,
            externalNumber: externalNumberDigits,
            port,
            callLimit,
            nat: NAT,
            dtmf: DTMF,
            codecId: CODEC,
            callGroupId: department,
            pickupGroupId: pickUpGroup,
            qualify: latency,
            routeGroupId: "", // medida provisória
        }

        console.log(body)

        try {
            const access_token = localStorage.getItem("access_token");
            const response = await api.post(`/v1/${API_GUARD}/pabx/${ID}/branch`, body, {
                headers: { Authorization: "Bearer " + access_token }
            });

            if (response.status && response.status === 200) {
                const { title, message } = response.data;

                setAlertContent({
                    title,
                    message,
                });

                alertRef.current = true;

                setIsAlertActive(true);
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

            alertRef.current = false;

            setAlertContent(content);
            setIsAlertActive(true);
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
                    const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/branch/create`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const {
                            telephones: phoneList,
                            natTable: NATList,
                            dtmfTable: DTMFList,
                            callGroups: departmentList,
                            pickupGroups: pickUpGroupList,
                            codecs: CODECList,
                        } = response.data;

                        const mainPhone = phoneList.find(item => !!item.main);
                        
                        if (mainPhone) {
                            setExternalNumber(mainPhone.id);
                        }
                        
                        setFetchedData({
                            phoneList,
                            NATList,
                            DTMFList,
                            departmentList,
                            pickUpGroupList,
                            CODECList
                        });

                        // remover futuramente
                        console.log(response.data);
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
                <form onSubmit={(event) => {
                    event.preventDefault();

                    if (validate()) {
                        submit();
                    }
                }}>
                    <fieldset>
                        <legend>Adicionar</legend>
                        <div>
                            <Input
                                id="name"
                                name="name"
                                label="Nome"
                                placeholder="Nome do responsável"
                                value={name}
                                onChange={(event) => handleChange(() => {
                                    setName(event.target.value);
                                })}
                                validation={validation.name}
                            />

                            <Input
                                id="number"
                                type="tel"
                                name="number"
                                label="Número"
                                placeholder="Número do ramal"
                                value={number}
                                onChange={(event) => handleChange(() => {
                                    setNumber(event.target.value);
                                })}
                                validation={validation.number}
                            />
                        </div>

                        <div>    
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                label="E-mail"
                                value={email}
                                onChange={(event) => handleChange(() => {
                                    setEmail(event.target.value);
                                })}
                                validation={validation.email}
                            />

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                label="Senha"
                                value={password}
                                onChange={(event) => handleChange(() => {
                                    setPassword(event.target.value);
                                })}
                                validation={validation.password}
                            />
                        </div>

                        <div>    
                            <Input
                                id="webPassword"
                                type="password"
                                name="webPassword"
                                label="Senha web"
                                value={webPassword}
                                onChange={(event) => handleChange(() => {
                                    setWebPassword(event.target.value);
                                })}
                                validation={validation.webPassword}
                            />

                            <Radio 
                                id="blockedPassword"
                                name="blockedPassword"
                                label="Senha bloqueada"
                                value={blockedPassword}
                                onChange={(event) => handleChange(() => {
                                    setBlockedPassword(event.target.value);
                                })}
                                validation={validation.blockedPassword}
                            >
                                <option value={true}>Sim</option>
                                <option value={false}>Não</option>
                            </Radio>
                        </div>
                    </fieldset>

                    <fieldset>
                        <input className={styles.fieldsetToggle} type="checkbox" id="add-branch-advanced-toggle"/>
                        <label className={styles.fieldsetButton} htmlFor="add-branch-advanced-toggle">
                            <legend><span>Avançado</span><i><IoIosArrowUp/></i></legend>
                        </label>

                        <div className={styles.fieldsetContent}>
                            <div>
                                <Select
                                    id="externalNumber"
                                    type="tel"
                                    name="externalNumber"
                                    label="Número externo"
                                    placeholder="Números disponíveis..."
                                    value={externalNumber}
                                    onChange={(event) => handleChange(() => {
                                        setExternalNumber(event.target.value);
                                    })}
                                    validation={validation.externalNumber}
                                >
                                    {
                                        fetchedData.phoneList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{phoneMask(item.ddd + item.number)}</option>
                                            );
                                        })
                                    }
                                </Select>
                                
                                <Input
                                    id="port"
                                    type="number"
                                    name="port"
                                    label="Porta"
                                    placeholder="Número de porta"
                                    value={port}
                                    onChange={(event) => handleChange(() => {
                                        setPort(event.target.value);
                                    })}
                                    validation={validation.port}
                                />

                                <Input
                                    id="callLimit"
                                    type="number"
                                    name="callLimit"
                                    label="Limite de chamadas"
                                    placeholder="0 para ilimitado"
                                    value={callLimit}
                                    onChange={(event) => handleChange(() => {
                                        setCallLimit(event.target.value);
                                    })}
                                    validation={validation.callLimit}
                                />
                            </div>

                            <div>
                                <Select
                                    id="NAT"
                                    name="NAT"
                                    label="NAT"
                                    value={NAT}
                                    onChange={(event) => handleChange(() => {
                                        setNAT(event.target.value);
                                    })}
                                    validation={validation.NAT}
                                >
                                    {
                                        fetchedData.NATList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            );
                                        })
                                    }
                                </Select>

                                <Select
                                    id="DTMF"
                                    name="DTMF"
                                    label="DTMF"
                                    value={DTMF}
                                    onChange={(event) => handleChange(() => {
                                        setDTMF(event.target.value);
                                    })}
                                    validation={validation.DTMF}
                                >
                                    {
                                        fetchedData.DTMFList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            );
                                        })
                                    }
                                </Select>
                                
                                <Checkboxes 
                                    id="CODEC"
                                    name="CODEC"
                                    label="CODEC"
                                    value={CODEC}
                                    onChange={(event) => handleChange(() => {
                                        setCODEC(event.value);
                                    })}
                                    validation={validation.CODEC}
                                >
                                    {
                                        fetchedData.CODECList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            );
                                        })
                                    }
                                </Checkboxes>
                            </div>
                            
                            <div>
                                <Select
                                    id="department"
                                    name="department"
                                    label="Departamento"
                                    value={department}
                                    onChange={(event) => handleChange(() => {
                                        setDepartment(event.target.value);
                                    })}
                                    validation={validation.department}
                                >
                                    {
                                        fetchedData.departmentList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            );
                                        })
                                    }
                                </Select>

                                <Select
                                    id="pickUpGroup"
                                    name="pickUpGroup"
                                    label="Grupo de captura"
                                    value={pickUpGroup}
                                    onChange={(event) => handleChange(() => {
                                        setPickUpGroup(event.target.value);
                                    })}
                                    validation={validation.pickUpGroup}
                                >
                                    {
                                        fetchedData.pickUpGroupList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            );
                                        })
                                    }
                                </Select>

                                <Radio 
                                    id="latency"
                                    name="latency"
                                    label="Latência"
                                    value={latency}
                                    onChange={(event) => handleChange(() => {
                                        setLatency(event.target.value);
                                    })}
                                    validation={validation.latency}
                                >
                                    <option value={true}>Sim</option>
                                    <option value={false}>Não</option>
                                </Radio>
                            </div>
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
                            className="main-color-1"
                            type="submit"
                        >
                            Adicionar
                        </button>
                    </div>
                </form>
            </section>
            <Alert
                ref={alertRef}
                title={alertContent.title}
                message={alertContent.message}
                state={[isAlertActive, setIsAlertActive]}
                onClose={() => {
                    if (alertRef.current) {
                        refresh();
                    }
                }}
            />
        </>
    );
}