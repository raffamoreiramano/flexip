import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../store/actions";

import api from "../../../../../services/api";
import { API_GUARD } from "../../../../../services/env";

import { phoneMask } from '../../../../../services/helpers';

import { IoMdArrowBack, IoMdRefresh, IoIosArrowUp, IoIosGitBranch } from 'react-icons/io';

import styles from '../styles.module.css';
import BranchForm from "./Form";
import BranchList from "./List";
import Alert from "../../../../../components/Modals/Alert";

export default function Branches({ props }) {
    const { history, PABX } = props
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const success = useRef(false);

    const [QRCode, setQRCode] = useState({});
    const [isQRCodeModalActive, setIsQRCodeModalActive] = useState(false);

    const [open, setOpen] = useState(false);
    const [action, setAction] = useState({
        type: 'list',
        payload: {}
    });

    const [branches, setBranches] = useState(null);
    const [branchesInUse, setBranchesInUse] = useState(PABX.branches_in_use);
    const [pages, setPages] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const branchesToPages = () => {
            const BRANCHES = [...branches];
            const rows = 10;
            const total = Math.max(Math.floor(branches.length / rows), 1);
            let pages = [];
            
            for (let i = total; i >= 0; i--) {
                const slice = BRANCHES.splice(0, rows);

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

    useEffect(() => {
        if (!initialRender.current && QRCode) {
            setIsQRCodeModalActive(true);
        }
    }, [QRCode]);

    const initialRender = useRef(true);

    const fetchData = async () => {
        dispatch(setIsLoading(true));

        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            try {
                const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/branches`, {
                    headers: { Authorization: "Bearer " + access_token }
                });

                if (response.status === 200) {
                    const { branches } = response.data;

                    setBranches(branches);
                    setBranchesInUse(branches.length);
                    // remover futuramente
                    console.log(response.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setIsLoading(false));
            }
        }
    }

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;

            fetchData();
        }
    });

    const refresh = () => {
        fetchData().finally(() => {
            setAction({
                type: 'list',
                payload: {}
            })
        })
    }

    const showAlert = (content, response = false) => {
        success.current = response;

        setAlertContent(content);
        setIsAlertActive(true);
    }

    const navigate = (page) => {
        setCurrent(page);
    }

    const select = async (branch) => {
        dispatch(setIsLoading(true));

        try {
            const access_token = localStorage.getItem("access_token");
            const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/branch/${branch.id}/qr_code`, {
                headers: { Authorization: "Bearer " + access_token }
            });

            if (response.status && response.status === 200) {
                const { domain, user, image } = response.data;
                const { number } = branch;
                const { name } = branch.branch_users;
                
                setQRCode({
                    number,
                    name,
                    user,
                    domain,
                    image,
                });
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

                console.log(error.response.data);
            }

            showAlert(content);
        } finally {
            dispatch(setIsLoading(false));
        }
    }

    const add = () => {
        setAction({
            type: 'add',
            payload: {},
        });
    }

    const edit = (branch) => {
        setAction({
            type: 'edit',
            payload: branch,
        });
    }

    const remove = async (branch) => {
        dispatch(setIsLoading(true));

        try {
            const access_token = localStorage.getItem("access_token");
            const response = await api.delete(`/v1/${API_GUARD}/pabx/${ID}/branch/${branch.id}`, {
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

                console.log(error.response.data);
            }

            showAlert(content);
        } finally {
            dispatch(setIsLoading(false));
        }
    }

    const Main = () => {
        const addProps = {
            ...props,
            refresh,
        }

        const editProps = {
            ...addProps,
            branch: action.payload,
        }

        const listProps = {
            ...addProps,
            branches,
            pages,
            current,
            navigate,
            select,
            add,
            edit,
            remove,
        }

        switch (action.type) {
            case 'add': return <BranchForm props={addProps}/>
            case 'edit': return <BranchForm props={editProps}/>
            default: return <BranchList props={listProps}/>
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
                                <td>{branchesInUse}</td>
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

            <Alert
                state={[isQRCodeModalActive, setIsQRCodeModalActive]}
                onClose={() => setQRCode("")}
            >
                <div className={styles.QRCode}>
                    
                    <figure>
                        <img src={QRCode.image} alt="QR Code" title="QR Code"/>
                    </figure>
                    <table>
                        <tbody>
                            <tr>
                                <th>Ramal <i>: :</i></th>
                                <td>{QRCode.name}</td>
                            </tr>
                            <tr>
                                <th>Número <i>: :</i></th>
                                <td>{QRCode.number}</td>
                            </tr>
                            <tr>
                                <th>Domínio <i>: :</i></th>
                                <td>{QRCode.domain}</td>
                            </tr>
                            <tr>
                                <th>Usuário <i>: :</i></th>
                                <td>{QRCode.user}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
           </Alert>
        </article>
    );
}