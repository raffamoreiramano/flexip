import React, { useRef, useState } from 'react';

import Logo from '../../assets/images/logo/flexip.svg';
import LogoIcon from '../../assets/images/logo/flexip-white.svg';

import { IoCaretDown } from 'react-icons/io5';

import styles from "./styles.module.css";

import NavItems from "./NavItems";

export default function Navbar(props) {
    const navRef = useRef(null);
    const [activeLink, setActiveLink] = useState(NavItems[0]);

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
        setActiveLink(navItem);
        props.history.push(navItem.key);
    }

    return (
        <nav ref={navRef} className={`${styles.navbar} ${styles.collapsed}`}>
            <div className={styles.navbarHeader}>
                <figure className={styles.logo}>
                    <img src={Logo}
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
                NavItems.map((item, index) => {
                    let child;
                    let liClassName;

                    if (item.nested) {                        
                        child = (
                            <div className={styles.expandableItem}>
                                <a className={styles.expandLink} onClick={(event) => {
                                    const exp = event.currentTarget.parentElement;

                                    toggleExpandable(exp)}
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
                                        if (nestedItem == activeLink) {
                                            liClassName = styles.activeLink;
                                        }

                                        return (
                                            <li key={nestedIndex} className={styles.navbarItem}>
                                                <a 
                                                    onClick={() => navigate(nestedItem)}
                                                >
                                                    <span className={styles.itemName}>{nestedItem.name}</span>
                                                </a>
                                            </li>
                                        )})
                                }</ul>
                            </div>
                        );
                    } else {
                        if (item == activeLink) {
                            liClassName = styles.activeLink;
                        }

                        child = (
                            <>
                                <a onClick={() => navigate(item)}>
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
        </nav>
    );
}