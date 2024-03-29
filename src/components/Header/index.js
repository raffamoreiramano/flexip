import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setDarkMode } from '../../store/actions';

import { BsLightbulb,BsLightbulbFill } from 'react-icons/bs'

import styles from './styles.module.css';

export default function Header() {
    const location = useSelector(state => state.navigation);
	const theme = useSelector(state => state.theme);

	const dispatch = useDispatch();

	const initialRender = useRef(true);

	useEffect(() => {
		const html = document.documentElement;

		if (theme.dark) {
			html.classList.add("dark-theme");
		} else {
			html.classList.remove("dark-theme");
		}

		if (initialRender.current) {
			initialRender.current = false;
			
			const darkmode = !!parseInt(localStorage.getItem('darkmode'));

			dispatch(setDarkMode(darkmode));
		} else {
			localStorage.setItem('darkmode', + theme.dark);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [theme]);

	return (
		<header className={styles.header}>
			<h1>{location.title} {location.subtitle && (<strong>{location.subtitle}</strong>)}</h1>
			<aside>
				<p>V3.0</p>
				<button onClick={() => dispatch(setDarkMode(!theme.dark))}>
					{theme.dark ? <BsLightbulbFill /> : <BsLightbulb />}
				</button>
			</aside>
		</header>
	);
}
