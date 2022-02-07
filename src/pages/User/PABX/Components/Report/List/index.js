import React, { useState } from "react";

import styles from '../../styles.module.css';
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Table/Pagination";
import { secondsToTime, BRLMask } from '../../../../../../services/helpers';

import { MdReadMore } from 'react-icons/md';
import Rowler from "../../../../../../components/Table/Rowler";

export default function ReportList({ props }) {
    const {
        data,
        pages,
        current,
        navigate,
        select,
        recordsToPages,
    } = props;

    const { records, amount, duration } = data;

    const [rows, setRows] = useState(10);
    
    return (
        <>
            <section className={styles.list}>
                <div className={styles.listActions}>
                    <Rowler rows={rows} onChange={rows => {recordsToPages(rows); setRows(rows)}}/>
                </div>
                {
                    records
                    ? <>
                        <Table
                            thead={[
                                { 
                                    heading: "Data",
                                    align: "left",
                                    width: "18%",
                                },
                                { 
                                    heading: "Origem",
                                    align: "left",
                                    width: "18%",
                                },
                                { 
                                    heading: "Destino",
                                    align: "left",
                                    width: "18%",
                                },
                                { 
                                    heading: "Status",
                                    align: "left",
                                    width: "18%",
                                },
                                { 
                                    heading: "Duração",
                                    align: "left",
                                    width: "12%",
                                },
                                { 
                                    heading: "Valor",
                                    align: "left",
                                    width: "15%",
                                },
                                { 
                                    heading: "Detalhes",
                                    align: "center",
                                    width: "1%",
                                },
                            ]}
                        >
                            <tbody>
                                {
                                    pages.length > 0
                                    ? pages[current].map((record, index) => {
                                        const {
                                            date_hour: date,
                                            origin,
                                            destination,
                                            duration,
                                            value,
                                            status,
                                        } = record;

                                        return (
                                            <tr key={index}>
                                                <td>{date}</td>
                                                <td>{origin}</td>
                                                <td>{destination}</td>
                                                <td>{status}</td>
                                                <td>{secondsToTime(duration)}</td>
                                                <td>{BRLMask(value)}</td>
                                                <td><button onClick={() => select(record)}><MdReadMore/></button></td>
                                            </tr>
                                        );
                                    })
                                    : <tr><td colSpan="100%">Nenhum registro encontrado!</td></tr>
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th align="start" colSpan={4}>Total:</th>
                                    <td>{secondsToTime(duration)}</td>
                                    <td>{BRLMask(amount)}</td>
                                </tr>
                            </tfoot>
                        </Table>
                        <div className={styles.listActions}>
                            <Pagination
                                current={current}
                                total={pages.length}
                                onChange={page => navigate(page)}
                            />
                            <button
                                className="main-color-2"
                                onClick={() => {
                                    console.log('export...');
                                }}
                            >
                                Exportar
                            </button>
                        </div>
                    </>
                    : <p className={styles.nodata}>. . .</p>
                }
            </section>
        </>
    );
}