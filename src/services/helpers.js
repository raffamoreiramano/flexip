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

		if (digits.match(/0[1-9]00/)) {
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

// function CPFValidation(strCPF) {
// 	var Soma;
// 	var Resto;
// 	var i;
// 	Soma = 0;
// 	if (strCPF === "00000000000") return false;

// 	for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
// 	Resto = (Soma * 10) % 11;

// 	if ((Resto === 10) || (Resto === 11)) Resto = 0;
// 	if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

// 	Soma = 0;
// 	for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
// 	Resto = (Soma * 10) % 11;

// 	if ((Resto === 10) || (Resto === 11)) Resto = 0;
// 	if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
// 	return true;
// }

export function CPMask(value) {
	const digits = value.replace(/\D/g, "");

	// XXX.XXX.XXX-XX
	if (digits.length <= 11) {
		return digits
			.replace(/(\d{3})(\d+?)$/, "$1.$2")
			.replace(/(\d{3})\.(\d{3})(\d+?)$/, "$1.$2.$3")
			.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4")
			.replace(/(\d{3})\.(\d{3})\.(\d{3})\-(\d{2})(\d+?)$/, "$1.$2.$3-$4");
	}

	// XX.XXX.XXX/0001-XX
	if (digits.length <= 15) {
		return digits
			.replace(/(\d{2})(\d+?)$/, "$1.$2")
			.replace(/(\d{2})\.(\d{3})(\d+?)$/, "$1.$2.$3")
			.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d+?)$/, "$1.$2.$3/$4")
			.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d+?)$/, "$1.$2.$3/$4-$5")
			.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})\-(\d{2})(\d+?)$/, "$1.$2.$3/$4-$5");
	}
}

// const CNPJValidation = (event) => {
// 	var cnpjsm = event.target.value;
// 	var cnpj = cnpjsm.replace(/[^\d]+/g, '');
// 	var i;
// 	var valida = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
// 	var dig1 = 0;
// 	var dig2 = 0;
// 	var digito = cnpj.charAt(12) + cnpj.charAt(13);
// 	for (i = 0; i < valida.length; i++) {
// 		dig1 += (i > 0 ? (cnpj.charAt(i - 1) * valida[i]) : 0);
// 		dig2 += cnpj.charAt(i) * valida[i];
// 	}
// 	dig1 = (((dig1 % 11) < 2) ? 0 : (11 - (dig1 % 11)));
// 	dig2 = (((dig2 % 11) < 2) ? 0 : (11 - (dig2 % 11)));
// 	if (((dig1 * 10) + dig2) !== parseInt(digito)) {
// 		setVerificaCNPJ(true);
// 	} else {
// 		setVerificaCNPJ(false);
// 	}
// }