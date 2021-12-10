import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../store/actions";

import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

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

    const callsPerHourInitialState = [];

    for (let num = 0; num < 12; num++) {
        const now = new Date();
        now.setUTCHours(now.getUTCHours() - num, 0, 0, 0);

        callsPerHourInitialState.push({
            count: 0,
            datetime: now.toLocaleString('pt-BR'),
        });
    }

    const [callsPerHour, setCallsPerHour] = useState(callsPerHourInitialState.reverse());

    useEffect(() => {
        const fetchData = async () => {
            const access_token = localStorage.getItem("access_token");

            if (access_token) {
                try {
                    const response = await api.get(`/v1/${API_GUARD}/dashboard`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const {
                            call_dispositions: callDisposition,
                            call_chart: callsPerHour,
                        } = response.data;

                        const {
                            total,
                            answered,
                            busy,
                            no_answered: notAnswered,
                            no: noResponse
                        } = callDisposition;

                        setCallDisposition({
                            total,
                            answered,
                            busy,
                            notAnswered,
                            noResponse,
                        });

                        setCallsPerHour(callsPerHour.reverse());
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
                <h2>Nenhuma ligação realizada</h2>
                <div>
                    <div>
                        <section>
                            <h3>Atendida</h3>
                            <p>0 <small>100%</small></p>
                        </section>
                        <section>
                            <h3>Ocupadas</h3>
                            <p>0 <small>100%</small></p>
                        </section>
                    </div>
                    <div>
                        <section>
                            <h3>Não atendidas</h3>
                            <p>0 <small>100%</small></p>
                        </section>
                        <section>
                            <h3>Sem resposta</h3>
                            <p>0 <small>100%</small></p>
                        </section>
                    </div>
                </div>
            </>
        );

        if (total === 1) {
            children = (
                <>
                    <h2><strong>1</strong> ligação realizada</h2>
                    <div>
                        <div>
                            <section>
                                <h3>Atendida</h3>
                                <p>{answered.total} <small>{answered.percentage}%</small></p>
                            </section>
                            <section>
                                <h3>Ocupada</h3>
                                <p>{busy.total} <small>{busy.percentage}%</small></p>
                            </section>
                        </div>
                        <div>
                            <section>
                                <h3>Não atendida</h3>
                                <p>{notAnswered.total} <small>{notAnswered.percentage}%</small></p>
                            </section>
                            <section>
                                <h3>Sem resposta</h3>
                                <p>{noResponse.total} <small>{noResponse.percentage}%</small></p>
                            </section>
                        </div>
                    </div>
                </>
            );
        }

        if (total > 1) {
            children = (
                <>
                    <h2><strong>{total}</strong> chamadas realizadas</h2>
                    <div>
                        <div>
                            <section>
                                <h3>Atendidas</h3>
                                <p>{answered.total} <small>{answered.percentage}%</small></p>
                            </section>
                            <section>
                                <h3>Ocupadas</h3>
                                <p>{busy.total} <small>{busy.percentage}%</small></p>
                            </section>
                        </div>
                        <div>
                            <section>
                                <h3>Não atendidas</h3>
                                <p>{notAnswered.total} <small>{notAnswered.percentage}%</small></p>
                            </section>
                            <section>
                                <h3>Sem resposta</h3>
                                <p>{noResponse.total} <small>{noResponse.percentage}%</small></p>
                            </section>
                        </div>
                    </div>
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

    const CallsPerHour = () => {
        const data = callsPerHour;

        const CustomTooltip = ({ active, payload, label }) => {
            if (active) {
                const count = payload?.at(0)?.payload?.count || 0;
                const time = label.substr(11, 5);
                const calls = count > 1 ? "chamadas" : "chamada";
                return (
                    <aside className={`${styles.customTooltip} glass`}>
                        <h3>{`${count} ${calls}`}</h3>
                        <time>{`${time}H`}</time>
                    </aside>
                );
            }

            return null;
        };

        return (
            <article className={`${styles.callsPerHour} glass`}>
                <h2>Ligações por hora</h2>
                <div className={styles.chart}>
                    <ResponsiveContainer>
                        <ComposedChart data={data} throttleDelay={250}>
                            <defs>
                                <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(var(--main-color-1))" stopOpacity={0.1} />
                                    <stop offset="75%" stopColor="rgb(var(--main-color-1))" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="line" x1="0" x2="1" y1="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(var(--main-color-1))" stopOpacity={0.5} />
                                    <stop offset="5%" stopColor="rgb(var(--main-color-1))" stopOpacity={0.75} />
                                    <stop offset="100%" stopColor="rgb(var(--main-color-1))" stopOpacity={0.5} />
                                </linearGradient>
                                <linearGradient id="bar" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(var(--input-color))" stopOpacity={0} />
                                    <stop offset="20%" stopColor="rgb(var(--input-color))" stopOpacity={0} />
                                    <stop offset="25%" stopColor="rgb(var(--input-color))" stopOpacity={1} />
                                    <stop offset="100%" stopColor="rgb(var(--input-color))" stopOpacity={1} />
                                </linearGradient>
                            </defs>

                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="url(#line)"
                                fill="url(#area)"
                                strokeWidth={2}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                dot={{r: 2}}
                                animationDuration={2500}
                            />

                            <Bar
                                type="monotone"
                                dataKey="count"
                                fill="url(#bar)"
                                barSize={2}
                                from={0}
                            />

                            <XAxis
                                dataKey="datetime"
                                stroke="rgb(var(--text-color))"
                                minTickGap={5}
                                tickFormatter={(data) => data.substr(11, 5)}
                            />

                            <YAxis
                                dataKey="count"
                                tickLine={false}
                                stroke="rgb(var(--text-color))"
                                allowDecimals={false}
                            />

                            <Tooltip
                                content={<CustomTooltip />}
                                animationEasing="ease-in-out"
                                animationDuration={300}
                            />

                            <CartesianGrid
                                opacity={.5}
                                vertical={false}
                                stroke="rgb(var(--text-color))"
                                strokeWidth={.25}
                                strokeDasharray={[5, 5]}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </article>
        )
    }

    return (
        <main className={styles.main}>
            <CallDisposition />
            <CallsPerHour />
        </main>
    );
}