import React, { useState, useEffect } from "react";

import styles from '../styles.module.css'

export default function Alert({
    title,
    message,
    children,
    state,
    active,
    onClose = () => {
        console.log('Dialog closed...')
    },
}) {
    const [open, setOpen] = state;

    const close = () => {
        setOpen(false);

        onClose();
    }

    return (
        <dialog
            open={open}
            className={styles.dialog}
        >
            <div className={styles.card}>
                {
                    children || (<>
                        <h3>{title || "Alerta!"}</h3>
                        <p>{message || ". . ."}</p>
                    </>)
                }
                <button
                    className="main-color-1"
                    type="button"
                    onClick={close}
                >
                    Fechar
                </button>
            </div>
            
        </dialog>
    );
}