import React, { useState, useEffect, useRef } from 'react';
import _uniqueId from 'lodash/uniqueId';

import styles from './styles.module.css';

export default function Input({
    id,
    label,
    placeholder,
    type,
    name,
    value,
    onChange,
    validation = {
        isInvalid: false,
        message: "",
    },
}) {
    const input = () => {
        let inputProps = {};
        let ph = placeholder || label;

        switch (type) {
            case "email":
                inputProps = {
                    type: "email",
                    title: `${label}: ${value || '...'}`
                }
                break;
            case "password":
                inputProps = {
                    type: "password",
                    title: label,
                }
                ph = "••••••••";
                break;
            default:
                inputProps = {
                    type: "text",
                    title: `${label}: ${value || '...'}`
                }
        }

        return (
            <input
                id={id}
                placeholder={ph}
                className={styles.input}
                {...inputProps}
                name={name}
                value={value}
                onChange={onChange}
            />
        );
    }

    let className = styles.formControl;

    if (validation.isInvalid) {
        className += ` ${styles.invalid}`;
    }


    return (
        <div className={className}>
            <label htmlFor={id} className="input-label">{label}</label>
            {
                input()
            }
            <strong className="error-message">{validation.message}</strong>
        </div>
    );
}

export function Select({
    id,
    label,
    placeholder,
    name,
    value,
    children = [],
    search = false,
    onChange,
    validation = {
        isInvalid: false,
        message: "",
    },
}) {
    const [options, setOptions] = useState(children || []);
    const [searchValue, setSearchValue] = useState("");
    const [selected, setSelected] = useState({
        target: {
            value: '', 
            children: options.find(option => option.props.value === value)?.props?.children || placeholder || "Selecione..."
        }
    });
    const [active, setActive] = useState(false);
    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            onChange(selected);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    useEffect(() => {
        // if (initialRender.current) {
        //     initialRender.current = false;
        // } else {
            let filteredOptions = children;

            if (searchValue) {
                filteredOptions = children.filter((option) => {
                    return option?.props?.children?.toLowerCase().search(searchValue.toLowerCase()) > -1;
                });
            }

            setOptions(filteredOptions);
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    let className = styles.formControl;

    if (validation.isInvalid) {
        className += ` ${styles.invalid}`;
    }


    return (
        <div className={className}>
            <label htmlFor={id}>{label}</label>
            <div className={styles.select}>
                <input className={styles.value} type="hidden" name={name} value={value} />
                <input
                    id={id}
                    className={styles.toggle}
                    type="checkbox"
                    checked={active}
                    onChange={(event) => {
                        setActive(event.target.checked);
                        
                        if (active) {
                            setTimeout(() => {
                                setSearchValue("");
                            }, 200);
                        }
                    }}
                /> 
                <label 
                    htmlFor={id}
                    className={styles.input}
                    title={"Tipo de pessoa: " + selected.target.children}
                    children={selected.target.children || '⠀'}
                />
                <ul className={`${styles.options} glass`}>
                    {
                        search && <li className={styles.searchbox}>
                            <input
                                type="text"
                                value={searchValue}                                
                                onChange={(event) => setSearchValue(event.target.value)} 
                            />
                        </li>
                    }
                    {
                        options.map((option, index) => <li
                            key={index}
                            children={option.props.children}
                            title={option.props.children}
                            onClick={() => {
                                setSelected({ target: option.props });
                                setActive(false);
                            }}
                        />)
                    }
                </ul>
            </div>
            <strong className="error-message">{validation.message}</strong>
        </div>
    );
}

export function Radio({
    id,
    label,
    name,
    value,
    children,
    options = children || [],
    onChange,
    validation = {
        isInvalid: false,
        message: "",
    },
}) {
    let className = styles.formControl;

    if (validation.isInvalid) {
        className += ` ${styles.invalid}`;
    }

    return (
        <div className={className}>
            <label htmlFor={id}>{label}</label>
            <ul 
                id={id}
                className={styles.radio}
                children={
                    options.map((option, index) => <li key={index}>
                        <input
                            id={`option-${index}-${id}`}
                            className={styles.input}
                            type="radio"
                            name={name}
                            value={option.props.value}
                            checked={option.props.value === value ? true : false}
                            disabled={option.props.disabled || false}
                            onChange={onChange}
                        />
                        <label
                            className={styles.label}
                            htmlFor={`option-${index}-${id}`}
                            children={option.props.children}
                        />
                    </li>)
                }
            />
            <strong className="error-message">{validation.message}</strong>
        </div>
    );
}