import React, { useState, useRef } from "react";
import _uniqueId from 'lodash/uniqueId';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserActions from "../../../store/actions/user";

import Input, { Select, Radio } from "../../../components/Input";

import Logo from "../../../assets/images/logo/flexip.svg";

import api from "../../../services/api";

import { API_GUARD } from "../../../services/env";

import styles from './styles.module.css';

// const QontoConnector = withStyles({
//     alternativeLabel: {
//         top: 15,
//         left: 'calc(-50% + 16px)',
//         right: 'calc(50% + 16px)',
//     },
//     active: {
//         '& $line': {
//             borderColor: '#3d3d3d',
//         },
//     },
//     completed: {
//         '& $line': {
//             borderColor: '#28a745',
//         },
//     },
//     line: {
//         borderColor: '#eaeaf0',
//         borderTopWidth: 3,
//         borderRadius: 1,
//     },
// })(StepConnector);


// const useStyles = makeStyles((theme) => ({
//     root: {
//         width: '100%',
//     },
//     button: {
//         marginRight: theme.spacing(1),
//         width: '100%'
//     },
//     instructions: {
//         marginTop: theme.spacing(1),
//         marginBottom: theme.spacing(1),
//     },
//     icon: {
//         position: 'absolute',
//         marginRight: '.5rem',
//         backgroundColor: 'white',
//     },
//     divInputs: {
//         display: 'flex',
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//     }
// }));


// function getSteps() {
//     return ['', '', '', ''];
// }

// const BootstrapInput = withStyles((theme) => ({
//     root: {
//         'label + &': {
//             marginTop: theme.spacing(3),
//         },
//     },
//     input: {
//         borderRadius: 4,
//         position: 'relative',
//         backgroundColor: theme.palette.common.white,
//         border: '1px solid #ced4da',
//         fontSize: 16,
//         width: '100%',
//         padding: '10px 12px',
//         transition: theme.transitions.create(['border-color']),
//         // Use the system font instead of the default Roboto font.
//         fontFamily: [
//             '-apple-system',
//             'BlinkMacSystemFont',
//             '"Segoe UI"',
//             'Roboto',
//             '"Helvetica Neue"',
//             'Arial',
//             'sans-serif',
//             '"Apple Color Emoji"',
//             '"Segoe UI Emoji"',
//             '"Segoe UI Symbol"',
//         ].join(','),
//         '&:focus': {
//             borderColor: '#3d3d3d',
//         },
//     },
// }))(InputBase);

// const theme = createMuiTheme({
//     palette: {
//         secondary: {
//             light: '#3d3d3d',
//             main: '#3d3d3d',
//             // dark: será calculada com base palette.secondary.main,
//             contrastText: '#fff',
//         },
//     },
// });


// function NumberFormatCustom(props) {
//     const { inputRef, onChange, ...other } = props;
//     return (
//         <NumberFormat
//             {...other}
//             getInputRef={inputRef}
//             format="(##) # ####-####"
//             placeholder="Digite o número do celular"
//             onValueChange={(values) => {
//                 onChange({
//                     target: {
//                         name: props.name,
//                         value: values.value,
//                     },
//                 });
//             }}
//             thousandSeparator
//             isNumericString
//         />
//     );
// }

// NumberFormatCustom.propTypes = {
//     inputRef: PropTypes.func.isRequired,
//     name: PropTypes.string.isRequired,
//     onChange: PropTypes.func.isRequired,
// };


// function NumberFormatCustomF(props) {
//     const { inputRef, onChange, ...other } = props;
//     return (
//         <NumberFormat
//             {...other}
//             getInputRef={inputRef}
//             format="(##) ####-####"
//             placeholder="Digite o número do telefone"
//             onValueChange={(values) => {
//                 onChange({
//                     target: {
//                         name: props.name,
//                         value: values.value,
//                     },
//                 });
//             }}
//             thousandSeparator
//             isNumericString
//         />
//     );
// }

// NumberFormatCustomF.propTypes = {
//     inputRef: PropTypes.func.isRequired,
//     name: PropTypes.string.isRequired,
//     onChange: PropTypes.func.isRequired,
// };


