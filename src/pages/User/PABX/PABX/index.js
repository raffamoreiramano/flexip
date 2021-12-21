import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../store/actions";

import api from "../../../../services/api";
import { API_GUARD } from "../../../../services/env";

import { phoneMask } from '../../../../services/helpers';

import { IoMdArrowBack, IoMdRefresh, IoIosArrowUp, IoIosGitBranch } from 'react-icons/io';

import styles from './styles.module.css';

export default function PABX({ history, match }) {
    const ID = parseInt(match.params.PABX);

    const dispatch = useDispatch();

    const [PABX, setPABX] = useState(null);

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
                        const { pabxList } = response.data;
                        const PABX = pabxList.find(item => item.id === ID);

                        setPABX(PABX);

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

    const Branches = () => {
        return (
            <article className={styles.pabx}>
                <header className="glass">
                    <section className={styles.info}>
                        <h2>{PABX.name}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Empresa</th>
                                    <th>Número padrão</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{PABX.company.name} ({PABX.company.code})</td>
                                </tr>
                                <tr>
                                    <td>{phoneMask(PABX.telephone.ddd + PABX.telephone.number)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section className={styles.branches}>
                        <h3><i><IoIosGitBranch /></i> Ramais</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Contratados</th>
                                    <th>Em uso</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{PABX.max_branches}</td>
                                </tr>
                                <tr>
                                    <td>{PABX.branches_in_use}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section className={styles.actions}>
                        <button><IoMdArrowBack /></button>
                        <button><IoMdRefresh /></button>
                        <button><IoIosArrowUp /></button>
                    </section>
                </header>
            </article>
        );
    }

    const Panel = () => {
        if (initialRender.current) {
            return <p className={styles.nodata}>Carregando. . .</p>
        }
        
        if (!PABX) {
            return <p className={styles.nodata}>PABX não encontrado!</p>
        }

        return (
            <>
                <Branches />
            </>
        );
    }

    return (
        <main className={styles.main}>
            <Panel />
        </main>
    );
}