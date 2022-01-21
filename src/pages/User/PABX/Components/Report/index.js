import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../../store/actions";

import api from "../../../../../services/api";
import { API_GUARD } from "../../../../../services/env";

import { IoMdRefresh, IoIosArrowUp } from 'react-icons/io';
import { AiOutlineFileSearch } from 'react-icons/ai';

import styles from '../styles.module.css';
import ComponentForm from "./Form";
import ComponentList from "./List";
import Alert from "../../../../../components/Modals/Alert";
import ReportForm from "./Form";
import ReportList from "./List";

export default function Report({ props }) {
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
    const [fetchedData, setFetchedData] = useState(null);

    const [records, setComponents] = useState(null);
    const [pages, setPages] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const recordsToPages = () => {

            const RECORDS = [...fetchedData.records];
            const rows = 10;
            const total = Math.max(Math.floor(RECORDS.length / rows), 1);
            let pages = [];
            
            for (let i = total; i >= 0; i--) {
                const slice = RECORDS.splice(0, rows);

                if (slice.length > 0) {
                    pages.push(slice);
                }
            }

            setPages(pages);
            setCurrent(0);
        }

        if (!initialRender.current) {
            recordsToPages();
        }
        
    }, [fetchedData]);
    
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        }
    })

    const initialRender = useRef(true);

    const refresh = () => {
        console.log('refresh');
    }

    const showAlert = (content, response = false) => {
        success.current = response;

        setAlertContent(content);
        setIsAlertActive(true);
    }

    const navigate = (page) => {
        setCurrent(page);
    }

    const select = () => {
        console.log('select')
    }

    const Main = () => {
        const filterProps = {
            ...props,
            refresh,
            setData: setFetchedData,
        }

        const listProps = {
            ...filterProps,
            data: fetchedData,
            pages,
            current,
            navigate,
            select,
        }

        return (<>
            <ReportForm props={filterProps}/>
            { fetchedData && <ReportList props={listProps}/> }
        </>);
    }

    return (
        <article className={`${styles.component} ${styles.report} ${open ? styles.open : styles.closed}`}>
            <header className="glass">
                <section className={styles.info}>
                    <h2><i><AiOutlineFileSearch/></i>Relatório de chamadas</h2>
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
                open && Main()
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