// function NumberFormatCPF(props) {
//     const { inputRef, onChange, ...other } = props;
//     return (
//         <NumberFormat
//             {...other}
//             getInputRef={inputRef}
//             format="###.###.###-##"
//             placeholder="Digite seu CPF"
//             onValueChange={(values) => {
//                 onChange({
//                     target: {
//                         name: props.name,
//                         value: values.value,
//                     },
//                 });
//             }}
//             thousandSeparator
//             isNumericString
//         />
//     );
// }

// NumberFormatCPF.propTypes = {
//     inputRef: PropTypes.func.isRequired,
//     name: PropTypes.string.isRequired,
//     onChange: PropTypes.func.isRequired,
// };


// function NumberFormatCNPJ(props) {
//     const { inputRef, onChange, ...other } = props;
//     return (
//         <NumberFormat
//             {...other}
//             getInputRef={inputRef}
//             format="##.###.###/####-##"
//             placeholder="Digite seu CNPJ"
//             onValueChange={(values) => {
//                 onChange({
//                     target: {
//                         name: props.name,
//                         value: values.value,
//                     },
//                 });
//             }}
//             thousandSeparator
//             isNumericString
//         />
//     );
// }

// NumberFormatCNPJ.propTypes = {
//     inputRef: PropTypes.func.isRequired,
//     name: PropTypes.string.isRequired,
//     onChange: PropTypes.func.isRequired,
// };

// export default function Cadastro() {
//     const classes = useStyles();
//     const [activeStep, setActiveStep] = React.useState(0);
//     const [valueRadio, setValueRadio] = React.useState('1');
//     const [mensagem, setMensagem] = React.useState('');
//     const [errorName, setErrorName] = React.useState(false);
//     const [errorEmail, setErrorEmail] = React.useState(false);
//     const [errorTypePessoa, setErrorTypePessoa] = React.useState(false);
//     const [errorCel, setErrorCel] = React.useState(false);
//     const [errorTel, setErrorTel] = React.useState(false);
//     const [errorCPF, setErrorCPF] = React.useState(false);
//     const [errorCNPJ, setErrorCNPJ] = React.useState(false);
//     const [errorSenha, setErrorSenha] = React.useState(false);
//     // const [errorSenhaC, setErrorSenhaC] = React.useState(false);
//     const [errorNomeEmpresa, setErrorNomeEmpresa] = React.useState(false);
//     const [errorNomePABX, setErrorNomePABX] = React.useState(false);
//     const [errorCidade, setErrorCidade] = React.useState(false);
//     const [errorTelefone, setErrorTelefone] = React.useState(false);
//     const [errorNomeRamal, setErrorNomeRamal] = React.useState(false);
//     const [errorQtdRamal, setErrorQtdRamal] = React.useState(false);
//     const [errorNumRamal, setErrorNumRamal] = React.useState(false);
//     const [errorSenhaPABX, setErrorSenhaPABX] = React.useState(false);
//     // const [errorSenhaPABXC, setErrorSenhaPABXC] = React.useState(false);
//     const [verificaCPF, setVerificaCPF] = React.useState(false);
//     const [verificaCNPJ, setVerificaCNPJ] = React.useState(false);
//     const [load, setLoad] = React.useState(false);
//     const [cidades, setCidades] = React.useState([]);
//     const [telefones, setTelefones] = React.useState([]);
//     const steps = getSteps();
//     const history = useHistory();

//     const [values, setValues] = React.useState({
//         password: '',
//         showPassword: false,
//         // passwordC: '',
//         // showPasswordC: false,
//         passwordP: '',
//         showPasswordP: false,
//         // passwordPC: '',
//         // showPasswordPC: false,
//         textmask: '',
//         nomeEmpresa: '',
//         nomePABX: '',
//         name: '',
//         nomeRamal: '',
//         qtdRamal: '',
//         numRamal: '',
//         email: '',
//         cpf: '',
//         cnpj: '',
//         celmask: '',
//     });


//     const [selects, setSelects] = React.useState({
//         typePessoa: '',
//         cidade: '',
//         telefone: '',
//     });


