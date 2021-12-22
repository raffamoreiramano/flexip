import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../store/actions";

import api from "../../../../services/api";
import { API_GUARD } from "../../../../services/env";

import { phoneMask } from '../../../../services/helpers';

import { IoMdArrowBack, IoMdRefresh, IoIosArrowUp, IoIosGitBranch } from 'react-icons/io';
import { MdOutlineQrCode, MdMoreVert } from 'react-icons/md';

import styles from './styles.module.css';
import Table from "../../../../components/Table";
import Pagination from "../../../../components/Table/Pagination";

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
        const [open, setOpen] = useState(false);

        const List = () => {
            const [branches, setBranches] = useState(null);
            const [pages, setPages] = useState([]);
            const [current, setCurrent] = useState(0);

            useEffect(() => {
                const branchesToPages = () => {
                    const rows = 10;
                    const total = Math.max(Math.floor(branches.length / rows), 1);
                    let pages = [];
                    
                    for (let i = total; i >= 0; i--) {
                        const slice = branches.splice(0, rows);

                        if (slice.length > 0) {
                            pages.push(slice);
                        }
                    }

                    setPages(pages);
                    setCurrent(0);
                }

                if (!initialRender.current) {
                    branchesToPages();
                }
                
            }, [branches]);

            const initialRender = useRef(true);

            useEffect(() => {
                const fetchData = async () => {
                    const access_token = localStorage.getItem("access_token");

                    if (access_token) {
                        try {
                            const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/branches`, {
                                headers: { Authorization: "Bearer " + access_token }
                            });

                            if (response.status === 200) {
                                const { branches } = response.data;

                                setBranches(branches);
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
                <section className={styles.list}>
                    {
                        branches
                        ? <>
                            <Table>
                                <colgroup>
                                    <col width="30%"/>
                                    <col width="29%"/>
                                    <col width="50%"/>
                                    <col width="1%"/>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th align="left">Número</th>
                                        <th align="left">Responsável</th>
                                        <th align="center">QR code</th>
                                        <th align="center">Opções</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        pages.length > 0
                                        ? pages[current].map((branch, index) => (
                                            <tr key={index}>
                                                <td>{branch.number}</td>
                                                <td>{branch.branch_users.name}</td>
                                                <td><button><MdOutlineQrCode/></button></td>
                                                <td><button><MdMoreVert/></button></td>
                                            </tr>
                                        ))
                                        : <tr><td>Nenhum ramal encontrado!</td></tr>
                                    }
                                </tbody>
                            </Table>
                            <div className={styles.listActions}>
                                <Pagination
                                    current={current}
                                    total={pages.length}
                                    onChange={page => setCurrent(page)}
                                />
                                <button>Adicionar</button>
                            </div>
                        </>
                        : <p className={styles.nodata}>. . .</p>
                    }
                </section>
            );
        }

        return (
            <article className={`${styles.pabx} ${open ? styles.open : styles.closed}`}>
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
                        <h3><i><IoIosGitBranch/></i> Ramais</h3>
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
                        <button
                            onClick={() => history.push('/admin/pabx')}
                        >
                            <IoMdArrowBack/>
                        </button>
                        <button
                            onClick={() => {
                                if (open) {
                                    setOpen(false);
    
                                    setTimeout(() => {
                                        setOpen(true);
                                    });
                                }
                            }}
                        >
                            <IoMdRefresh/>
                        </button>
                        <button
                            onClick={() => setOpen(!open)}
                        >
                            <IoIosArrowUp/>
                        </button>
                    </section>
                </header>
                {
                    open && <List />
                }
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
                <Branches/>
            </>
        );
    }

    return (
        <main className={styles.main}>
            <Panel/>
        </main>
    );
}