/*mascaramento de dados pessoais para o histórico de vendas.*/

function maskDigits(value) {
  if(!value) return null;
  return String(value).replace(/\d/g, "•");
}

/*mantém as 2 primeiras letras do primeiro nome visíveis; mascara o resto.*/
export function maskName(fullName) {
  if(!fullName) return null;

  const parts = String(fullName).trim().split(/\s+/);

  return parts
    .map((part, index) => {
      if (index === 0) {
        const visible = part.slice(0, 2);
        const hidden = "•".repeat(Math.max(part.length - 2, 0));
        return `${visible}${hidden}`;
      }
      return "•".repeat(part.length);
    })
    .join(" ");
}

export function maskCPF(cpf) {
  return maskDigits(cpf);
}

export function maskContact(contact) {
  return maskDigits(contact);
}

//aplica o mascaramento em um registro de venda vindo do banco, 
//retornando um novo objeto seguro para ser exposto pela API pública.
export function maskSaleRecord(sale) {
  return {
    ...sale,
    buyer_name: maskName(sale.buyer_name),
    cpf: maskCPF(sale.cpf),
    contact: maskContact(sale.contact),
  };
}
