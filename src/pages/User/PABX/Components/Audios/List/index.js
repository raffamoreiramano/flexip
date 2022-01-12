import React, { useState } from "react";

import styles from '../../styles.module.css';
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Table/Pagination";
import Confirm from "../../../../../../components/Modals/Confirm";
import Audio from "../../../../../../components/Audio";
import { MdMoreVert } from 'react-icons/md';

export default function AudioList({ props }) {
    const {
        audios,
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
        message: "Deseja mesmo excluir esse áudio?",
        payload: {}
    });
    
    return (
        <>
            <section className={styles.list}>
                {
                    audios
                    ? <>
                        <Table
                            thead={[
                                { 
                                    heading: "Nome",
                                    align: "left",
                                    width: "20%",
                                },
                                { 
                                    heading: "Áudio",
                                    align: "center",
                                    width: "79%",
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
                                    ? pages[current].map((audio, index) => {
                                        const { full_audio_link: src } = audio;
                                        
                                        return (
                                            <tr key={index}>
                                                <td>{audio.name}</td>
                                                <td align="center">
                                                    <Audio src={src}/>
                                                </td>
                                                <td>
                                                    <div className={styles.listItemMenu}>
                                                        <input
                                                            id={`audio-${audio.id}`}
                                                            type="checkbox"
                                                        />
                                                        <label htmlFor={`audio-${audio.id}`}>
                                                            <MdMoreVert/>
                                                        </label>
                                                        <ul className="glass">
                                                            <li>
                                                                <a
                                                                    href={`#audio-${audio.id}`}
                                                                    onClick={(event) => {
                                                                        event.preventDefault();

                                                                        edit(audio);
                                                                    }}
                                                                >
                                                                    Editar
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    href={`#audio-${audio.id}`}
                                                                    onClick={(event) => {
                                                                        event.preventDefault();

                                                                        const menu = document.getElementById(`audio-${audio.id}`);

                                                                        menu.checked = false;

                                                                        setConfirmContent({
                                                                            title: "Confirme:",
                                                                            message: `Deseja mesmo excluir o áudio "${audio.name}"?`,
                                                                            payload: audio,
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
                                    : <tr><td colSpan="100%">Nenhum áudio encontrado!</td></tr>
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