//     const handleRadioChange = (event) => {
//         setValueRadio(event.target.value);
//     };

//     const handleChangeInput = (prop) => (event) => {
//         setValues({ ...values, [prop]: event.target.value });
//     };

//     const handleClickShowPassword = () => {
//         setValues({ ...values, showPassword: !values.showPassword });
//     };

//     // const handleClickShowPasswordC = () => {
//     //   setValues({ ...values, showPasswordC: !values.showPasswordC });
//     // };
//     const handleClickShowPasswordP = () => {
//         setValues({ ...values, showPasswordP: !values.showPasswordP });
//     };

//     // const handleClickShowPasswordPC = () => {
//     //   setValues({ ...values, showPasswordPC: !values.showPasswordPC });
//     // };

//     const handleChange = (prop) => (event) => {
//         getTelefones(event.target.value);
//         setSelects({ ...selects, [prop]: event.target.value });
//     };


//     const handleNext = () => {
//         if (activeStep === 0) {
//             if (values.celmask !== '' || values.textmask !== '') {
//                 if (selects.typePessoa !== '' && values.name !== '' && values.email !== '') {
//                     setMensagem('');
//                     setErrorTypePessoa(false);
//                     setErrorName(false);
//                     setErrorEmail(false);
//                     setErrorCel(false);
//                     setErrorTel(false);
//                     enviaDadosUser();
//                     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//                 } else {
//                     if (values.celmask === '' && valueRadio === '1') {
//                         setErrorCel(true);
//                     }
//                     if (values.textmask === '' && valueRadio === '2') {
//                         setErrorTel(true);
//                     }
//                 }
//             } else {
//                 setMensagem('Por favor, verifique os campos destacados em vermelho!');
//                 if (selects.typePessoa === '') {
//                     setErrorTypePessoa(true);
//                 }
//                 if (values.name === '') {
//                     setErrorName(true);
//                 }
//                 if (values.email === '') {
//                     setErrorEmail(true);
//                 }
//                 if (values.celmask === '' && valueRadio === '1') {
//                     setErrorCel(true);
//                 }
//                 if (values.textmask === '' && valueRadio === '2') {
//                     setErrorTel(true);
//                 }
//             }
//         }
//         if (activeStep === 1) {
//             if (!verificaCPF && !verificaCNPJ) {
//                 if (values.cpf !== '' || values.cnpj !== '') {
//                     getCidade();
//                     setMensagem('');
//                     setErrorCPF(false);
//                     setErrorCNPJ(false);
//                     // if(values.password !=='' && values.passwordC !==''){
//                     if (values.cnpj !== '' && values.nameEmpresa !== '') {
//                         setErrorNomeEmpresa(false);
//                     } else {
//                         setErrorNomeEmpresa(true);
//                     }
//                     if (values.password.length < 8) {
//                         setErrorSenha(true);
//                         setMensagem('A senha precisa ter no mínimo 8 digitos!');
//                     } else {
//                         setMensagem('');
//                         setErrorSenha(false);
//                         setActiveStep((prevActiveStep) => prevActiveStep + 1);
//                     }
//                     // }else{
//                     //   setMensagem('Por favor, verifique os campos destacados em vermelho!');
//                     //   if(values.password===''){
//                     //     setErrorSenha(true);
//                     //   }
//                     //   // if(values.passwordC===''){
//                     //   //   setErrorSenhaC(true);
//                     //   // }
//                     //   if(values.cpf==='' && selects.typePessoa === '1'){
//                     //     setErrorCPF(true);
//                     //   }
//                     //   if(values.cnpj==='' && selects.typePessoa === '2'){
//                     //     setErrorCNPJ(true);
//                     //   }
//                     //   if(values.cnpj==='' && selects.typePessoa === '2' && values.nameEmpresa !==''){
//                     //     setErrorNomeEmpresa(true);
//                     //   }
//                     // }
//                 }
//                 else {
//                     setMensagem('Por favor, verifique os campos destacados em vermelho!');
//                     if (values.password === '') {
//                         setErrorSenha(true);
//                     }
//                     if (verificaCPF) {
//                         setErrorCPF(true);
//                     }
//                     // if(values.passwordC===''){
//                     //   setErrorSenhaC(true);
//                     // }
//                     if (values.cpf === '' && selects.typePessoa === '1') {
//                         setErrorCPF(true);
//                     }
//                     if (values.cnpj === '' && selects.typePessoa === '2') {
//                         setErrorCNPJ(true);
//                     }
//                     if (values.cnpj === '' && selects.typePessoa === '2' && values.nameEmpresa !== '') {
//                         setErrorNomeEmpresa(true);
//                     }
//                 }
//             } else {
//                 if (verificaCPF) {
//                     setMensagem('CPF inválido!');
//                     setErrorCPF(true);
//                 } else {
//                     setMensagem('CNPJ inválido!');
//                     setErrorCNPJ(true);
//                 }
//             }
//         }
//         if (activeStep === 2) {
//             if (values.nomePABX !== '' && selects.cidade !== '' && selects.telefone !== '' && values.qtdRamal !== '') {
//                 setMensagem('');
//                 setErrorNomePABX(false);
//                 setErrorQtdRamal(false);
//                 setErrorTelefone(false);
//                 setErrorCidade(false);
//                 setActiveStep((prevActiveStep) => prevActiveStep + 1);
//             } else {
//                 setMensagem('Por favor, verifique os campos destacados em vermelho!');
//                 if (selects.telefone === '') {
//                     setErrorTelefone(true);
//                 }
//                 if (selects.cidade === '') {
//                     setErrorCidade(true);
//                 }
//                 if (values.nomePABX === '') {
//                     setErrorNomePABX(true);
//                 }
//                 if (values.qtdRamal === '') {
//                     setErrorQtdRamal(true);
//                 }
//             }
//         }
//         if (activeStep === 3) {
//             if (values.passwordP !== '' && values.nomeRamal !== '' && values.numRamal !== '') {
//                 setErrorNomeRamal(false);
//                 setErrorNumRamal(false);
//                 if (values.numRamal.length < 3 || values.numRamal.length > 5) {
//                     setErrorNumRamal(true);
//                     setMensagem('O campo número do ramal precisa ter entre 3 à 5 dígitos.');
//                 } else if (values.numRamal < 99) {
//                     setErrorNumRamal(true);
//                     setMensagem('O número do ramal precisa ser maior que 99.');
//                 }
//                 else if (values.passwordP.length < 8) {
//                     setErrorSenha(true);
//                     setMensagem('A senha precisa ter no mínimo 8 digitos!');
//                 } else {
//                     setMensagem('');
//                     setErrorSenhaPABX(false);
//                     registraUsuario();
//                 }
//             } else {
//                 setMensagem('Por favor, verifique os campos destacados em vermelho!');
//                 if (values.passwordP === '') {
//                     setErrorSenhaPABX(true);
//                 }
//                 // if(values.passwordPC===''){
//                 //   setErrorSenhaPABXC(true);
//                 // }
//                 if (values.nomeRamal === '') {
//                     setErrorNomeRamal(true);
//                 }
//                 if (values.numRamal === '') {
//                     setErrorNumRamal(true);
//                 }
//             }
//         }
//         return true;
//     };

