import React, { useState } from "react";

import styles from '../../styles.module.css';
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Table/Pagination";
import Confirm from "../../../../../../components/Modals/Confirm";
import { MdMoreVert } from 'react-icons/md';

export default function URAList({ props }) {
    const {
        uras,
        pages,
        current,
        navigate,
        add,
        edit,
        remove,
    } = props;

    const [isConfirmActive, setIsConfirmActive] = useState(false);
    const [confirmContent, setConfirmContent] = useState({
        title: "Confirme:",
        message: "Deseja mesmo excluir essa URA?",
        payload: {}
    });
    
    return (
        <>
            <section className={styles.list}>
                {
                    uras
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
                                    ? pages[current].map((ura, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{ura.name}</td>
                                                <td>
                                                    <div className={styles.listItemMenu}>
                                                        <input
                                                            id={`ura-${ura.id}`}
                                                            type="checkbox"
                                                        />
                                                        <label htmlFor={`ura-${ura.id}`}>
                                                            <MdMoreVert/>
                                                        </label>
                                                        <ul className="glass">
                                                            <li>
                                                                <a
                                                                    href={`#ura-${ura.id}`}
                                                                    onClick={(event) => {
                                                                        event.preventDefault();

                                                                        edit(ura);
                                                                    }}
                                                                >
                                                                    Editar
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    href={`#ura-${ura.id}`}
                                                                    onClick={(event) => {
                                                                        event.preventDefault();

                                                                        const menu = document.getElementById(`ura-${ura.id}`);

                                                                        menu.checked = false;

                                                                        setConfirmContent({
                                                                            title: "Confirme:",
                                                                            message: `Deseja mesmo excluir a URA "${ura.name}"?`,
                                                                            payload: ura,
                                                                        });

                                                                        setIsConfirmActive(true);
                                                                    }}
                                                                >
                                                                    Excluir
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    : <tr><td colSpan="100%">Nenhuma URA encontrado!</td></tr>
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
            <Confirm
                title={confirmContent.title}
                message={confirmContent.message}
                payload={confirmContent.payload}
                state={[isConfirmActive, setIsConfirmActive]}
                onConfirm={remove}
            />
        </>
    );
}