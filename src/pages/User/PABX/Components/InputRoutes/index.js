import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../store/actions";

import api from "../../../../../services/api";
import { API_GUARD } from "../../../../../services/env";

import { IoMdRefresh, IoIosArrowUp } from 'react-icons/io';
import { RiRouteFill } from 'react-icons/ri';

import styles from '../styles.module.css';
import InputRouteForm from "./Form";
import InputRouteList from "./List";
import Alert from "../../../../../components/Modals/Alert";

export default function InputRoutes({ props }) {
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

    const [routes, setRoutes] = useState(null);
    const [pages, setPages] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const routesToPages = () => {
            const ROUTES = [...routes];
            const rows = 10;
            const total = Math.max(Math.floor(ROUTES.length / rows), 1);
            let pages = [];
            
            for (let i = total; i >= 0; i--) {
                const slice = ROUTES.splice(0, rows);

                if (slice.length > 0) {
                    pages.push(slice);
                }
            }

            setPages(pages);
            setCurrent(0);
        }

        if (!initialRender.current) {
            routesToPages();
        }
        
    }, [routes]);

    const initialRender = useRef(true);

    const fetchData = async () => {
        dispatch(setIsLoading(true));

        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            try {
                const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/entry_routes`, {
                    headers: { Authorization: "Bearer " + access_token }
                });

                if (response.status === 200) {
                    const { entry_routes: routes } = response.data;

                    setRoutes(routes);
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

    const edit = (route) => {
        setAction({
            type: 'edit',
            payload: route,
        });
    }

    const remove = async (route) => {
        dispatch(setIsLoading(true));

        try {
            const access_token = localStorage.getItem("access_token");
            const response = await api.delete(`/v1/${API_GUARD}/pabx/${ID}/entry_route/${route.id}`, {
                headers: { Authorization: "Bearer " + access_token }
            });

            if (response.status && response.status === 200) {
                const content = { 
                    title: "Pronto...", 
                    message: `A rota "${route.name}" foi excluído com sucesso!`
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
            route: action.payload,
        }

        const listProps = {
            ...addProps,
            routes,
            pages,
            current,
            navigate,
            add,
            edit,
            remove,
        }

        switch (action.type) {
            case 'add': return <InputRouteForm props={addProps}/>
            case 'edit': return <InputRouteForm props={editProps}/>
            default: return <InputRouteList props={listProps}/>
        }
    }

    return (
        <article className={`${styles.component} ${styles.inputRoutes} ${open ? styles.open : styles.closed}`}>
            <header className="glass">
                <section className={styles.info}>
                    <h2><i><RiRouteFill/></i>Rotas de entrada</h2>
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