import React, { useState } from "react";

import styles from '../../styles.module.css';
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Table/Pagination";
import { MdMoreVert } from 'react-icons/md';

export default function ReportList({ props }) {
    const {
        records,
        pages,
        current,
        navigate,
        select,
    } = props;
    
    return (
        <>
            <section className={styles.list}>
                {
                    records
                    ? <>
                        <Table
                            thead={[
                                { 
                                    heading: "Nome",
                                    align: "left",
                                    width: "99%",
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
                                    ? pages[current].map((record, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index}</td>
                                                <td>
                                                    <div></div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    : <tr><td colSpan="100%">Nenhum registro encontrado!</td></tr>
                                }
                            </tbody>
                        </Table>
                        <div className={styles.listActions}>
                            <Pagination
                                current={current}
                                total={pages.length}
                                onChange={page => navigate(page)}
                            />
                        </div>
                    </>
                    : <p className={styles.nodata}>. . .</p>
                }
            </section>
        </>
    );
}