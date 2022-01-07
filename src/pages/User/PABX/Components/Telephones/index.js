import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../store/actions";

import api from "../../../../../services/api";
import { API_GUARD } from "../../../../../services/env";

import { IoMdRefresh, IoIosArrowUp } from 'react-icons/io';
import { BsTelephoneFill } from 'react-icons/bs';

import styles from '../styles.module.css';
import TelephoneForm from "./Form";
import TelephoneList from "./List";
import Alert from "../../../../../components/Modals/Alert";

export default function Telephones({ props }) {
    const { PABX } = props
    const ID = parseInt(PABX.id);

    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });

    const [open, setOpen] = useState(false);
    const [action, setAction] = useState({
        type: 'list',
        payload: {}
    });

    const [telephones, setTelephones] = useState(null);
    const [pages, setPages] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const telephonesToPages = () => {
            const TELEPHONES = [...telephones];
            const rows = 10;
            const total = Math.max(Math.floor(telephones.length / rows), 1);
            let pages = [];
            
            for (let i = total; i >= 0; i--) {
                const slice = TELEPHONES.splice(0, rows);

                if (slice.length > 0) {
                    pages.push(slice);
                }
            }

            setPages(pages);
            setCurrent(0);
        }

        if (!initialRender.current) {
            telephonesToPages();
        }
        
    }, [telephones]);

    const initialRender = useRef(true);

    const fetchData = async () => {
        dispatch(setIsLoading(true));

        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            try {
                const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/telephones`, {
                    headers: { Authorization: "Bearer " + access_token }
                });

                if (response.status === 200) {
                    const { telephones } = response.data.pabx;

                    setTelephones(telephones);

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

    const showAlert = (content) => {
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

    const check = async (telephone) => {
        dispatch(setIsLoading(true));

        try {
            const access_token = localStorage.getItem("access_token");
            const response = await api.post(`/v1/${API_GUARD}/pabx/${ID}/telephone/${telephone.id}/main`, {}, {
                headers: { Authorization: "Bearer " + access_token }
            });

            if (response.status && response.status === 200) {
                refresh();
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

        const listProps = {
            ...addProps,
            telephones,
            pages,
            current,
            navigate,
            add,
            check,
        }

        switch (action.type) {
            case 'add': return <TelephoneForm props={addProps}/>
            default: return <TelephoneList props={listProps}/>
        }
    }

    return (
        <article className={`${styles.component} ${styles.telephones} ${open ? styles.open : styles.closed}`}>
            <header className="glass">
                <section className={styles.info}>
                    <h2><i><BsTelephoneFill/></i>Telefones</h2>
                </section>
                <section className={styles.actions}>
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
            />
        </article>
    );
}