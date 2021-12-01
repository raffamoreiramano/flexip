import React from "react";

import styles from '../styles.module.css'

export default function Confirm({
    title,
    message,
    children,
    state,
    onCancel = () => {
        console.log('Not confirmed...')
    },
    onConfirm = () => {
        console.log('Confirmed...')
    },
}) {
    const [open, setOpen] = state;

    const confirm = () => {
        setOpen(false);

        onConfirm();
    }

    const cancel = () => {
        setOpen(false);

        onCancel();
    }

    return (
        <dialog
            open={open}
            className={styles.dialog}
        >
            <div className={`${styles.card} glass`}>
                {
                    children || (<>
                        <h3>{title || "Alerta!"}</h3>
                        <p>{message || ". . ."}</p>
                    </>)
                }
                <div className={styles.actions}>
                    <button
                        className="main-color-4"
                        type="button"
                        onClick={cancel}
                    >
                        Cancelar
                    </button>
                    <button
                        className="main-color-1"
                        type="button"
                        onClick={confirm}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </dialog>
    );
}