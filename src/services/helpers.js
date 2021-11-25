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