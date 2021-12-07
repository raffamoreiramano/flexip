import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../store/actions";

import api from "../../../services/api";
import { API_GUARD } from "../../../services/env";

import styles from './styles.module.css';

export default function Dashboard({ history }) {
    const dispatch = useDispatch();

    const initialRender = useRef(true);

    const [callDisposition, setCallDisposition] = useState({
        total: {
            total: 0,
            percentage: 0,
        },
        answered: {
            total: 0,
            percentage: 0,
        },
        busy: {
            total: 0,
            percentage: 0,
        },
        notAnswered: {
            total: 0,
            percentage: 0,
        },
        noResponse: {
            total: 0,
            percentage: 0,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            const access_token = localStorage.getItem("access_token");

            if (access_token) {
                try {
                    const response = await api.get(`/v1/${API_GUARD}/dashboard`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const { call_dispositions: callDispositionData } = response.data;
                        const { 
                            total,
                            answered,
                            busy,
                            no_answered: notAnswered,
                            no: noResponse
                        } = callDispositionData;

                        const newCallDisposition = {
                            total,
                            answered,
                            busy,
                            notAnswered,
                            noResponse,
                        }

                        setCallDisposition(newCallDisposition);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (initialRender.current) {
            dispatch(setIsLoading(true));
            
            fetchData().finally(() => {
                dispatch(setIsLoading(false));

                initialRender.current = false;
            });
        }
    });

    const CallDisposition = () => {
        const { total } = callDisposition.total;
        const { answered, busy, notAnswered, noResponse } = callDisposition;
        let children = (
            <>
                <h2>Nenhuma chamada realizada</h2>
                <section>
                    <h3>Atendida</h3>
                    <p>0 <small>100%</small></p>
                </section>
                <section>
                    <h3>Ocupadas</h3>
                    <p>0 <small>100%</small></p>
                </section>
                <section>
                    <h3>Não atendidas</h3>
                    <p>0 <small>100%</small></p>
                </section>
                <section>
                    <h3>Sem resposta</h3>
                    <p>0 <small>100%</small></p>
                </section>
            </>
        );

        if (total === 1) {
            children = (
                <>
                    <h2><strong>1</strong> chamada realizada</h2>
                    <section>
                        <h3>Atendida</h3>
                        <p>{answered.total} <small>{answered.percentage}%</small></p>
                    </section>
                    <section>
                        <h3>Ocupada</h3>
                        <p>{busy.total} <small>{busy.percentage}%</small></p>
                    </section>
                    <section>
                        <h3>Não atendida</h3>
                        <p>{notAnswered.total} <small>{notAnswered.percentage}%</small></p>
                    </section>
                    <section>
                        <h3>Sem resposta</h3>
                        <p>{noResponse.total} <small>{noResponse.percentage}%</small></p>
                    </section>
                </>
            );
        }

        if (total > 1) {
            children = (
                <>
                    <h2><strong>{total}</strong> chamadas realizadas</h2>
                    <section>
                        <h3>Atendidas</h3>
                        <p>{answered.total} <small>{answered.percentage}%</small></p>
                    </section>
                    <section>
                        <h3>Ocupadas</h3>
                        <p>{busy.total} <small>{busy.percentage}%</small></p>
                    </section>
                    <section>
                        <h3>Não atendidas</h3>
                        <p>{notAnswered.total} <small>{notAnswered.percentage}%</small></p>
                    </section>
                    <section>
                        <h3>Sem resposta</h3>
                        <p>{noResponse.total} <small>{noResponse.percentage}%</small></p>
                    </section>
                </>
            );
        }

        return (
            <article
                className={`${styles.callDisposition} glass`}
            >
                {children}
            </article>
        );
    }

    return (
        <main>
            <CallDisposition />
        </main>
    );
}