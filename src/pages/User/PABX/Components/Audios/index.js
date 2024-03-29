import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../store/actions";

import api from "../../../../../services/api";
import { API_GUARD } from "../../../../../services/env";

import { IoMdRefresh, IoIosArrowUp } from 'react-icons/io';
import { BsMusicNoteList } from 'react-icons/bs';

import styles from '../styles.module.css';
import AudioForm from "./Form";
import AudioList from "./List";
import Alert from "../../../../../components/Modals/Alert";
import { Radio } from "../../../../../components/Input";

export default function Audios({ props }) {
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

    const [category, setCategory] = useState("sound");

    const [audios, setAudios] = useState(null);
    const [pages, setPages] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const audiosToPages = () => {
            const AUDIOS = [...audios];
            const rows = 10;
            const total = Math.max(Math.floor(AUDIOS.length / rows), 1);
            let pages = [];
            
            for (let i = total; i >= 0; i--) {
                const slice = AUDIOS.splice(0, rows);

                if (slice.length > 0) {
                    pages.push(slice);
                }
            }

            setPages(pages);
            setCurrent(0);
        }

        if (!initialRender.current) {
            audiosToPages();
        }
        
    }, [audios]);

    const initialRender = useRef(true);

    const fetchData = async () => {
        dispatch(setIsLoading(true));

        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            let endpoint = category === "sound" ? "sounds" : category;

            try {
                const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}/${endpoint}`, {
                    headers: { Authorization: "Bearer " + access_token }
                });

                if (response.status === 200) {
                    const { sounds: audios } = response.data;

                    setAudios(audios);
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

    useEffect(() => {
        if (!initialRender.current && open) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

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

    const edit = (audio) => {
        setAction({
            type: 'edit',
            payload: audio,
        });
    }

    const remove = async (audio) => {
        dispatch(setIsLoading(true));

        try {
            const access_token = localStorage.getItem("access_token");
            const response = await api.delete(`/v1/${API_GUARD}/pabx/${ID}/${category}/${audio.id}`, {
                headers: { Authorization: "Bearer " + access_token }
            });

            if (response.status && response.status === 200) {
                const content = { 
                    title: "Pronto...", 
                    message: `O áudio "${audio.name}" foi excluído com sucesso!`
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
            category,
            refresh,
        }

        const editProps = {
            ...addProps,
            audio: action.payload,
        }

        const listProps = {
            ...addProps,
            audios,
            pages,
            current,
            navigate,
            add,
            edit,
            remove,
        }

        switch (action.type) {
            case 'add': return <AudioForm props={addProps}/>
            case 'edit': return <AudioForm props={editProps}/>
            default:
                const switcher = (
                    <Radio
                        id="audio-category"
                        label="Categoria"
                        name="category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        <option value={"sound"}>GERAL</option>
                        <option value={"moh"}>ESPERA</option>
                    </Radio>
                );

                return (<div className={styles.wrapper}>{switcher} <AudioList props={listProps}/></div>);
        }
    }

    return (
        <article className={`${styles.component} ${styles.audios} ${open ? styles.open : styles.closed}`}>
            <header className="glass">
                <section className={styles.info}>
                    <h2><i><BsMusicNoteList/></i>Áudios</h2>
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