import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../store/actions";

import api from "../../../services/api";
import { API_GUARD } from "../../../services/env";

import styles from './styles.module.css';

export default function PABX() {
    const dispatch = useDispatch();

    const initialRender = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            const access_token = localStorage.getItem("access_token");

            if (access_token) {
                try {
                    const response = await api.get(`/v1/${API_GUARD}/pabx`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {

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

    return (
        <main className={styles.main}>
            <ul className={styles.list}>
                <li>
                    <article className={`${styles.pabx} glass`}>
                        <h3>
                            PABX-1
                        </h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Empresa:</th>
                                    <td>WFG Soluctions (1001)</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <th>Número padrão:</th>
                                    <td>(15) 98765-4321</td>
                                </tr>
                                <tr>
                                    <th>Ramais contratados:</th>
                                    <td>6</td>
                                </tr>
                                <tr>
                                    <th>Ramais em uso:</th>
                                    <td>5</td>
                                </tr>
                            </tbody>
                        </table>
                    </article>
                </li>
                <li>
                    <article className={`${styles.pabx} glass`}>
                        <h3>
                            PABX-1
                        </h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Empresa:</th>
                                    <td>WFG Soluctions (1001)</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <th>Número padrão:</th>
                                    <td>(15) 98765-4321</td>
                                </tr>
                                <tr>
                                    <th>Ramais contratados:</th>
                                    <td>6</td>
                                </tr>
                                <tr>
                                    <th>Ramais em uso:</th>
                                    <td>5</td>
                                </tr>
                            </tbody>
                        </table>
                    </article>
                </li>
                <li>
                    <article className={`${styles.pabx} glass`}>
                        <h3>
                            PABX-1
                        </h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Empresa:</th>
                                    <td>WFG Soluctions (1001)</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <th>Número padrão:</th>
                                    <td>(15) 98765-4321</td>
                                </tr>
                                <tr>
                                    <th>Ramais contratados:</th>
                                    <td>6</td>
                                </tr>
                                <tr>
                                    <th>Ramais em uso:</th>
                                    <td>5</td>
                                </tr>
                            </tbody>
                        </table>
                    </article>
                </li>
            </ul>

        </main>
    );
}