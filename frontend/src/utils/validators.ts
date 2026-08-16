export function isValidCPF(rawCpf: string): boolean {
  const cpf = rawCpf.replace(/\D/g, '')

  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  const calculateDigit = (base: string): number => {
    let sum = 0
    for(let i = 0; i < base.length; i++) {
      sum += Number(base[i]) * (base.length + 1 - i)
    }
    const remainder = (sum * 10) % 11
    return remainder === 10 ? 0 : remainder
  }

  const firstDigit = calculateDigit(cpf.slice(0, 9))
  const secondDigit = calculateDigit(cpf.slice(0, 10))

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10])
}

export function isValidPhone(rawPhone: string): boolean {
  const digits = rawPhone.replace(/\D/g, '')
  return digits.length === 10 || digits.length === 11
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 3 && /^[\p{L}\s'.-]+$/u.test(name.trim())
}
