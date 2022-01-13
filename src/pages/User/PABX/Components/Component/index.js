import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../store/actions";

import api from "../../../../../services/api";
import { API_GUARD } from "../../../../../services/env";

import { IoMdRefresh, IoIosArrowUp } from 'react-icons/io';
import { BsApp } from 'react-icons/bs';

import styles from '../styles.module.css';
import ComponentForm from "./Form";
import ComponentList from "./List";
import Alert from "../../../../../components/Modals/Alert";

export default function Component({ props }) {
    const { PABX } = props
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const success = useRef(false);

    const [open, setOpen] = useState(false);
    const [action, setAction] = useState({
        type: 'list',
        payload: {}
    });

    const [komponents, setComponents] = useState(null);
    const [pages, setPages] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const komponentsToPages = () => {
            const KCOMPONENTS = [...komponents];
            const rows = 10;
            const total = Math.max(Math.floor(KCOMPONENTS.length / rows), 1);
            let pages = [];
            
            for (let i = total; i >= 0; i--) {
                const slice = KCOMPONENTS.splice(0, rows);

                if (slice.length > 0) {
                    pages.push(slice);
                }
            }

            setPages(pages);
            setCurrent(0);
        }

        if (!initialRender.current) {
            komponentsToPages();
        }
        
    }, [komponents]);

    const initialRender = useRef(true);

    const fetchData = async () => {
        dispatch(setIsLoading(true));

        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            try {
                const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/komponents`, {
                    headers: { Authorization: "Bearer " + access_token }
                });

                if (response.status === 200) {
                    const { komponents } = response.data;

                    setComponents(komponents);
                }
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setIsLoading(false));
            }
        }
    }

    useEffect(() => {
        if (initialRender.current && open) {
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

    const add = () => {
        setAction({
            type: 'add',
            payload: {},
        });
    }

    const edit = (komponent) => {
        setAction({
            type: 'edit',
            payload: komponent,
        });
    }

    const remove = async (komponent) => {
        dispatch(setIsLoading(true));

        try {
            const access_token = localStorage.getItem("access_token");
            const response = await api.delete(`/v1/${API_GUARD}/pabx/${ID}/komponent/${komponent.id}`, {
                headers: { Authorization: "Bearer " + access_token }
            });

            if (response.status && response.status === 200) {
                const content = { 
                    title: "Pronto...", 
                    message: `O componente "${komponent.name}" foi excluído com sucesso!`
                };

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
            komponent: action.payload,
        }

        const listProps = {
            ...addProps,
            komponents,
            pages,
            current,
            navigate,
            add,
            edit,
            remove,
        }

        switch (action.type) {
            case 'add': return <ComponentForm props={addProps}/>
            case 'edit': return <ComponentForm props={editProps}/>
            default: return <ComponentList props={listProps}/>
        }
    }

    return (
        <article className={`${styles.component} ${styles.komponent} ${open ? styles.open : styles.closed}`}>
            <header className="glass">
                <section className={styles.info}>
                    <h2><i><BsApp/></i>Componente</h2>
                </section>
                <section className={styles.actions}>
                    <button
                        className={styles.refresh}
                        disabled={open ? false : true}
                        onClick={() => {
                            if (open) {
                                refresh();
                            }
                        }}
                    >
                        <IoMdRefresh/>
                    </button>
                    <button
                        className={styles.toggle}
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
        </article>
    );
}