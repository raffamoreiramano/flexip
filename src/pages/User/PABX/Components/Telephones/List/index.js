import React from "react";

import styles from '../../styles.module.css';
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Table/Pagination";
import { phoneMask } from "../../../../../../services/helpers";

export default function TelephoneList({ props }) {
    const {
        telephones,
        pages,
        current,
        navigate,
        add,
        check,
    } = props;
    
    return (
        <section className={styles.list}>
            {
                telephones
                ? <>
                    <Table
                        thead={[
                            { 
                                heading: "Número",
                                align: "left",
                                width: "40%",
                            },
                            { 
                                heading: "Cidade",
                                align: "left",
                                width: "59%",
                            },
                            { 
                                heading: "Principal",
                                align: "center",
                                width: "1%",
                            },
                        ]}
                    >
                        <tbody>
                            {
                                pages.length > 0
                                ? pages[current].map((telephone, index) => (
                                    <tr key={index}>
                                        <td>{phoneMask(telephone.ddd + telephone.number)}</td>
                                        <td>{telephone.city.name}</td>
                                        <td>
                                            <div className={styles.check}>
                                                <input
                                                    id={`telephone-${telephone.id}`}
                                                    type="checkbox"
                                                    checked={!!telephone.main}
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            check(telephone);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                                : <tr><td colSpan="100%">Nenhum ramal encontrado!</td></tr>
                            }
                        </tbody>
                    </Table>
                    <div className={styles.listActions}>
                        <Pagination
                            current={current}
                            total={pages.length}
                            onChange={page => navigate(page)}
                        />
                        <button onClick={add}>Adicionar</button>
                    </div>
                </>
                : <p className={styles.nodata}>. . .</p>
            }
        </section>
    );
}