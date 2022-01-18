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

export default function BranchForm({ props }) {
    const { refresh, PABX, branch } = props;
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const success = useRef(false);

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

        if ((!branch && !validatePassword(password)) || (branch && password && !validatePassword(password))) {
            newValidation.password = {
                isInvalid: true,
                message: "Senha inválida!",
            }
        }
        
        if ((!branch && !validatePassword(webPassword)) || (branch && webPassword && !validatePassword(webPassword))) {
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

    const validateByResponse = (errors) => {
        const APIFields = {
            'name': 'name',
            'number': 'number',
            'email': 'email',
            'secret': 'password',
            'password': 'webPassword',
            'password_blocked': 'blockedPassword',
            'externalNumber': 'externalNumber',
            'port': 'port',
            'callLimit': 'callLimit',
            'nat': 'NAT',
            'dtmf': 'DTMF',
            'codecId': 'CODEC',
            'callGroupId': 'department',
            'pickupGroupId': 'pickUpGroup',
            'qualify': 'latency',
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

        try {
            const access_token = localStorage.getItem("access_token");
            const response = branch 
            ? await api.put(`/v1/${API_GUARD}/pabx/${ID}/branch/${branch.id}`, body, {
                headers: { Authorization: "Bearer " + access_token }
            })
            : await api.post(`/v1/${API_GUARD}/pabx/${ID}/branch`, body, {
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
                const action = branch ? `${branch.id}/edit` : 'create';

                try {
                    const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/branch/${action}`, {
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

                        let data = {
                            phoneList,
                            NATList,
                            DTMFList,
                            departmentList,
                            pickUpGroupList,
                            CODECList
                        }
                        
                        if (branch) {
                            const {
                                branch_users,
                                number,
                                external_number,
                                port,
                                call_limit,
                                nat,
                                dtmf,
                                codecs,
                                call_group_id,
                                pickup_groups,
                                qualify,
                            } = response.data.branch;

                            const CODEC = codecs.map(item => item.id);
                            const pickUpGroup = pickup_groups.map(item => item.id);

                            const { id: externalNumber } = phoneList.find(item => item.ddd + item.number === external_number);

                            setName(branch_users.name);
                            setNumber(number);
                            setEmail(branch_users.email);
                            setPassword("");
                            setWebPassword("");
                            setBlockedPassword(!!branch_users.password_blocked);
                            setExternalNumber(externalNumber || mainPhone?.id);
                            setPort(port);
                            setCallLimit(call_limit);
                            setNAT(nat.id);
                            setDTMF(dtmf.id);
                            setCODEC(CODEC);
                            setDepartment(call_group_id);
                            setPickUpGroup(pickUpGroup);
                            setLatency(!!qualify);
                        }

                        setFetchedData(data);
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
                        <legend>{branch ? "Editar" : "Adicionar"}</legend>
                        <div>
                            <Input
                                id="branch-name"
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
                                id="branch-number"
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
                                id="branch-email"
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
                                id="branch-password"
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
                                id="branch-webPassword"
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
                                id="branch-blockedPassword"
                                name="blockedPassword"
                                label="Senha bloqueada"
                                value={blockedPassword}
                                onChange={(event) => handleChange(() => {
                                    setBlockedPassword(event.value);
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
                                    id="branch-externalNumber"
                                    name="externalNumber"
                                    label="Número externo"
                                    placeholder="Números disponíveis..."
                                    search
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
                                    id="branch-port"
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
                                    id="branch-callLimit"
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
                                    id="branch-NAT"
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
                                    id="branch-DTMF"
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
                                    id="branch-CODEC"
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
                                    id="branch-department"
                                    name="department"
                                    label="Departamento"
                                    search
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
                                    id="branch-pickUpGroup"
                                    name="pickUpGroup"
                                    label="Grupo de captura"
                                    search
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
                                    id="branch-latency"
                                    name="latency"
                                    label="Latência"
                                    value={latency}
                                    onChange={(event) => handleChange(() => {
                                        setLatency(event.value);
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
                        {
                            branch 
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