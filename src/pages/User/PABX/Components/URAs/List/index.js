import React, { useState } from "react";

import styles from '../../styles.module.css';
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Table/Pagination";
import Confirm from "../../../../../../components/Modals/Confirm";
import Audio from "../../../../../../components/Audio";
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
                                    width: "30%",
                                },
                                { 
                                    heading: "Timeout",
                                    align: "left",
                                    width: "10%",
                                },
                                { 
                                    heading: "Áudio",
                                    align: "center",
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
                                    ? pages[current].map((ura, index) => {
                                        const { full_audio_link: src } = ura.sound;

                                        let { seconds: timeout } = ura;
                                        const seconds = timeout > 1 ? "segundos" : 'segundo';

                                        return (
                                            <tr key={index}>
                                                <td>{ura.name}</td>
                                                <td>{`${timeout} ${seconds}`}</td>
                                                <td align="center">
                                                    <Audio src={src}/>
                                                </td>
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