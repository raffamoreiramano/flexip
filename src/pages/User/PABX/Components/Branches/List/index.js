import React, { useState } from "react";
import { MdOutlineQrCode, MdMoreVert } from 'react-icons/md';

import styles from '../../styles.module.css';
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Table/Pagination";
import Confirm from "../../../../../../components/Modals/Confirm";

export default function BranchList({ props }) {
    const {
        PABX,
        branches,
        pages,
        current,
        navigate,
        select,
        add,
        edit,
        remove,
    } = props;

    const [isConfirmActive, setIsConfirmActive] = useState(false);
    const [confirmContent, setConfirmContent] = useState({
        title: "Confirme:",
        message: "Deseja mesmo excluir este ramal?",
        payload: {}
    });
    
    return (
        <>
            <section className={styles.list}>
                {
                    branches
                    ? <>
                        <Table
                            thead={[
                                { 
                                    heading: "Número",
                                    align: "left",
                                    width: "30%",
                                },
                                { 
                                    heading: "Responsável",
                                    align: "left",
                                    width: "29%",
                                },
                                { 
                                    heading: "QR code",
                                    align: "center",
                                    width: "50%",
                                },
                                { 
                                    heading: "Opções",
                                    align: "center",
                                    width: "1%",
                                },
                            ]}
                        >
                            <tbody data-teste={branches.length}>
                                {
                                    pages.length > 0
                                    ? pages[current].map((branch, index) => (
                                        <tr key={index}>
                                            <td>{branch.number}</td>
                                            <td>{branch.branch_users.name}</td>
                                            <td><button><MdOutlineQrCode/></button></td>
                                            <td>
                                                <div className={styles.listItemMenu}>
                                                    <input
                                                        id={`branch-${branch.id}`}
                                                        type="checkbox"
                                                    />
                                                    <label htmlFor={`branch-${branch.id}`}>
                                                        <MdMoreVert/>
                                                    </label>
                                                    <ul className="glass">
                                                        <li>
                                                            <a
                                                                href={`#branch-${branch.id}`}
                                                                onClick={(event) => {
                                                                    event.preventDefault();

                                                                    edit(branch);
                                                                }}
                                                            >
                                                                Editar
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                href={`#branch-${branch.id}`}
                                                                onClick={(event) => {
                                                                    event.preventDefault();

                                                                    const menu = document.getElementById(`branch-${branch.id}`);

                                                                    menu.checked = false;

                                                                    setConfirmContent({
                                                                        title: "Confirme:",
                                                                        message: `Deseja mesmo excluir o ramal ${branch.number}?`,
                                                                        payload: branch,
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
                            {
                                branches.length < PABX.max_branches &&
                                <button onClick={add}>Adicionar</button>
                            }
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