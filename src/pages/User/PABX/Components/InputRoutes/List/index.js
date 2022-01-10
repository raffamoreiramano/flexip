import React, { useState } from "react";

import styles from '../../styles.module.css';
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Table/Pagination";
import Confirm from "../../../../../../components/Modals/Confirm";
import { MdMoreVert } from 'react-icons/md';

export default function InputRouteList({ props }) {
    const {
        routes,
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
        message: "Deseja mesmo excluir essa rota?",
        payload: {}
    });
    
    return (
        <>
            <section className={styles.list}>
                {
                    routes
                    ? <>
                        <Table
                            thead={[
                                { 
                                    heading: "Nome",
                                    align: "left",
                                    width: "99%",
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
                                    ? pages[current].map((route, index) => (
                                        <tr key={index}>
                                            <td>{route.name}</td>
                                            <td>
                                                <div className={styles.listItemMenu}>
                                                    <input
                                                        id={`route-${route.id}`}
                                                        type="checkbox"
                                                    />
                                                    <label htmlFor={`route-${route.id}`}>
                                                        <MdMoreVert/>
                                                    </label>
                                                    <ul className="glass">
                                                        <li>
                                                            <a
                                                                href={`#route-${route.id}`}
                                                                onClick={(event) => {
                                                                    event.preventDefault();

                                                                    edit(route);
                                                                }}
                                                            >
                                                                Editar
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                href={`#route-${route.id}`}
                                                                onClick={(event) => {
                                                                    event.preventDefault();

                                                                    const menu = document.getElementById(`route-${route.id}`);

                                                                    menu.checked = false;

                                                                    setConfirmContent({
                                                                        title: "Confirme:",
                                                                        message: `Deseja mesmo excluir a rota "${route.name}"?`,
                                                                        payload: route,
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
                                    : <tr><td colSpan="100%">Nenhuma rota encontrado!</td></tr>
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