//     const handleBack = () => {
//         setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     };

//     function openLogin() {
//         history.push("/");
//     }

//     function validate(values) {
//         if (!/\S+@\S+\.\S+/.test(values)) {
//             setErrorEmail(true);
//         } else {
//             setErrorEmail(false);
//         }
//     }

//     function TestaCPF(strCPF) {
//         var Soma;
//         var Resto;
//         var i;
//         Soma = 0;
//         if (strCPF === "00000000000") return false;

//         for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
//         Resto = (Soma * 10) % 11;

//         if ((Resto === 10) || (Resto === 11)) Resto = 0;
//         if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

//         Soma = 0;
//         for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
//         Resto = (Soma * 10) % 11;

//         if ((Resto === 10) || (Resto === 11)) Resto = 0;
//         if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
//         return true;
//     }
//     const fverificaCPF = (event) => {
//         var cpf = event.target.value;
//         var cpfsm = cpf.replace(/[^\d]+/g, '');
//         var retorno = TestaCPF(cpfsm);
//         if (retorno === false) {
//             setVerificaCPF(true);
//         } else {
//             setVerificaCPF(false);
//         }
//     }
//     const fverificaCNPJ = (event) => {
//         var cnpjsm = event.target.value;
//         var cnpj = cnpjsm.replace(/[^\d]+/g, '');
//         var i;
//         var valida = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
//         var dig1 = 0;
//         var dig2 = 0;
//         var digito = cnpj.charAt(12) + cnpj.charAt(13);
//         for (i = 0; i < valida.length; i++) {
//             dig1 += (i > 0 ? (cnpj.charAt(i - 1) * valida[i]) : 0);
//             dig2 += cnpj.charAt(i) * valida[i];
//         }
//         dig1 = (((dig1 % 11) < 2) ? 0 : (11 - (dig1 % 11)));
//         dig2 = (((dig2 % 11) < 2) ? 0 : (11 - (dig2 % 11)));
//         if (((dig1 * 10) + dig2) !== parseInt(digito)) {
//             setVerificaCNPJ(true);
//         } else {
//             setVerificaCNPJ(false);
//         }
//     }

