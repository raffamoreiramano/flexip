import React, { useState } from "react";

import styles from '../../styles.module.css';
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Table/Pagination";
import Confirm from "../../../../../../components/Modals/Confirm";
import { MdMoreVert } from 'react-icons/md';

export default function ComponentList({ props }) {
    const {
        komponents,
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
        message: "Deseja mesmo excluir esse componente?",
        payload: {}
    });
    
    return (
        <>
            <section className={styles.list}>
                {
                    komponents
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
                                    ? pages[current].map((komponent, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{komponent.name}</td>
                                                <td>
                                                    <div className={styles.listItemMenu}>
                                                        <input
                                                            id={`komponent-${komponent.id}`}
                                                            type="checkbox"
                                                        />
                                                        <label htmlFor={`komponent-${komponent.id}`}>
                                                            <MdMoreVert/>
                                                        </label>
                                                        <ul className="glass">
                                                            <li>
                                                                <a
                                                                    href={`#komponent-${komponent.id}`}
                                                                    onClick={(event) => {
                                                                        event.preventDefault();

                                                                        edit(komponent);
                                                                    }}
                                                                >
                                                                    Editar
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    href={`#komponent-${komponent.id}`}
                                                                    onClick={(event) => {
                                                                        event.preventDefault();

                                                                        const menu = document.getElementById(`komponent-${komponent.id}`);

                                                                        menu.checked = false;

                                                                        setConfirmContent({
                                                                            title: "Confirme:",
                                                                            message: `Deseja mesmo excluir o componente "${komponent.name}"?`,
                                                                            payload: komponent,
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
                                    : <tr><td colSpan="100%">Nenhum componente encontrado!</td></tr>
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