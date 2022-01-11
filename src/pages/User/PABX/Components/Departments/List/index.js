import React, { useState } from "react";

import styles from '../../styles.module.css';
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Table/Pagination";
import Confirm from "../../../../../../components/Modals/Confirm";
import { MdMoreVert } from 'react-icons/md';

export default function DepartmentList({ props }) {
    const {
        departments,
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
        message: "Deseja mesmo excluir esse departamento?",
        payload: {}
    });
    
    return (
        <>
            <section className={styles.list}>
                {
                    departments
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
                                    ? pages[current].map((department, index) => (
                                        <tr key={index}>
                                            <td>{department.name}</td>
                                            <td>
                                                <div className={styles.listItemMenu}>
                                                    <input
                                                        id={`department-${department.id}`}
                                                        type="checkbox"
                                                    />
                                                    <label htmlFor={`department-${department.id}`}>
                                                        <MdMoreVert/>
                                                    </label>
                                                    <ul className="glass">
                                                        <li>
                                                            <a
                                                                href={`#department-${department.id}`}
                                                                onClick={(event) => {
                                                                    event.preventDefault();

                                                                    edit(department);
                                                                }}
                                                            >
                                                                Editar
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                href={`#department-${department.id}`}
                                                                onClick={(event) => {
                                                                    event.preventDefault();

                                                                    const menu = document.getElementById(`department-${department.id}`);

                                                                    menu.checked = false;

                                                                    setConfirmContent({
                                                                        title: "Confirme:",
                                                                        message: `Deseja mesmo excluir o departamento "${department.name}"?`,
                                                                        payload: department,
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
                                    : <tr><td colSpan="100%">Nenhum departamento encontrado!</td></tr>
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