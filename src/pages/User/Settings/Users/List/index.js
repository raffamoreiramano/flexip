import React, { useState } from "react";

import Table from "../../../../../components/Table";
import Pagination from "../../../../../components/Table/Pagination";
import Confirm from "../../../../../components/Modals/Confirm";

import { MdMoreVert } from 'react-icons/md';

import styles from '../styles.module.css';

export default function UserList({
    users,
    pages,
    current,
    navigate,
    add,
    edit,
    remove,
    open,
}) {
    const [isConfirmActive, setIsConfirmActive] = useState(false);
    const [confirmContent, setConfirmContent] = useState({
        title: "Confirme:",
        message: "Deseja mesmo excluir esse usuário?",
        payload: {}
    });

    return (
        <>
            <article className={styles.list}>
                <h2>Lista</h2>
                {
                    users
                    ? <>
                        <Table
                            thead={[
                                { 
                                    heading: "Nome",
                                    align: "left",
                                    width: "40%",
                                },
                                { 
                                    heading: "E-mail",
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
                                    ? pages[current].map((user, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <div className={styles.listItemMenu}>
                                                        <input
                                                            id={`user-${user.id}`}
                                                            type="checkbox"
                                                            disabled={open}
                                                        />
                                                        <label htmlFor={`user-${user.id}`}>
                                                            <MdMoreVert/>
                                                        </label>
                                                        <ul className="glass">
                                                            <li>
                                                                <a
                                                                    href={`#user-${user.id}`}
                                                                    onClick={(event) => {
                                                                        event.preventDefault();

                                                                        const menu = document.getElementById(`user-${user.id}`);

                                                                        menu.checked = false;

                                                                        edit(user);
                                                                    }}
                                                                >
                                                                    Editar
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    href={`#user-${user.id}`}
                                                                    onClick={(event) => {
                                                                        event.preventDefault();

                                                                        const menu = document.getElementById(`user-${user.id}`);

                                                                        menu.checked = false;

                                                                        setConfirmContent({
                                                                            title: "Confirme:",
                                                                            message: `Deseja mesmo excluir o usuário "${user.name}"?`,
                                                                            payload: user,
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
                                    : <tr><td colSpan="100%">Nenhum usuário encontrado!</td></tr>
                                }
                            </tbody>
                        </Table>
                        <div className={styles.listActions}>
                            <Pagination
                                current={current}
                                total={pages.length}
                                onChange={page => navigate(page)}
                            />
                            { !open && <button onClick={add}>Adicionar</button> }
                        </div>
                    </>
                    : <p className={styles.nodata}>. . .</p>
                }
            </article>
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