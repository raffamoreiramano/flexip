import React from "react";

import styles from './styles.module.css'

export default function Alert({
    title,
    src,
    className,
}) {
    className = className ? `${className} ${styles.audio}` : styles.audio;

    return (
        <audio preload="none" src={src} controls className={className}>
            Your browser does not support the <code>audio</code> element.
        </audio>
    );
}