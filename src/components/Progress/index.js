import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './styles.module.css';

export default function Progress() {
    const [value, setValue] = useState(0);
    const isLoading = useSelector(state => state.isLoading);

    useEffect(() => {
        if (isLoading) {
            setValue(0.5);
        } else if (value !== 0) {
            setValue(1);

            setTimeout(() => setValue(0), 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    return (
        <progress onClick={event => {
            if (isLoading) {
                event.stopPropagation();
            }
        }} className={styles.progress} max="1" value={value} />
    );
}