import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../../../store/actions";

import Input, { Select } from "../../../components/Input";

import { 
    CPMask,
    validateEmail,
    validateName,
    validatePassword,
    validatePhone,
    validateCPF,
    validateCNPJ,
    phoneMask,
} from '../../../services/helpers';
import api from "../../../services/api";
import { API_GUARD } from "../../../services/env";

import styles from './styles.module.css';
import Alert from "../../../components/Modals/Alert";


export default function Register(props) {
    const dispatch = useDispatch();

    const formRef = useRef(null);
    const [step, setStep] = useState(1);

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });

    const APIFields = {
        'name': 'name',
        'email': 'email',
        'password': 'password',
        'phone': 'phoneNumber',
        'document': 'CP',
        'companyName': 'companyName',
        'pabx': 'PABXName',
        'telephone_id': 'PABXNumber',
        'max_branches': 'branchesAmount',
        'branch_name': 'branchName',
        'branch_number': 'branchNumber',
        'branch_password': 'branchPassword',
    };


    // primeiro passo
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    
    // segundo passo
    const [phoneNumber, setPhoneNumber] = useState("");
    const [CP, setCP] = useState("");
    const [personType, setPersonType] = useState("");
    const [companyName, setCompanyName] = useState("");


    // terceiro passo
    const [PABXName, setPABXName] = useState("");
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState("");
    const [PABXNumber, setPABXNumber] = useState("");
    const [PABXNumbers, setPABXNumbers] = useState([]);
    const [branchPassword, setBranchPassword] = useState("");
    
    
    // quarto passo
    const [branchesAmount, setBranchesAmount] = useState("");
    const [branchName, setBranchName] = useState("");
    const [branchNumber, setBranchNumber] = useState("");

    const [isValidated, setIsValidated] = useState(false);
    const initialValidation = {
        name: {
            isInvalid: false,
            message: ""
        },
        email: {
            isInvalid: false,
            message: ""
        },
        password: {
            isInvalid: false,
            message: ""
        },
        phoneNumber: {
            isInvalid: false,
            message: ""
        },
        phoneType: {
            isInvalid: false,
            message: ""
        },
        CP: {
            isInvalid: false,
            message: ""
        },
        companyName: {
            isInvalid: false,
            message: ""
        },
        PABXName: {
            isInvalid: false,
            message: ""
        },
        city: {
            isInvalid: false,
            message: ""
        },
        PABXNumber: {
            isInvalid: false,
            message: ""
        },
        branchesAmount: {
            isInvalid: false,
            message: ""
        },
        branchName: {
            isInvalid: false,
            message: ""
        },
        branchNumber: {
            isInvalid: false,
            message: ""
        },
        branchPassword: {
            isInvalid: false,
            message: ""
        },
    };
    const [validation, setValidation] = useState(initialValidation);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await api.get(`/v1/${API_GUARD}/auth/cities`);

                if (response.status && response.status === 200) {
                    const { cities } = response.data;

                    setCities(cities);
                }
            } catch (error) {
                if (error.response) {
                    console.log(error.response);
                } else {
                    console.log(error);
                }
            }
        }

        fetchCities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            const fetchPhones = async () => {
                try {
                    const response = await api.get(`/v1/${API_GUARD}/auth/telephones/city/${city}`);
    
                    if (response.status && response.status === 200) {
                        const { telephones } = response.data;
                        
                        setPABXNumbers(telephones);
                        setStep(null);
                        setStep(step);
                    }
                } catch (error) {
                    if (error.response) {
                        console.log(error.response);
                    } else {
                        console.log(error);
                    }
                }
            }
    
            fetchPhones();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city]);

    const validateStep = () => {
        let newValidation = initialValidation;
        let veredict = true;

        switch (step) {
            // name,
            // email,
            // phoneNumber,
            case 1: 
                if (!validateName(name)) {
                    newValidation.name = {
                        isInvalid: true,
                        message: "Nome inválido!",
                    }
                }

                if (!validateEmail(email)) {
                    newValidation.email = {
                        isInvalid: true,
                        message: "E-mail inválido!",
                    }
                }

                if (!validatePassword(password)) {
                    newValidation.password = {
                        isInvalid: true,
                        message: "Deve ter de 8 a 32 caracteres [a-Z, 0-9, !@#$%&*-_.]!",
                    }
                }
                break;
            // phoneNumber,
            // CPF/CNPJ,
            // companyName,
            case 2:
                if (!validatePhone(phoneNumber)) {
                    newValidation.phoneNumber = {
                        isInvalid: true,
                        message: "Número de telefone inválido!",
                    }
                }

                switch (personType) {
                    case "juridica":
                        if (!validateCNPJ(CP)) {
                            newValidation.CP = {
                                isInvalid: true,
                                message: "CNPJ inválido!",
                            }
                        }

                        if (companyName.length < 2) {
                            newValidation.companyName = {
                                isInvalid: true,
                                message: "Nome de empresa inválido!",
                            }
                        }
                        break;
                    default:
                        if (!validateCPF(CP)) {
                            newValidation.CP = {
                                isInvalid: true,
                                message: "CPF inválido!",
                            }
                        }
                }
                break;
            // PABXName,
            // city,
            // PABXNumber,
            case 3:
                if (!PABXName) {
                    newValidation.PABXName = {
                        isInvalid: true,
                        message: "Nome de PABX inválido!",
                    }
                }
                
                if (!city) {
                    newValidation.city = {
                        isInvalid: true,
                        message: "Escolha uma cidade!",
                    }
                }
                
                if (!PABXNumber) {
                    newValidation.PABXNumber = {
                        isInvalid: true,
                        message: "Escolha um telefone!",
                    }
                }

                break;
            // branchesAmount
            // branchName,
            // branchNumber,
            // branchPassword,
            case 4:
                if (branchesAmount < 1) {
                    newValidation.branchesAmount = {
                        isInvalid: true,
                        message: "Você precisa ter pelo menos 1 ramal!",
                    }
                }

                if (!branchName) {
                    newValidation.branchName = {
                        isInvalid: true,
                        message: "Nome de ramal inválido!",
                    }
                }
                
                if (branchNumber.length < 3 || branchNumber.length > 5) {
                    newValidation.branchNumber = {
                        isInvalid: true,
                        message: "Número deve ter entre 3 e 5 dígitos!",
                    }
                }

                if (!validatePassword(branchPassword)) {
                    newValidation.branchPassword = {
                        isInvalid: true,
                        message: "Deve ter de 8 a 32 caracteres [a-Z, 0-9, !@#$%&*-_.]!",
                    }
                }
                break;
            default: veredict = false;
        }

        if (Object.values(newValidation).some(item => item.isInvalid)) {
            veredict = false;
        } else if (step === 2) {
            saveLead();
        }

        setValidation(newValidation);
        setIsValidated(true);

        return veredict;
    }

    const validateByResponse = (errors) => {
        const fields = Object.keys(errors);

        console.log(fields);

        const invalidFields = fields.map(field => APIFields[field]);

        const fieldsByStep = {
            1: [
                'name',
                'email',
                'password',
            ],
            2: [
                'phoneNumber',
                'CP',
                'companyName',
            ],
            3: [
                'PABXName',
                'PABXNumber',
            ],
            4: [
                'branchesAmount',
                'branchName',
                'branchNumber',
                'branchPassword',
            ],
        }

        let newValidation = initialValidation;

        const invalidStep = Object.keys(fieldsByStep).find(step => {
            if (fieldsByStep[step].some(item => invalidFields.includes(item))) {
                return true;
            }

            return false;
        });

        invalidFields.forEach((key, index) => {
            const message = errors[fields[index]];

            newValidation[key] = {
                isInvalid: true,
                message,
            }
        });

        setValidation(newValidation);
        setIsValidated(true);
        setStep(parseInt(invalidStep));
    }

    const handleChange = (callback) => {
        if (isValidated) {
            setIsValidated(false);
            cleanValidation();
        }

        callback.call();
    }

    const cleanValidation = () => setValidation(initialValidation);

    const saveLead = () => {
        api.post(`/v1/${API_GUARD}/auth/save_lead`, {
            name: name.trim(),
            email: email.trim(),
            phone: phoneNumber.replace(/\D/g, ""),
        });
    }

    const register = async () => {
        dispatch(setIsLoading(true));

        const body = {
            name: name.trim(),
            email: email.trim(),
            phone: phoneNumber.replace(/\D/g, ""),
            password: password.trim(),
            companyName: companyName.trim(),
            document: CP.replace(/\D/g, ""),
            pabx: PABXName.trim(),
            telephone_id: PABXNumber,
            max_branches: branchesAmount,
            branch_name: branchName.trim(),
            branch_number: branchNumber.replace(/\D/g, ""),
            branch_password: branchPassword,
        }

        try {
            const response = await api.post(`/v1/${API_GUARD}/auth/register`, body);

            if (response.status && response.status === 200) {
                dispatch(setIsLoading(false));

                props.history.push('/auth');

                console.log(response.data);
            }
        } catch(error) {
            dispatch(setIsLoading(false));

            let content = {
                title: "Ops!",
                message: "Parece que houve um erro... Por favor, tente mais tarde!",
            }            

            if (error.response) {
                const { title, message } = error.response.data;

                content = {
                    title: title || content.title,
                    message: message || content.message,
                }
                
                if (error.response.status === 422) {
                    content = {
                        title: "Formulário inválido!",
                        message: "Verifique se os campos do formulário foram preenchidos corretamente.",
                    }

                    const { errors } = error.response.data;

                    validateByResponse(errors);
                }
            }

            setAlertContent(content);
            setIsAlertActive(true);
        }
    }

    const Fieldset = () => {
        let inputs;

        switch (step) {
            case 1:
                // name,
                // email,
                // phoneNumber,
                inputs = (<>
                    <Input
                        id="register-name"
                        type="text"
                        label="Nome"
                        placeholder="Nome do responsável legal"
                        name="name"
                        value={name}
                        onChange={(event) => handleChange(() => {
                            setName(event.target.value);
                        })}
                        validation={validation.name}
                    />
                    <Input
                        id="register-email"
                        type="email"
                        label="E-mail"
                        placeholder="Endereço de e-mail"
                        name="email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        validation={validation.email}
                    />
                    <Input
                        id="register-password"
                        type="password"
                        label="Senha"
                        name="password"
                        value={password}
                        onChange={(event) => handleChange(() => {
                            setPassword(event.target.value);
                        })}
                        validation={validation.password}
                    />
                </>);
                break;
            case 2:
                // phoneNumber,
                // CPF/CNPJ,
                // companyName,
                inputs = (<>
                    <Input
                        id="register-phoneNumber"
                        type="tel"
                        label="Telefone"
                        placeholder="Telefone fixo ou móvel"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(event) => handleChange(() => {
                            setPhoneNumber(event.target.value);
                        })}
                        validation={validation.phoneNumber}
                    />
                    <Input
                        id="register-CP"
                        type="text"
                        label="CPF/CNPJ"
                        placeholder="Cadastro de Pessoa Física ou Jurídica"
                        name="CP"
                        value={CP}
                        onChange={(event) => handleChange(() => {
                            const maskedCP = CPMask(event.target.value);

                            if (maskedCP.length === 18) {
                                setPersonType('juridica');
                            } else {
                                setPersonType('fisica');
                            }

                            setCP(maskedCP);
                        })}
                        validation={validation.CP}
                    />
                    {
                        personType === 'juridica' &&
                        <Input
                            id="register-companyName"
                            type="text"
                            label="Nome da empresa"
                            placeholder="Nome da empresa"
                            name="companyName"
                            value={companyName}
                            onChange={(event) => handleChange(() => {
                                setCompanyName(event.target.value);
                            })}
                            validation={validation.companyName}
                        />
                    }
                    
                </>);
                break;
            case 3:
                // PABXName,
                // city,
                // PABXNumber,
                inputs = (<>
                    <Input
                        id="register-PABXName"
                        type="text"
                        label="Nome"
                        placeholder="Nome do PABX"
                        name="PABXName"
                        value={PABXName}
                        onChange={(event) => handleChange(() => {
                            setPABXName(event.target.value);
                        })}
                        validation={validation.PABXName}
                    />
                    <Select
                        id="register-city"
                        label="Cidade"
                        name="city"
                        placeholder="Cidades disponíveis..."
                        value={city}
                        onChange={(event) => handleChange(() => {
                            setCity(event.target.value);
                        })}
                        validation={validation.city}
                    >
                        {
                            cities.map((item, index) => {
                                return (
                                    <option key={index} value={item.id}>{item.name}</option>
                                );
                            })
                        }
                    </Select>
                    {
                        city && (
                            <Select
                                id="register-PABXNumber"
                                label="Telefone"
                                name="PABXNumber"
                                placeholder="Telefones para contratar..."
                                value={PABXNumber}
                                onChange={(event) => handleChange(() => {
                                    setPABXNumber(event.target.value);
                                })}
                                validation={validation.PABXNumber}
                            >
                                {
                                    PABXNumbers.map((item, index) => {
                                        return (
                                            <option key={index} value={item.id}>{phoneMask(item.ddd + item.number)}</option>
                                        );
                                    })
                                }
                            </Select>
                        )
                    }
                                     
                </>);
                break;
            case 4:
                // branchesAmount
                // branchName,
                // branchNumber,
                // branchPassword,
                inputs = (<>
                    <Input
                        id="register-branchesAmount"
                        type="number"
                        label="Quantia"
                        placeholder="Quantos deseja contratar"
                        name="branchesAmount"
                        value={branchesAmount}
                        onChange={(event) => handleChange(() => {
                            setBranchesAmount(event.target.value);
                        })}
                        validation={validation.branchesAmount}
                    />
                    {
                        branchesAmount > 0 && (<>
                            <Input
                                id="register-branchName"
                                type="text"
                                label="Primeiro Ramal"
                                placeholder="Nome do Ramal"
                                name="branchName"
                                value={branchName}
                                onChange={(event) => handleChange(() => {
                                    setBranchName(event.target.value);
                                })}
                                validation={validation.branchName}
                            />
                            <Input
                                id="register-branchNumber"
                                type="tel"
                                label="Número do Ramal"
                                placeholder="Número do primeiro Ramal"
                                name="branchNumber"
                                value={branchNumber}
                                onChange={(event) => handleChange(() => {
                                    setBranchNumber(event.target.value);
                                })}
                                validation={validation.branchNumber}
                            />
                            <Input
                                id="register-branchPassword"
                                type="password"
                                label="Senha do Ramal"
                                name="branchPassword"
                                value={branchPassword}
                                onChange={(event) => handleChange(() => {
                                    setBranchPassword(event.target.value);
                                })}
                                validation={validation.branchPassword}
                            />
                        </>)
                    }
                </>);
                break;
            default:
                inputs = (<>
                    <Input
                        id="register-name"
                        type="text"
                        label="Nome"
                        placeholder="Nome do responsável legal"
                        name="name"
                        value={name}
                        onChange={(event) => handleChange(() => {
                            setName(event.target.value);
                        })}
                        validation={validation.name}
                    />
                    <Input
                        id="register-email"
                        type="email"
                        label="E-mail"
                        placeholder="Endereço de e-mail"
                        name="email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        validation={validation.email}
                    />
                    <Input
                        id="register-password"
                        type="password"
                        label="Senha"
                        name="password"
                        value={password}
                        onChange={(event) => handleChange(() => {
                            setPassword(event.target.value);
                        })}
                        validation={validation.password}
                    />
                </>);
        }

        return inputs;
    }

    const Legend = () => {
        switch (step) {
            case 2:
                return "Contato";
            case 3:
                return "PABX";
            case 4:
                return "Ramais";
            default:
                return "Acesso";
        }
    }

    return (
        <>
            <main className={styles.main}>
                <div className={styles.register}>
                    <h1>Cadastro | <strong><span>{Legend()}</span></strong></h1>
                    <form ref={formRef} className={styles.form} autoComplete="off" onSubmit={(event) => event.preventDefault()}>
                        <fieldset>
                            { Fieldset() }
                            {
                                step <= 1 &&
                                <a 
                                    href="/auth" 
                                    onClick={(event) => { 
                                        event.preventDefault();
                                        
                                        props.history.push('/auth') 
                                    }}
                                >
                                    Já tenho conta!
                                </a>
                            }
                        </fieldset>
                        <div className={styles.actions}>
                            <button
                                className={step <= 3 ? "main-color-1" : "main-color-2"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    
                                    if (validateStep()) {
                                        if (step < 4) {
                                            setStep(step + 1);
                                        } else {
                                            register();
                                        }
                                    }
                                }}
                            >
                                {step <= 3 ? "Continuar" : "Cadastrar"}
                            </button> 
                            {
                                step > 1 &&
                                <button
                                    className={"transparent"}
                                    onClick={(e) => {
                                        e.preventDefault();

                                        if (step > 1) {
                                            setStep(step - 1);
                                        } else {
                                            props.history.push("/auth");
                                        }

                                    }}
                                >
                                    Voltar
                                </button>
                            }
                        </div>                        
                    </form>
                </div>
            </main>
            <Alert
                title={alertContent.title}
                message={alertContent.message}
                state={[isAlertActive, setIsAlertActive]}
            />
        </>
    );
}