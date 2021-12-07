import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { updateUser, updatePABX } from '../../store/actions';

import LightLogo from '../../assets/images/logo/flexip.svg';
import DarkLogo  from '../../assets/images/logo/flexip-white.svg';

import { IoCaretDown } from 'react-icons/io5';
import { BsThreeDotsVertical } from 'react-icons/bs';

import styles from "./styles.module.css";

import LOCATIONS from "../../store/locations";

export default function Navbar(props) {
    const location = useSelector(state => state.navigation);
    const theme = useSelector(state => state.theme);
    const user = useSelector(state => state.user);

    const dispatch = useDispatch();

    const navRef = useRef(null);

    const toggleCollapse = () => {
        collapseItems();
        navRef.current.classList.toggle(styles.collapsed);
    }

    const collapseItems = (element = null) => {
        const expItems = document.querySelectorAll(`.${styles.expandableItem}`);

        expItems.forEach((e) => {
            if (e != element) {
                e.classList.remove(styles.expanded);
            }
        });
    }

    const toggleExpandable = (element, collapse = false) => {
        collapseItems(element);

        if (element.classList.contains(styles.expanded) || collapse) {
            element.classList.remove(styles.expanded);
        } else {
            element.classList.add(styles.expanded);
        }
    }

    const navigate = (navItem) => {
        props.history.push(navItem.key);
    }

    const logout = () => {
        localStorage.removeItem("access_token");

        dispatch(updateUser());
        dispatch(updatePABX());

        props.history.push("/");
    }

    return (
        <nav ref={navRef} className={`${styles.navbar} ${styles.collapsed}`}>
            <div className={styles.navbarHeader}>
                <figure className={styles.logo}>
                    <img src={theme.dark ? DarkLogo : LightLogo}
                        alt="Flex IP"
                    />
                </figure>
                <button 
                    className={styles.menuButton}
                    onClick={toggleCollapse}
                >
                    <i className={styles.menuButtonBar} />
                </button>
            </div>
            <ul className={styles.navbarList}>{
                LOCATIONS.map((item, index) => {
                    let child;
                    let liClassName;

                    if (item.nested) {                        
                        child = (
                            <div className={styles.expandableItem}>
                                <a 
                                    href={`.${styles.navbarNestedList}`}
                                    className={styles.expandLink}
                                    onClick={(event) => {
                                        event.preventDefault();

                                        const exp = event.currentTarget.parentElement;

                                        toggleExpandable(exp)
                                    }
                                }>
                                    <i>{item.icon()}</i> <span className={styles.itemName}>{item.name}</span>
                                    <i className={styles.expandIcon}><IoCaretDown /></i>
                                </a>
                                <ul
                                    className={`${styles.navbarNestedList} glass`}
                                    onClick={(event) => {
                                        const exp = event.currentTarget.parentElement.parentElement;

                                        toggleExpandable(exp)
                                        }
                                    }
                                >{
                                    item.nested.map((nestedItem, nestedIndex) => {
                                        if (location.path.match(nestedItem.key)) {
                                            liClassName = styles.active;
                                        }

                                        return (
                                            <li key={nestedIndex} className={styles.navbarItem}>
                                                <a 
                                                    href={`#${nestedItem.key}`}
                                                    onClick={(event) => {
                                                        event.preventDefault();

                                                        navigate(nestedItem);
                                                    }}
                                                >
                                                    <span className={styles.itemName}>{nestedItem.name}</span>
                                                </a>
                                            </li>
                                        )})
                                }</ul>
                            </div>
                        );
                    } else {
                        if (location.path.match(item.key)) {
                            liClassName = styles.active;
                        }

                        child = (
                            <>
                                <a 
                                    href={`#${item.key}`}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        
                                        navigate(item);
                                    }}
                                >
                                    <i>{item.icon()}</i> <span className={styles.itemName}>{item.name}</span>
                                </a>
                                <div className={`${styles.tooltip} glass`}><span className={styles.itemName}>{item.name}</span></div>
                            </>
                        );
                    }

                    return (
                        <li key={index} className={liClassName}>{child}</li>
                    );
                })                    
            }</ul>
            <section className={styles.profile}>
                <figure>
                    <img
                        className={styles.profilePic}
                        src="#"
                        alt={`Foto de perfil: ${user.name}`}
                        title={`Foto de perfil: ${user.name}`}
                        onClick={toggleCollapse}
                        onError={(event)=> {
                            event.currentTarget.classList.add(styles.notFound);
                        }}
                    />
                </figure>
                <h4 className={styles.profileName} title={user.name}>{user.name}</h4>
                <div className={styles.profileMenu}>
                    <input
                        id="profile-menu-checkbox"
                        type="checkbox"
                        className={styles.profileMenuToggle}
                    />
                    <label htmlFor="profile-menu-checkbox" className={styles.profileMenuButton}>
                        <BsThreeDotsVertical />
                    </label>
                    <ul className={`${styles.profileMenuOptions} glass`}>
                        <li>
                            <label
                                htmlFor="profile-menu-checkbox"
                                onClick={() => {
                                    console.log('Suporte')
                                }}
                            >
                                Suporte
                            </label>
                        </li>
                        <li>
                            <label
                                htmlFor="profile-menu-checkbox"
                                onClick={() => {
                                    logout();
                                }}
                            >
                                Sair
                            </label>
                        </li>
                    </ul>
                </div>
            </section>
        </nav>
    );
}