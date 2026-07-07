export function isValidCPF(rawCpf) {
  const cpf = String(rawCpf ?? "").replace(/\D/g, "");

  if (cpf.length !== 11) return false;
  //rejeita sequências repetidas (000.000.000-00, etc.)
  if(/^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (base) => {
    let sum = 0;
    for(let i = 0; i < base.length; i++) {
      sum += Number(base[i]) * (base.length + 1 - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calculateDigit(cpf.slice(0, 9));
  const secondDigit = calculateDigit(cpf.slice(0, 10));

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10]);
}