//     async function enviaDadosUser() {
//         var phone = '';
//         if (valueRadio === '1') {
//             phone = values.celmask.replace(/[^\d]+/g, '');
//         } else {
//             phone = values.textmask.replace(/[^\d]+/g, '');
//         }
//         try {
//             await api.post(`/v1/${API_GUARD}/auth/save_lead`, {
//                 name: values.name,
//                 email: values.email,
//                 phone: phone
//             });
//         } catch (error) {
//         }
//     }

//     async function registraUsuario() {
//         setLoad(true)
//         var phone = '';
//         var document = '';

//         if (valueRadio === '1') {
//             phone = values.celmask.replace(/[^\d]+/g, '');
//         } else {
//             phone = values.textmask.replace(/[^\d]+/g, '');
//         }

//         if (selects.typePessoa === '1') {
//             document = values.cpf.replace(/[^\d]+/g, '');
//         } else {
//             document = values.cnpj.replace(/[^\d]+/g, '');
//         }
//         await api.post(`/v1/${API_GUARD}/auth/register`, {

//             name: values.name,
//             email: values.email,
//             phone: phone,
//             password: values.password,
//             companyName: values.nomeEmpresa,
//             document: document,
//             pabx: values.nomePABX,
//             telephone_id: selects.telefone,
//             max_branches: values.qtdRamal,
//             branch_name: values.nomeRamal,
//             branch_number: values.numRamal,
//             branch_password: values.passwordP,
//         }).then((response) => {
//             if (response.status && response.status === 200) {
//                 setLoad(false)
//                 setActiveStep((prevActiveStep) => prevActiveStep + 1);
//             }
//         }).catch((error) => {
//             setLoad(false)
//             if (error.response) {
//                 switch (error.response.status) {
//                     case 422:
//                         const { errors } = error.response.data;

//                         for (let key in errors) {
//                             setMensagem(errors[key])
//                         }
//                         break;
//                     case 400:
//                         const { message } = error.response.data;
//                         setMensagem(message)
//                         break;
//                     default:
//                 }
//             }
//         })
//     }

//     async function getCidade() {
//         try {
//             const response = await api.get(`/v1/${API_GUARD}/auth/cities`);
//             setCidades(response.data.cities);
//         } catch (error) {
//         }
//     }

//     async function getTelefones(value) {
//         try {
//             const response = await api.get(`/v1/${API_GUARD}/auth/telephones/city/${value}`);
//             setTelefones(response.data.telephones);
//         } catch (error) {
//         }
//     }

//     return (<></>);
// }

