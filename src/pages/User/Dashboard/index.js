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
    PieChart,
    Pie,
    Cell,
    Label,
} from 'recharts';
import { BsCurrencyDollar } from "react-icons/bs";

import api from "../../../services/api";
import { API_GUARD } from "../../../services/env";

import styles from './styles.module.css';
import { BRLMask } from "../../../services/helpers";

export default function Dashboard() {
    const dispatch = useDispatch();

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

    const [callsPerType, setCallsPerType] = useState([
        { name: 'Fixo', value: 0 },
        { name: 'Móvel', value: 0 },
        { name: '0800', value: 0 },
        { name: 'Internacional', value: 0 },
    ]);

    const [balance, setBalance] = useState({
        credits: 0,
        activeCalls: 0,
        chargedCalls: 0,
        spokenMinutes: 0,
        chargedMinutes: 0,
        callValue: 0,
        chargedValue: 0,
    });

    const initialRender = useRef(true);

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
                            call_types_percentage: callTypesPercentage,
                            available_balance: credits,
                            active_calls: activeCalls,
                            number_of_calls_charged: chargedCalls,
                            total_minutes: spokenMinutes,
                            time_charged: chargedMinutes,
                            medium_value_per_call: callValue,
                            total_value: chargedValue,
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

                        const callsPerType = [
                            { name: 'Fixo', value: callTypesPercentage["fixed_telephone_tariff"] },
                            { name: 'Móvel', value: callTypesPercentage["mobile_telephone_tariff"] },
                            { name: '0800', value: callTypesPercentage["0800_telephone_tariff"] },
                            { name: 'Internacional', value: callTypesPercentage["international_telephone_tariff"] },
                        ];

                        setCallsPerType(callsPerType);

                        const balance = {
                            credits,
                            activeCalls,
                            chargedCalls,
                            spokenMinutes,
                            chargedMinutes,
                            callValue,
                            chargedValue,
                        }

                        setBalance(balance);
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
                                dot={{ r: 2 }}
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
        );
    }

    const CallsPerType = () => {
        const data = callsPerType;

        const [active, setActive] = useState({
            value: '',
            name: '',
            fill: 'transparent',
        });

        return (
            <article className={`${styles.callsPerType} glass`}>
                <h2>Tipos das ligações</h2>
                <div className={styles.legend}>
                    <ul>
                        {
                            data.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setActive({
                                            value: item.value,
                                            name: item.name,
                                            fill: `rgb(var(--main-color-${index + 1}))`,
                                        });
                                    }}
                                    className={item.name === active.name ? styles.active : ''}
                                >
                                    <span>{item.name}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className={styles.chart}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                strokeWidth={0}
                                strokeOpacity={0}
                                startAngle={450}
                                endAngle={90}
                                innerRadius="50%"
                                onClick={(event) => {
                                    setActive(event);
                                }}
                                labelLine
                            >
                                {
                                    data.map((item, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`rgb(var(--main-color-${index + 1}))`}
                                            stroke={`rgb(var(--main-color-${index + 1}))`}
                                            strokeWidth={item.name === active.name ? 5 : 0}
                                            strokeOpacity={1}
                                        />
                                    ))
                                }

                                <Label value={`${active.value}%`} position="center" fill={active.fill} fontWeight="bold" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </article>
        );
    }

    const CallsPerQueue = () => {
        const data = [
            { name: 'Fila 1', value: 0 },
            { name: 'Fila 2', value: 0 },
            { name: 'Fila 3', value: 0 },
            { name: 'Fila 4', value: 0 },
            { name: 'Fila 5', value: 0 },
        ];

        const [active, setActive] = useState({
            value: '',
            name: '',
            fill: 'transparent',
        });

        return (
            <article className={`${styles.callsPerQueue} glass`}>
                <h2>Ligações por fila</h2>
                <div className={styles.legend}>
                    <ul>
                        {
                            data.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setActive({
                                            value: item.value,
                                            name: item.name,
                                            fill: `rgb(var(--main-color-${index + 1}))`,
                                        });
                                    }}
                                    className={item.name === active.name ? styles.active : ''}
                                >
                                    <span>{item.name}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className={styles.chart}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                strokeWidth={0}
                                strokeOpacity={0}
                                startAngle={450}
                                endAngle={90}
                                innerRadius="50%"
                                onClick={(event) => {
                                    setActive(event);
                                }}
                                labelLine
                            >
                                {
                                    data.map((item, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`rgb(var(--main-color-${index + 1}))`}
                                            stroke={`rgb(var(--main-color-${index + 1}))`}
                                            strokeWidth={item.name === active.name ? 5 : 0}
                                            strokeOpacity={1}
                                        />
                                    ))
                                }

                                <Label value={active.value} position="center" fill={active.fill} fontWeight="bold" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </article>
        );
    }

    const Balance = () => {
        return (
            <article className={styles.balance}>
                <section className="glass" data-value={initialRender.current ? 1 : balance.credits}>
                    <h3>Créditos</h3>
                    <p>{BRLMask(balance.credits)}</p>
                    <i><BsCurrencyDollar /></i>
                </section>
                <table>
                    <tbody>
                        <tr>
                            <th>Ligações ativas</th>
                            <td>{balance.activeCalls}</td>
                        </tr>
                        <tr>
                            <th>Ligações cobradas</th>
                            <td>{balance.chargedCalls}</td>
                        </tr>
                    </tbody>
                    <tbody className="glass">
                        <tr>
                            <th>Minutos falados</th>
                            <td>{balance.spokenMinutes}</td>
                        </tr>
                        <tr>
                            <th>Minutos cobrados</th>
                            <td>{balance.chargedMinutes}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <th>Valor médio por ligação</th>
                            <td>{BRLMask(balance.callValue)}</td>
                        </tr>
                        <tr>
                            <th>Valor gasto</th>
                            <td>{BRLMask(balance.chargedValue)}</td>
                        </tr>
                    </tbody>
                </table>
            </article>
        );
    }

    return (
        <main className={styles.main}>
            <CallDisposition />
            <CallsPerHour />
            <CallsPerType />
            <CallsPerQueue />
            <Balance />
        </main>
    );
}