import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../store/actions";

import api from "../../../../../services/api";
import { API_GUARD } from "../../../../../services/env";

import { phoneMask } from '../../../../../services/helpers';

import { IoMdArrowBack, IoMdRefresh, IoIosArrowUp, IoIosGitBranch } from 'react-icons/io';
import { MdOutlineQrCode, MdMoreVert } from 'react-icons/md';

import styles from '../styles.module.css';
import Table from "../../../../../components/Table";
import Pagination from "../../../../../components/Table/Pagination";
import AddBranch from "./Add";

export default function Branches({ props }) {
    const { history, PABX } = props
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [action, setAction] = useState({
        type: 'list',
        payload: {}
    });

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
                        <Table
                            thead={[
                                { 
                                    heading: "Número",
                                    align: "left",
                                    width: "30%",
                                },
                                { 
                                    heading: "Responsável",
                                    align: "left",
                                    width: "29%",
                                },
                                { 
                                    heading: "QR code",
                                    align: "center",
                                    width: "50%",
                                },
                                { 
                                    heading: "Opções",
                                    align: "center",
                                    width: "1%",
                                },
                            ]}
                        >
                            <tbody>
                                {
                                    pages.length > 0
                                    ? pages[current].map((branch, index) => (
                                        <tr key={index}>
                                            <td>{branch.number}</td>
                                            <td>{branch.branch_users.name}</td>
                                            <td><button><MdOutlineQrCode/></button></td>
                                            <td>
                                                <div className={styles.listItemMenu}>
                                                    <input
                                                        id={`branch-${branch.id}`}
                                                        type="checkbox"
                                                    />
                                                    <label htmlFor={`branch-${branch.id}`}>
                                                        <MdMoreVert/>
                                                    </label>
                                                    <ul className="glass">
                                                        <li>
                                                            <a
                                                                href={`#branch-${branch.id}`}
                                                                onClick={(event) => {
                                                                    event.preventDefault();

                                                                    setAction({
                                                                        type: 'edit',
                                                                        payload: branch
                                                                    });
                                                                }}
                                                            >
                                                                Editar
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                href={`#branch-${branch.id}`}
                                                                onClick={(event) => {
                                                                    event.preventDefault();

                                                                    console.log('Excluir');
                                                                }}
                                                            >
                                                                Excluir
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    : <tr><td colSpan="100%">Nenhum ramal encontrado!</td></tr>
                                }
                            </tbody>
                        </Table>
                        <div className={styles.listActions}>
                            <Pagination
                                current={current}
                                total={pages.length}
                                onChange={page => setCurrent(page)}
                            />
                            <button onClick={() => setAction({ type: 'add' })}>Adicionar</button>
                        </div>
                    </>
                    : <p className={styles.nodata}>. . .</p>
                }
            </section>
        );
    }
    
    const Edit = ({ branch }) => {
        return <div>{branch.number}</div>
    }

    const refresh = () => {
        setAction({
            type: 'list',
            payload: {}
        })
    }

    const Main = () => {
        const properties = {
            ...props,
            refresh,
        }
        switch (action.type) {
            case 'add': return <AddBranch props={properties}/>
            case 'edit': return <Edit branch={action.payload}/>
            default: return <List/>
        }
    }

    return (
        <article className={`${styles.component} ${styles.pabx} ${open ? styles.open : styles.closed}`}>
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
                        onClick={() => history.push('/admin/PABX')}
                    >
                        <IoMdArrowBack/>
                    </button>
                    <button
                        onClick={() => {
                            if (open) {
                                refresh();
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
                open && <Main/>
            }
        </article>
    );
}