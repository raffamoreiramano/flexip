import React, { useState, useEffect, useRef } from 'react';

import { phoneMask } from '../../services/helpers';

import { BiUpload } from "react-icons/bi";

import styles from './styles.module.css';

export default function Input({
    id,
    label,
    placeholder,
    type,
    name,
    filename = {
        value: '',
        onChange: () => {},
    },
    accept,
    value = "",
    autoComplete,
    onChange,
    onFocus = () => {},
    validation = {
        isInvalid: false,
        message: "",
    },

}, group) {
    const [showPassword, setShowPassword] = useState(false);
    const element = () => {
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
                const telOnChange = (event) => {
                    const newValue = phoneMask(event.target.value);

                    onChange({...event, target: {...event.target, value: newValue}});
                };

                inputProps = {
                    ...inputProps,
                    onChange: telOnChange,
                }

                break;
            case "number":
                const onFocus = (event) => {
                    const root = document.getElementById('root');
                    const input = event.currentTarget;

                    const onWheel = event => event.stopPropagation();

                    root.addEventListener('wheel', onWheel, true);

                    const onBlur = () => {    
                        root.removeEventListener('wheel', onWheel);
                    }

                    input.removeEventListener('blur', onBlur);
                    input.addEventListener('blur', onBlur);
                }

                inputProps = {
                    ...inputProps,
                    onFocus,
                }
                break;
            case "file":
                const fileOnChange = (event) => {
                    const [newValue] = event.target.files;

                    onChange({...event, target: {...event.target, value: newValue}});

                    if (!filename.value) {
                        const str = newValue?.name || '';
                        const noExtName = str.substr(-str.length, str.lastIndexOf("."));

                        filename.onChange({...event, target: {...event.target, value: noExtName}});
                    }
                };

                inputProps = {
                    ...inputProps,
                    placeholder: placeholder || `Escolha um arquivo de ${label.toLowerCase()}...`,
                    accept,
                    title: `${label}: ${filename.value || '...'}`, 
                    onChange: fileOnChange,
                }

                break;
            default:
                inputProps = {
                    ...inputProps,
                    type: "text",
                    title: `${label}: ${value || '...'}`
                }
        }

        let inputElement = <input id={id} className={styles.input} {...inputProps}/>

        if (type === "password") {
            inputElement = (
                <div className={styles.password}>
                    <input
                        className={styles.toggle}
                        id={`${id}-suffix`}
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    <label className={styles.toggleIcon} htmlFor={`${id}-suffix`} />
                    {inputElement}
                </div>
            );
        }

        if (type === "file") {
            inputElement = (
                <div className={styles.file}>
                    <input
                        className={styles.filename}
                        type="text"
                        id={`${id}-filename`}
                        placeholder={inputProps.placeholder}
                        title={inputProps.title}
                        name={`${name}_filename`}
                        {...filename}
                    />
                    <label className={styles.button} htmlFor={id}>
                        <i><BiUpload/></i>
                    </label>
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

    if (group === true) {
        return element();
    }

    return (
        <div className={className}>
            <label htmlFor={id} className="input-label">{label}</label>
            {
                element()
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
}, group) {
    const [options, setOptions] = useState(children || []);
    const [searchValue, setSearchValue] = useState("");

    const selectRef = useRef(null);

    const [active, setActive] = useState(false);
    const searchboxRef = useRef(null);

    useEffect(() => {
        setOptions(children);
    }, [children]);

    useEffect(() => {
        // if (initialRender.current) {
        //     initialRender.current = false;
        // } else {
            let filteredOptions = children;

            if (searchValue) {
                filteredOptions = children.filter((option) => {
                    let string = option?.props?.children;
                    
                    if (Array.isArray(string)) {
                        string = string.join('');
                    }

                    return string.toLowerCase().search(searchValue.toLowerCase()) > -1;
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

    const Selected = () => {
        let props ={
            htmlFor: id,
            className: styles.input,
            title: `${label}: ...`,
            children: placeholder || "Selecione...",
        }

        if (children) {
            const option = children.find(option => option.props.value == value);
            let string = option?.props?.children;

            if (Array.isArray(string)) {
                string = string.join('');
            }

            if (string) {
                props.children = string;
                props.title = `${label}: ${string}`;
            }
        }

        return (
            <label {...props}/>
        );
    }

    const List = ({ options }) => {
        return (
            <ul className={styles.optionsList}>
                {
                    options.length > 0
                    ? options.map((option, index) => <li
                        key={index}
                        children={option.props.children}
                        title={option.props.children}
                        onClick={() => {
                            const event = document.createEvent('HTMLEvents');
                            event.initEvent('change', true, false);

                            selectRef.current.value = option.props.value;
                            selectRef.current.dispatchEvent(event);
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
        );
    }

    const element = (
        <div className={styles.select}>
            <select
                ref={selectRef}
                className={styles.value}
                name={name}
                value={value}
                children={children}
                onChange={(event) => {
                    onChange(event);
                }}
            />
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
            <Selected/>
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
                <List options={search ? options : children}/>
            </div>
        </div>
    );

    if (group === true) {
        return element;
    }

    return (
        <div className={className}>
            <label htmlFor={id}>{label}</label>
                { element }
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
                            checked={option.props.value.toString() === value.toString()}
                            disabled={option.props.disabled || false}
                            onChange={(event) => {
                                let { value } = event.target;

                                value = isNaN(value) ? value : parseInt(value);

                                value = (value === "false") ? false : (value === "true") ? true : value;

                                onChange({...event, value});
                            }}
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

export function Checkboxes({
    id,
    label,
    name,
    value = [],
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
                className={styles.checkboxes}
                children={
                    options.map((option, index) => <li key={index}>
                        <input
                            id={`option-${index}-${id}`}
                            className={styles.input}
                            type="checkbox"
                            name={name}
                            value={option.props.value}
                            checked={value.includes(option.props.value)}
                            disabled={option.props.disabled || false}
                            onChange={(event) => {
                                let list = [...value];

                                const { checked } = event.target;

                                if (checked) {
                                    if (isNaN(event.target.value)) {
                                        list.push(event.target.value);
                                    } else {
                                        list.push(parseInt(event.target.value));
                                    }

                                } else {
                                    const index = list.findIndex((item) => item.toString() === event.target.value.toString());

                                    if (index > -1) {
                                        list.splice(index, 1);
                                    }
                                }

                                onChange({...event, value: list});
                            }}
                        />
                        <label
                            className={styles.label}
                            htmlFor={`option-${index}-${id}`}
                            children={option.props.children}
                        />
                    </li>
                    )
                }
            />
            <strong className="error-message">{validation.message}</strong>
        </div>
    );
}

Input.Group = ({
    id,
    label,
    children,
    validation,
}) => {
    let group = () => {
        let elements;

        if (!Array.isArray(children)) {
            switch (children.type.name) {
                case "Select":
                    elements = Select(children.props, true);
                    break;
                case "Input":
                    elements = Input(children.props, true);
                    break;
                default:
                    elements = children;
            }

            return elements;
        }

        elements = children.map(child => {
            let element;

            switch (child.type.name) {
                case "Select":
                    element = Select(child.props, true);
                    break;
                case "Input":
                    element = Input(child.props, true);
                    break;
                default:
                    element = child;
            }

            return element;
        });

        return elements;
    };
    
    let className = styles.formControl;

    if (validation.isInvalid) {
        className += ` ${styles.invalid}`;
    }

    return (
        <div className={className}>
            <label htmlFor={id} className="input-label">{label}</label>
                <div className={styles.group}>{ group() }</div>
            <strong className="error-message">{validation.message}</strong>
        </div>
    );
}