function Register(props) {
    const formRef = useRef(null);
    const [step, setStep] = useState(1);

    // primeiro passo
    const [name, setName] = useState("");
    const [personType, setPersonType] = useState("");
    const [email, setEmail] = useState("");
    const [phoneType, setPhoneType] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const nameId = useRef(_uniqueId(`name-id-`)).current;
    const personTypeId = useRef(_uniqueId(`personType-id-`)).current;
    const emailId = useRef(_uniqueId(`email-id-`)).current;
    const phoneTypeId = useRef(_uniqueId(`phoneType-id-`)).current;
    const phoneNumberId = useRef(_uniqueId(`phoneNumber-id-`)).current;
    
    
    // segundo passo
    const [password, setPassword] = useState("");

    const passwordId = useRef(_uniqueId(`password-id-`)).current;
    
    
	// - pessoa física
    const [CPF, setCPF] = useState("");
    
    const CPFId = useRef(_uniqueId(`CPF-id-`)).current;

    
    // - pessoa jurídica
    const [CNPJ, setCNPJ] = useState("");
    const [companyName, setCompanyName] = useState("");

    const CNPJId = useRef(_uniqueId(`CNPJ-id-`)).current;
    const companyNameId = useRef(_uniqueId(`companyName-id-`)).current;
    
    
    // terceiro passo
    const [PABXName, setPABXName] = useState("");
    const [city, setCity] = useState("");
    const [PABXNumber, setPABXNumber] = useState("");
    const [branchesAmount, setBranchesAmount] = useState("");
    
    const PABXNameId = useRef(_uniqueId(`PABXName-id-`)).current;
    const cityId = useRef(_uniqueId(`city-id-`)).current;
    const PABXNumberId = useRef(_uniqueId(`PABXNumber-id-`)).current;
    const branchesAmountId = useRef(_uniqueId(`branchesAmount-id-`)).current;
    
    
	// quarto passo
    const [branchName, setBranchName] = useState("");
    const [branchNumber, setBranchNumber] = useState("");
    const [branchPassword, setBranchPassword] = useState("");
    
    const branchNameId = useRef(_uniqueId(`branchName-id-`)).current;
    const branchNumberId = useRef(_uniqueId(`branchNumber-id-`)).current;
    const branchPasswordId = useRef(_uniqueId(`branchPassword-id-`)).current;
    

    const [validation, setValidation] = useState({
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
        phoneType: {
            isInvalid: false,
            message: ""
        },
    });

	const stepField = () => {
		let fieldset = (<>


		</>);

		switch (step) {
			default: 
				fieldset = (<>


				</>);
				break;
		}
	}

    return (
        <>
            <main className={styles.main}>
                <div className={`${styles.register} container`}>
                    <h1>Cadastro <span>Passo {step}</span></h1>
                    <form ref={formRef} className={styles.form}>
                        <fieldset>
                            <Input
                                id={nameId}
                                type="text"
                                label="Nome"
                                placeholder="Nome do responsável legal"
                                name="name"
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value);
                                }}
                                validation={validation.name}
                            />
                            <Select
								id={personTypeId}
                                label="Tipo de pessoa"
                                name="personType"
                                value={personType}
                                onChange={(event) => {
                                    setPersonType(event.target.value);
                                }}								
                                validation={validation.name}
							>
                                <option value="fisica">Pessoa Física</option>
                                <option value="juridica">Pessoa Jurídica</option>
                            </Select>
                            <Input
                                id={emailId}
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
                            <Radio
                                id={phoneTypeId}
                                label="Tipo de telefone"
                                name="phoneType"
                                value={phoneType}
                                onChange={(event) => {
                                    setPhoneType(event.target.value);
                                }}
                                validation={validation.phoneType}
                            >
                                <option value="movel">Móvel</option>
                                <option value="fixo">Fixo</option>
                            </Radio>
                        </fieldset>
                        <button
                            onClick={(e) => {
                                e.preventDefault();

                                const formData = new FormData(formRef.current);
                                const formEntries = formData.entries();

                                console.log((Array.from(formEntries)))
                            }}
                        >
                            Cadastrar
                        </button>
                        <button
                            className="transparent"
                            onClick={(e) => {
                                e.preventDefault();

                                props.history.push("/auth");
                            }}
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(UserActions, dispatch);

export default connect(null, mapDispatchToProps)(Register);
