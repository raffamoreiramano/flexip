import React, { useEffect, useRef } from "react";
import _uniqueId from 'lodash/uniqueId';
import Input from "../../Input";

import styles from '../styles.module.css'

export default function Prompt({
    title,
    message,
    children,
    state,
    onClose = () => {
        console.log('Not confirmed...')
    },
    onSubmit = () => {
        console.log('Confirmed...')
    },
    inputProps = {
        autoComplete: undefined,
        type: undefined,
        label: undefined,
        name: undefined,
        value: undefined,
        validation: undefined,
        onChange: undefined,
        onFocus: undefined,
    }
}) {
    const [open, setOpen] = state;
    const formId = useRef(_uniqueId(`form-id-`)).current;
    const promptId = useRef(_uniqueId(`prompt-id-`)).current;

    const submit = () => {
        if (typeof onSubmit === 'undefined') {
            setOpen(false);
        } else {
            onSubmit();
        }
    };

    const close = () => {
        setOpen(false);

        onClose();
    }

    useEffect(() => {
        if (open) {
            const prompt = document.getElementById(promptId);

            prompt.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

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
                <form id={formId} className={styles.form} onSubmit={(event) => {
                    event.preventDefault();

                    submit();
                }}>
                    <Input
                        id={promptId}
                        {...inputProps}
                    />
                </form>
                <div className={styles.actions}>
                    <button
                        className="transparent main-color-1"
                        type="button"
                        onClick={close}
                    >
                        Fechar
                    </button>
                    <button
                        className="main-color-1"
                        type="submmit"
                        form={formId}
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </dialog>
    );
}