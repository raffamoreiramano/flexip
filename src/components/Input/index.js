import React, { useState, useEffect, useRef } from 'react';

import { phoneMask } from '../../services/helpers';

import styles from './styles.module.css';

export default function Input({
    id,
    label,
    placeholder,
    type,
    name,
    value = "",
    autoComplete,
    onChange,
    onFocus = () => {},
    validation = {
        isInvalid: false,
        message: "",
    },
}) {
    const [showPassword, setShowPassword] = useState(false);
    const input = () => {
        let inputProps = {
            type,
            placeholder: placeholder || label,
            title: `${label}: ${value || '...'}`,
            name,
            value,
            autoComplete: autoComplete ?? "off",
            onChange,
            onFocus,
        };

        switch (type) {
            case "email":
                inputProps = {
                    ...inputProps,
                    type: "email",
                    title: `${label}: ${value || '...'}`
                }

                break;
            case "password":
                inputProps = {
                    ...inputProps,
                    type: showPassword ? "text" : "password",
                    title: label,
                    placeholder: showPassword ? inputProps.placeholder : [...inputProps.placeholder].map(c => "•").join(""),
                }

                break;
            case "tel":
                const newOnChange = (event) => {
                    const newValue = phoneMask(event.target.value);

                    onChange({...event, target: {...event.target, value: newValue}});
                };

                inputProps = {
                    ...inputProps,
                    onChange: newOnChange,
                }

                break;
            case "number": break;
            default:
                inputProps = {
                    ...inputProps,
                    type: "text",
                    title: `${label}: ${value || '...'}`
                }
        }

        let inputElement = <input id={id} className={styles.input} {...inputProps} />

        if (type === "password") {
            inputElement = (
                <div className={styles.password}>
                    <input
                        className={styles.toggle}
                        id={id + "-suffix"}
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    <label className={styles.toggleIcon} htmlFor={id + "-suffix"} />
                    {inputElement}
                </div>
            );
        }

        return inputElement;
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
    value = "",
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
    const searchboxRef = useRef(null);

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
                        } else if (search) {
                            searchboxRef.current.focus();
                        }
                    }}
                /> 
                <label 
                    htmlFor={id}
                    className={styles.input}
                    title={"Tipo de pessoa: " + selected.target.children}
                    children={selected.target.children || '⠀'}
                />
                <div className={`${styles.options} glass`}>
                    {
                        search && <div className={styles.searchbox}>
                            <input
                                type="text"
                                value={searchValue}
                                ref={searchboxRef}                               
                                onChange={(event) => setSearchValue(event.target.value)} 
                            />
                        </div>
                    }
                    <ul className={styles.optionsList}>
                        {
                            options.length > 0
                            ? options.map((option, index) => <li
                                key={index}
                                children={option.props.children}
                                title={option.props.children}
                                onClick={() => {
                                    setSelected({ target: option.props });
                                    setActive(false);
                                }}
                            />)
                            : <li
                                className={styles.disabledOption}
                                onClick={() => {
                                    setActive(false);
                                }}
                            >
                                Nenuma opção disponível...
                            </li>
                        }
                    </ul>
                </div>
            </div>
            <strong className="error-message">{validation.message}</strong>
        </div>
    );
}

export function Radio({
    id,
    label,
    name,
    value = "",
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