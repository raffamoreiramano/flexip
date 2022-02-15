import React, { useEffect, useRef, useState } from "react";

import { IoIosArrowUp } from 'react-icons/io';
import { AiOutlineFileSearch } from 'react-icons/ai';

import styles from '../styles.module.css';
import Alert from "../../../../../components/Modals/Alert";
import Confirm from "../../../../../components/Modals/Confirm";
import Audio from '../../../../../components/Audio';
import ReportForm from "./Form";
import ReportList from "./List";
import { BRLMask, secondsToTime } from "../../../../../services/helpers";
import { Radio } from "../../../../../components/Input";

export default function Report({ props }) {
    const [open, setOpen] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);

    const [pages, setPages] = useState([]);
    const [current, setCurrent] = useState(0);

    const [selected, setSelected] = useState({});
    const [isSelectedModalActive, setIsSelectedModalActive] = useState(false);
    
    const [isConfirmActive, setIsConfirmActive] = useState(false);

    const [scope, setScope] = useState('current');

    const recordsToPages = (rows = 10) => {
        const RECORDS = [...fetchedData.records];
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

    useEffect(() => {
        if (!initialRender.current) {
            recordsToPages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            full_audio_link: audio,
            date_hour: date,
            origin,
            destination,
            bina,
            type,
            flow,
            status,
            duration,
            value,
        } = record;

        setSelected({
            audio,
            date,
            origin,
            destination,
            bina,
            type,
            flow,
            status,
            duration,
            value,
        });

        setIsSelectedModalActive(true);
    }

    const convertToCSV = (name, array) => {
        const labels = [   
            'Data',
            'Origem',
            'Destino',
            'Bina',
            'Tipo',
            'Fluxo',
            'Status',
            'Duracao',
            'Gravacao',
            'Valor',
        ];

        const content = labels.join(';') + '\n' + array.map(row =>
            row.date_hour + ';' +
            row.origin + ';' +
            row.destination + ';' +
            row.bina + ';' +
            row.type.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + ';' +
            row.flow.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + ';' +
            row.status.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + ';' +
            secondsToTime(row.duration) + ';' +
            row.full_audio_link?.substr(row.full_audio_link?.lastIndexOf('/') + 1) + ';' +
            BRLMask(row.value).replace(/\D/g, "").replace(/^(\d{1})(\d+)/, "$1,$2")
        ).join('\n');

        const blob = new Blob([content], { type: 'text/csv', endings: 'native' });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob, { type: "text/plain" });
        link.download = `${name}.csv`;
        document.body.appendChild(link);

        link.click();
    }

    const exportRecords = () => {
        let records = [];

        const first = fetchedData.records[0];
        const last = fetchedData.records[fetchedData.records.length - 1];

        const start = first.date_hour.replace(/\//g, "-").replace(/\s/g, "_H");
        const end = last.date_hour.replace(/\//g, "-").replace(/\s/g, "_H");

        let name = `Relatorio_D${start}_-_D${end}`;

        switch (scope) {
            default:
            case 'current':
                records = [...pages[current]];
                name += `_pagina-${current + 1}`
                break;
            case 'all':
                records = [...fetchedData.records];
                break;
        }

        convertToCSV(name, records);
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
            recordsToPages,
            handleExport: () => setIsConfirmActive(true),
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
                                        <th>Bina <i>: :</i></th>
                                        <td>{selected.bina}</td>
                                    </tr>
                                    <tr>
                                        <th>Tipo <i>: :</i></th>
                                        <td>{selected.type}</td>
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

            <Confirm
                state={[isConfirmActive, setIsConfirmActive]}
                onConfirm={exportRecords}
            >
                <form>
                    <h3>Exportar para CSV</h3>
                    <Radio
                        id="export-scope"
                        name="scope"
                        label="Conteúdo:"
                        value={scope}
                        onChange={(event) => {
                            setScope(event.target.value);
                        }}
                    >
                        <option value="current">Página {current + 1}</option>
                        <option value="all">Tudo</option>
                    </Radio>
                </form>
            </Confirm>
        </article>
    );
}