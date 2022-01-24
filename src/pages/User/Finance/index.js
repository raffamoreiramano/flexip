import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../store/actions";

import api from "../../../services/api";
import { API_GUARD } from "../../../services/env";
import { BRLMask, fileToBase64 } from "../../../services/helpers";

import Table from "../../../components/Table";
import Input from "../../../components/Input";
import Alert from "../../../components/Modals/Alert";

import styles from './styles.module.css';

export default function Dashboard() {
    const dispatch = useDispatch();

    const initialRender = useRef(true);

    const [fetchedData, setFetchedData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const access_token = localStorage.getItem("access_token");

            if (access_token) {
                try {
                    const response = await api.get(`/v1/${API_GUARD}/financial/billing_forecast`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const { data } = response.data;
                        const [fetchedData] = data;

                        setFetchedData(fetchedData);
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

    const Extract = ({ data }) => {
        let total;

        if (!data) {
            data = {
                telephones: {
                    label: 'Telefone',
                    quantity: '...',
                    value: '...',
                    total: '...',
                },
                branches: {
                    label: 'Ramal',
                    quantity: '...',
                    value: '...',
                    total: '...',
                },
            }

            total = '...';
        } else {
            const {
                amount_branches,
                amount_telephones,
                qtd_branches,
                qtd_telephones,
                total_amount,
            } = data;

            total = BRLMask(total_amount, 100, 2);
    
            data = {
                telephones: {
                    label: 'Telefone',
                    quantity: qtd_telephones,
                    value: BRLMask((amount_telephones / qtd_telephones), 100, 2),
                    total: BRLMask(amount_telephones, 100, 2),
                },
                branches: {
                    label: 'Ramal',
                    quantity: qtd_branches,
                    value: BRLMask((amount_branches / qtd_branches), 100, 2),
                    total: BRLMask(amount_branches, 100, 2),
                },
            }
        }
        
        return (
            <article className={styles.extract}>
                <h2>Extrato</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Unidade</th>
                            <th>Quantidade</th>
                            <th>Valor unitário</th>
                            <th>Valor somatório</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.values(data).map((item, index) => (
                                <tr key={index}>
                                    <th>{item.label}</th>
                                    <td>{item.quantity}</td>
                                    <td>{item.value}</td>
                                    <td>{item.total}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total:</th>
                            <td></td>
                            <td></td>
                            <td>{total}</td>
                        </tr>
                    </tfoot>
                </Table>
            </article>
        );
    }

    const Credits = () => {
        const [isAlertActive, setIsAlertActive] = useState(false);
        const [alertContent, setAlertContent] = useState({
            title: "Ops!",
            message: "Parece que houve um erro... Por favor, tente mais tarde!"
        });

        const [file, setFile] = useState(null);

        const [isValidated, setIsValidated] = useState(false);

        const [validation, setValidation] = useState({
            isInvalid: false,
            message: '',
        });

        const cleanValidation = () => setValidation({
            isInvalid: false,
            message: '',
        });

        const handleChange = (callback) => {
            if (isValidated) {
                setIsValidated(false);
                cleanValidation();
            }
    
            callback.call();
        }

        const validate = () => {
            setIsValidated(true);

            if (!file) {
                setValidation({
                    isInvalid: true,
                    message: 'Escolha um arquivo válido!',
                });

                return false;
            }

            return true;
        }

        const showAlert = (content) => {
            setAlertContent(content);
            setIsAlertActive(true);
        }

        const submit = async () => {
            dispatch(setIsLoading(true));
    
            const body = {
                file: await fileToBase64(file),
            }
    
            try {
                const access_token = localStorage.getItem("access_token");
                const response = await api.post(`/v1/${API_GUARD}/financial/recharge/payment_voucher`, body, {
                    headers: { Authorization: "Bearer " + access_token }
                });
    
                if (response.status && response.status === 200) {
                    const { title, message } = response.data;
                    const content = { title, message };

                    setFile(null);
    
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
                        const [message] = errors;
    
                        setValidation({
                            isInvalid: true,
                            message
                        });
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
                <article className={`${styles.credits} glass`}>
                    <div>
                    <h2>Inserir de créditos</h2>
                        <section>
                            <h3>Banco Itaú</h3>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Agência</th>
                                        <td>0758</td>
                                    </tr>
                                    <tr>
                                        <th>Conta Corrente</th>
                                        <td>03696-6</td>
                                    </tr>
                                    <tr>
                                        <th>CNPJ</th>
                                        <td>18.811.175/0001-44</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                        <section>
                            <h3>PIX</h3>
                            <p>18811175000144</p>
                        </section>
                    </div>
                    <div>
                        <section>
                            <h3>Comprovante</h3>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();

                                    if (validate()) {
                                        submit();
                                    }
                                }}
                            >
                                <Input
                                    id="receipt-file"
                                    type="file"
                                    accept="*"
                                    name="file"
                                    label={"Arquivo"}
                                    placeholder="Escolher arquivo..."
                                    onChange={(event) => handleChange(() => {
                                        setFile(event.target.value);
                                    })}
                                    validation={validation}
                                    filename={{
                                        value: file?.name ? file.name : '',
                                    }}
                                />
                                <button type="submit">Enviar</button>
                            </form>
                        </section>
                    </div>
                </article>
                <Alert
                    title={alertContent.title}
                    message={alertContent.message}
                    state={[isAlertActive, setIsAlertActive]}
                />
            </>
        );
    }

    return (
        <main className={styles.main}>
            <Extract data={fetchedData}/>
            <Credits/>
        </main>
    );
}