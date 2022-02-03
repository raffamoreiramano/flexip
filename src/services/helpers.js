export function BRLMask(value, fraction = 10000, digits = 4) {
	let number = 0;

	if (typeof value === 'number') {
		number = value / fraction;
	} else {
		number = parseInt(value?.replace(/\D/g, "")) / fraction;
	}

	return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: digits });
}

export function phoneMask(value) {
	if (value) {
		const digits = value.replace(/\D/g, "");

		if (digits.length <= 7) {
			return digits;
		}

		if (digits.match(/^0[1-9]00/)) {
			return digits
				.replace(/(\d{4})(\d)/, "$1 $2")
				.replace(/(\s\d{3})(\d)/, "$1 $2")
				.replace(/(\s\d{4})(\d+?)$/, "$1")
		}

		if (digits.length <= 9) {
			return digits
				.replace(/(\d{4})(\d)/, "$1-$2")
				.replace(/(\d{4})(-)(\d{5})/, "$1$3")
				.replace(/(\d{5})(\d)/, "$1-$2")
				.replace(/(-\d{4})(\d+?)$/, "$1");
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

export function CPMask(value) {
	const digits = value.replace(/\D/g, "");

	// XXX.XXX.XXX-XX
	if (digits.length <= 11) {
		return digits
			.replace(/(\d{3})(\d+?)$/, "$1.$2")
			.replace(/(\d{3})\.(\d{3})(\d+?)$/, "$1.$2.$3")
			.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4")
			.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})(\d+?)$/, "$1.$2.$3-$4");
	}

	// XX.XXX.XXX/0001-XX
	if (digits.length <= 15) {
		return digits
			.replace(/(\d{2})(\d+?)$/, "$1.$2")
			.replace(/(\d{2})\.(\d{3})(\d+?)$/, "$1.$2.$3")
			.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d+?)$/, "$1.$2.$3/$4")
			.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d+?)$/, "$1.$2.$3/$4-$5")
			.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})-(\d{2})(\d+?)$/, "$1.$2.$3/$4-$5");
	}
}

export function validateName(value, min = 1, max = 64) {
	// Nome do Sujeito
	const regex = /^([A-Z\u00C0-\u00DE][a-zA-Z\u00C0-\u00FF]+\s?[a-zA-Z\u00C0-\u00FF]*\s?)*$/g;

	if (value.length < min || value.length > max) {
		return false;
	}

	if (!value.match(regex)) {
		return false;
	}

	return true;
}

export function validateEmail(value) {
	// e-mail.local_part@domain.com.br
	const characters = '[0-9a-z\u00C0-\u00FF]';
	const punctuation = '[0-9a-z\u00C0-\u00FF+-.]';
	const special = '[!#$%&*+-_.]';
	const regex = new RegExp(
		'^' +
		characters + '+' +
		special + '*' +
		characters + '+@' +
		characters + '+' +
		punctuation + '*' +
		characters + '+$',
		'gi'
	);

	if (!value.match(regex)) {
		return false;
	}

	return true;
}

export function validatePassword(value) {
	// requer entre 8 e 32 caracteres, e permite caracteres alfanuméricos e especiais (!@#$%&*\-_.)
	const regex = /^[\w!@#$%&*\-_.]{8,32}$/gi

	if (!value.match(regex)) {
		return false;
	}

	return true;
}

export function validatePhone(value) {
	const digits = value.replace(/\D/g, "");
	const regex = /(\([0-9]{2}\))/g;

	if (digits.length > 1 && digits.length < 8) {
		return digits.match(/^0/) ? false : true;
	}

	if (digits.length < 10 || digits.length > 11) {
		return false;
	}

	if (!value.match(regex)) {
		return false;
	}

	return digits ? true : false;
}

export function validateCPF(value) {
	let cpf = value.replace(/\D/g, "");

	if (cpf == '') return false;

	if (cpf.length != 11) return false;
	
	let invalidArray = [...Array(10).keys()];

	invalidArray = invalidArray.map((item) => {
		return Array(cpf.length + 1).join(item);
	});

	if (invalidArray.some((item) => item == cpf)) {
		return false;
	}

	let sum = 0;

	for (let i = 0; i < 9; i++) {
		sum += parseInt(cpf.charAt(i)) * (10 - i);
	}

	let remainder = 11 - (sum % 11);

	if (remainder == 10 || remainder == 11)	{
		remainder = 0;
	}

	if (remainder != parseInt(cpf.charAt(9)))	{
		return false;
	}

	sum = 0;

	for (let i = 0; i < 10; i++) {
		sum += parseInt(cpf.charAt(i)) * (11 - i);
	}

	remainder = 11 - (sum % 11);

	if (remainder == 10 || remainder == 11)	{
		remainder = 0;
	}

	if (remainder != parseInt(cpf.charAt(10))) {
		return false;		
	}
	
	return true;
}

export function validateCNPJ(value) {
	let cnpj = value.replace(/\D/g, "");

	if (cnpj == '') return false;

	if (cnpj.length != 14) return false;

	let invalidArray = [...Array(10).keys()];

	invalidArray = invalidArray.map((item) => {
		return Array(cnpj.length + 1).join(item);
	});

	if (invalidArray.some((item) => item == cnpj)) {
		return false;
	}

	let length = cnpj.length - 2
	let number = cnpj.substring(0, length);
	let digits = cnpj.substring(length);
	let sum = 0;
	let position = length - 7;

	for (var i = length; i >= 1; i--) {
		sum += number.charAt(length - i) * position--;

		if (position < 2) {
			position = 9;
		}
	}

	let result = sum % 11 < 2 ? 0 : 11 - sum % 11;

	if (result != digits.charAt(0)) return false;

	length = length + 1;
	number = cnpj.substring(0, length);
	sum = 0;
	position = length - 7;

	for (i = length; i >= 1; i--) {
		sum += number.charAt(length - i) * position--;

		if (position < 2) {
			position = 9;
		}
	}

	result = sum % 11 < 2 ? 0 : 11 - sum % 11;

	if (result != digits.charAt(1))	return false;

	return true;
}

export function fileToBase64(file) {
	return new Promise((resolve, _) => {
		const reader = new FileReader();

		reader.onloadend = () => resolve(reader.result);
		
		reader.readAsDataURL(file);
	});
}

export function secondsToTime(value) {
	let number = 0;

	if (typeof value === 'number') {
		number = value;
	} else {
		number = parseInt(value?.replace(/\D/g, ""));
	}

	const hours = Math.floor(number / 3600);
	const minutes = Math.floor((number - (hours * 3600)) / 60);
	const seconds = number - (hours * 3600) - (minutes * 60);
  
	const timeString =
		hours.toString().padStart(2, '0') + ':' +
		minutes.toString().padStart(2, '0') + ':' +
		seconds.toString().padStart(2, '0');
  
	return timeString;
}

export function roundPercentage(value) {
	let number = isNaN(value) ? 0 : parseFloat(value);

	return Math.round(number * 100) / 100;
}