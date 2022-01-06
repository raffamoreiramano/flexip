import React from "react";

import styles from '../styles.module.css'

export default function Confirm({
    title,
    message,
    payload,
    children,
    state,
    onCancel = () => {},
    onConfirm = () => {},
}) {
    const [open, setOpen] = state;

    const confirm = () => {
        setOpen(false);

        onConfirm(payload);
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
                        <h3>{title || "Confirme:"}</h3>
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