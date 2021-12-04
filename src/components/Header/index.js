import React from 'react';
import { useSelector } from 'react-redux';

import styles from './styles.module.css';

export default function Header() {
    const location = useSelector(state => state.navigation);

	return (
		<header className={styles.header}>
			<h1>{location.title} {location.subtitle && (<strong>{location.subtitle}</strong>)}</h1>
		</header>
	);
}
