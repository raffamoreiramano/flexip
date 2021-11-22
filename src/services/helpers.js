export function convertSecondstoTime(given_seconds) {

  const hours = Math.floor(given_seconds / 3600);
  const minutes = Math.floor((given_seconds - (hours * 3600)) / 60);
  const seconds = given_seconds - (hours * 3600) - (minutes * 60);

  const timeString = hours.toString().padStart(2, '0') + ':' +
    minutes.toString().padStart(2, '0') + ':' +
    seconds.toString().padStart(2, '0');

  return timeString;
}

function formatCelNumber(number) {
  switch (number.length) {
    case 11:
      const only_numbers_and_put_parentheses = number.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
      const numbers_and_parentheses_and_hyphen = only_numbers_and_put_parentheses.replace(/(\d)(\d{4})$/, "$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
      return numbers_and_parentheses_and_hyphen;
    case 9:
      const numbers_and_hyphen = number.replace(/(\d)(\d{4})$/, "$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
      return numbers_and_hyphen;
    default:
      return number;
  }
}

function formatPhoneNumber(number) {
  switch (number.length) {
    case 10:
      const only_numbers_and_put_parentheses = number.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
      const numbers_and_parentheses_and_hyphen = only_numbers_and_put_parentheses.replace(/(\d)(\d{4})$/, "$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
      return numbers_and_parentheses_and_hyphen;
    case 8:
      const numbers_and_hyphen = number.replace(/(\d)(\d{4})$/, "$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
      return numbers_and_hyphen;
    default:
      return number;
  }
}

export function integerToBRLCurrency(integer) {
  return (integer ? (integer / 10000) : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 4 });
}

function stringToNumber(string) {
  const number = parseInt(string.replace(/\D/g, ""));
  return number;
}

// export function phoneMask(string) {
//   if (string) {
//     const only_numbers = stringToNumber(string).toString(); //Remove tudo o que não é dígito e zero a esquerda
//     if (only_numbers.substring(0, 4).match(/0[3,5,8]00/)) {
//       return string;
//     }
//     switch (checkPhoneType(only_numbers)) {
//       case "mobile":
//         return formatCelNumber(only_numbers);
//       case "phone":
//         return formatPhoneNumber(only_numbers);
//       default:
//         return only_numbers;
//     }
//   }

//   function checkPhoneType(number) {
//     if (number.length>10) {
//       return "mobile";
//     } else {
//       return "phone";
//     }
//   }

// }

export function phoneMask(value) {
  if (value) {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 4) {
      return digits;
    }

    if (digits.length <= 9) {
      return digits
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(\d{4})(-)(\d{5})/, "$1$3")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})(\d+?)$/, "$1");
    }

    if (digits.match(/0[3,5,8]00/)) {
      return digits
      .replace(/(\d{4})(\d)/, "$1 $2")
      .replace(/(\s\d{3})(\d)/, "$1 $2")
      .replace(/(\s\d{4})(\d+?)$/, "$1")
    }

    return digits
    .replace(/(^0+)(\d)/, "$2")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\s\d{4})(\d)/, "$1-$2")
    .replace(/(\d{4})(-)(\d{5})/, "$1$3")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})(\d+?)$/, "$1");
  }
}

export function IPMask(value) {
  let digits = value
  .replace(/[^.\d]/g, "")
  .replace(/(\.+)(\.+)/, "$10$2")
  .replace(/(\d{3})(\d+)/, "$1.$2")
  .replace(/(^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3}))\.([.\d]+)$/, "$1")
  .replace(/^((\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3}))(\.+)$/, "$1")

  let slices = digits.split(".").map((item) => {
    if (item.match(/^\d{1,3}$/)) {
      const int = parseInt(item);

      if (int >= 0 && int < 256) {
        return int;
      } else {
        return int - (int - 255)
      }
    }

    return null;
  });

  return slices.join(".");
}