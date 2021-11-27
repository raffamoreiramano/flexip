import React, { useState, useRef } from "react";
import _uniqueId from 'lodash/uniqueId';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserActions from "../../../store/actions/user";

import Input, { Select, Radio } from "../../../components/Input";
import { 
    CPMask,
    validateEmail,
    validateName,
    validatePassword,
    validatePhone,
    validateCPF,
    validateCNPJ,
} from '../../../services/helpers';

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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const nameId = useRef(_uniqueId(`name-id-`)).current;
    const emailId = useRef(_uniqueId(`email-id-`)).current;
    const passwordId = useRef(_uniqueId(`password-id-`)).current;
    
    
    // segundo passo
    const [phoneNumber, setPhoneNumber] = useState("");
    const [CP, setCP] = useState("");
    const [personType, setPersonType] = useState("");
    const [companyName, setCompanyName] = useState("");
    
    const phoneNumberId = useRef(_uniqueId(`phoneNumber-id-`)).current;
    const CPId = useRef(_uniqueId(`CP-id-`)).current;
    const companyNameId = useRef(_uniqueId(`companyName-id-`)).current;


    // terceiro passo
    const [PABXName, setPABXName] = useState("");
    const [city, setCity] = useState("");
    const [PABXNumber, setPABXNumber] = useState("");
    const [PABXPassword, setPABXPassword] = useState("");
    
    const PABXNameId = useRef(_uniqueId(`PABXName-id-`)).current;
    const cityId = useRef(_uniqueId(`city-id-`)).current;
    const PABXNumberId = useRef(_uniqueId(`PABXNumber-id-`)).current;
    const PABXPasswordId = useRef(_uniqueId(`PABXPassword-id-`)).current;
    
    
    // quarto passo
    const [branchesAmount, setBranchesAmount] = useState("");
    const [branchName, setBranchName] = useState("");
    const [branchNumber, setBranchNumber] = useState("");
    
    const branchesAmountId = useRef(_uniqueId(`branchesAmount-id-`)).current;
    const branchNameId = useRef(_uniqueId(`branchName-id-`)).current;
    const branchNumberId = useRef(_uniqueId(`branchNumber-id-`)).current;

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
        PABXPassword: {
            isInvalid: false,
            message: ""
        },
    };
    const [validation, setValidation] = useState(initialValidation);

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
            // branchesAmount,
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
                 
                if (!validatePassword(PABXPassword)) {
                    newValidation.PABXPassword = {
                        isInvalid: true,
                        message: "Deve ter de 8 a 32 caracteres [a-Z, 0-9, !@#$%&*-_.]!",
                    }
                }
                break;
            // branchesAmount
            // branchName,
            // branchNumber,
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
                break;
            default: veredict = false;
        }

        if (Object.values(newValidation).some(item => item.isInvalid)) {
            veredict = false;
        }

        setValidation(newValidation);
        setIsValidated(true);

        return veredict;
    }

    const handleChange = (callback) => {
        if (isValidated) {
            setIsValidated(false);
            cleanValidation();
        }

        callback.call();
    }

    const cleanValidation = () => setValidation(initialValidation);

    const fieldset = () => {
        let inputs;

        switch (step) {
            case 1:
                // name,
                // email,
                // phoneNumber,
                inputs = (<>
                    <Input
                        id={nameId}
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
                    <Input
                        id={passwordId}
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
                        id={phoneNumberId}
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
                        id={CPId}
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
                            id={companyNameId}
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
                // PABXPassword,
                inputs = (<>
                    <Input
                        id={PABXNameId}
                        type="text"
                        label="PABX"
                        placeholder="Nome do PABX"
                        name="PABXName"
                        value={PABXName}
                        onChange={(event) => handleChange(() => {
                            setPABXName(event.target.value);
                        })}
                        validation={validation.PABXName}
                    />
                    <Select
                        id={cityId}
                        label="Cidade"
                        name="city"
                        placeholder="Cidades disponíveis..."
                        value={city}
                        onChange={(event) => handleChange(() => {
                            setCity(event.target.value);
                        })}
                        validation={validation.city}
                    >
                        <option value="0">São Roque</option>
                        <option value="1">Sorocaba</option>
                        <option value="2">Votorantim</option>
                        <option value="2">Votorantim</option>
                        <option value="2">Votorantim</option>
                    </Select>
                    <Select
                        id={PABXNumberId}
                        label="Telefone"
                        name="PABXNumber"
                        placeholder="Telefones para contratar..."
                        value={PABXNumber}
                        onChange={(event) => handleChange(() => {
                            setPABXNumber(event.target.value);
                        })}
                        validation={validation.PABXNumber}
                    >
                        <option value="0">(11) 4158-1714</option>
                        <option value="1">(11) 4717-1787</option>
                    </Select>
                    <Input
                        id={PABXPasswordId}
                        type="password"
                        label="Senha do PABX"
                        name="PABXPassword"
                        value={PABXPassword}
                        onChange={(event) => handleChange(() => {
                            setPABXPassword(event.target.value);
                        })}
                        validation={validation.PABXPassword}
                    />
                </>);
                break;
            case 4:
                // branchesAmount
                // branchName,
                // branchNumber,
                inputs = (<>
                    <Input
                        id={branchesAmountId}
                        type="number"
                        label="Ramais"
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
                                id={branchNameId}
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
                                id={branchNumberId}
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
                        </>)
                    }
                </>);
                break;
            default:
                inputs = (<>
                    <Input
                        id={nameId}
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
                    <Input
                        id={passwordId}
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

    return (
        <>
            <main className={styles.main}>
                <div className={`${styles.register} container`}>
                    <h1>Cadastro <strong><span>Passo {step}</span></strong></h1>
                    <form ref={formRef} className={styles.form}>
                        <fieldset>
                            {fieldset()}
                            {step <= 1 && <a href="/auth">Já tenho conta!</a>}
                        </fieldset>
                        <div className={styles.actions}>
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
                            <button
                                className={step <= 3 ? "main-color-1" : "main-color-2"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    cleanValidation();

                                    if (validateStep()) {
                                        if (step < 4) {
                                            setStep(step + 1);
                                        } else {
                                            props.history.push("/auth");
                                        }
                                    }                                    
                                }}
                            >
                                {step <= 3 ? "Continuar" : "Cadastrar"}
                            </button>                            
                        </div>                        
                    </form>
                </div>
            </main>
        </>
    );
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(UserActions, dispatch);

export default connect(null, mapDispatchToProps)(Register);
