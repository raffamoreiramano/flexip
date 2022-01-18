import React, { useState } from "react";

import styles from '../../styles.module.css';
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Table/Pagination";
import Confirm from "../../../../../../components/Modals/Confirm";
import { MdMoreVert } from 'react-icons/md';

export default function QueueList({ props }) {
    const {
        queues,
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
        message: "Deseja mesmo excluir essa fila?",
        payload: {}
    });
    
    return (
        <>
            <section className={styles.list}>
                {
                    queues
                    ? <>
                        <Table
                            thead={[
                                { 
                                    heading: "Nome",
                                    align: "left",
                                    width: "40%",
                                },
                                { 
                                    heading: "Descrição",
                                    align: "left",
                                    width: "59%",
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
                                    ? pages[current].map((queue, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{queue.name}</td>
                                                <td>{queue.description}</td>
                                                <td>
                                                    <div className={styles.listItemMenu}>
                                                        <input
                                                            id={`queue-${queue.id}`}
                                                            type="checkbox"
                                                        />
                                                        <label htmlFor={`queue-${queue.id}`}>
                                                            <MdMoreVert/>
                                                        </label>
                                                        <ul className="glass">
                                                            <li>
                                                                <a
                                                                    href={`#queue-${queue.id}`}
                                                                    onClick={(event) => {
                                                                        event.preventDefault();

                                                                        edit(queue);
                                                                    }}
                                                                >
                                                                    Editar
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    href={`#queue-${queue.id}`}
                                                                    onClick={(event) => {
                                                                        event.preventDefault();

                                                                        const menu = document.getElementById(`queue-${queue.id}`);

                                                                        menu.checked = false;

                                                                        setConfirmContent({
                                                                            title: "Confirme:",
                                                                            message: `Deseja mesmo excluir a fila "${queue.name}"?`,
                                                                            payload: queue,
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
                                    : <tr><td colSpan="100%">Nenhuma fila encontrada!</td></tr>
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