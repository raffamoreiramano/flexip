import React, { useEffect, useRef, useState } from "react";

import { IoIosArrowUp } from 'react-icons/io';
import { AiOutlineFileSearch } from 'react-icons/ai';

import styles from '../styles.module.css';
import Alert from "../../../../../components/Modals/Alert";
import Audio from '../../../../../components/Audio';
import ReportForm from "./Form";
import ReportList from "./List";
import { BRLMask, secondsToTime } from "../../../../../services/helpers";

export default function Report({ props }) {
    const [open, setOpen] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);

    const [pages, setPages] = useState([]);
    const [current, setCurrent] = useState(0);

    const [selected, setSelected] = useState({});
    const [isSelectedModalActive, setIsSelectedModalActive] = useState(false);

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

    const navigate = (page) => {
        setCurrent(page);
    }

    const select = (record) => {
        const {
            date_hour: date,
            origin,
            destination,
            duration,
            value,
            flow,
            status,
            type,
            trunk,
            bina,
            full_audio_link: audio,
        } = record;

        setSelected({
            date,
            origin,
            destination,
            duration,
            value,
            flow,
            status,
            type,
            trunk,
            bina,
            audio,
        });

        setIsSelectedModalActive(true);
    }

    const Main = () => {
        const filterProps = {
            ...props,
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
                state={[isSelectedModalActive, setIsSelectedModalActive]}
                onClose={() => setSelected('')}
            >
                <div className={styles.selected}>
                    {
                        selected &&
                        <>
                            <h3>Gravação</h3>
                            <Audio src={selected.audio}/>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Data <i>: :</i></th>
                                        <td>{selected.date}</td>
                                    </tr>
                                    <tr>
                                        <th>Origem <i>: :</i></th>
                                        <td>{selected.origin}</td>
                                    </tr>
                                    <tr>
                                        <th>Destino <i>: :</i></th>
                                        <td>{selected.destination}</td>
                                    </tr>
                                    <tr>
                                        <th>Fluxo <i>: :</i></th>
                                        <td>{selected.flow}</td>
                                    </tr>
                                    <tr>
                                        <th>Status <i>: :</i></th>
                                        <td>{selected.status}</td>
                                    </tr>
                                    <tr>
                                        <th>Tipo <i>: :</i></th>
                                        <td>{selected.type}</td>
                                    </tr>
                                    <tr>
                                        <th>Tronco <i>: :</i></th>
                                        <td>{selected.trunk}</td>
                                    </tr>
                                    <tr>
                                        <th>Bina <i>: :</i></th>
                                        <td>{selected.bina}</td>
                                    </tr>
                                    <tr>
                                        <th>Duração <i>: :</i></th>
                                        <td>{secondsToTime(selected.duration)}</td>
                                    </tr>
                                    <tr>
                                        <th>Valor <i>: :</i></th>
                                        <td>{BRLMask(selected.value)}</td>
                                    </tr>
                                </tbody>
                            </table> 
                        </>
                    }
                    
                </div>
           </Alert>
        </article>
    );
}