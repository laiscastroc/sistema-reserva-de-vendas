/*evita ter que escrever try/catch em toda rota assíncrona; qualquer
erro (ou rejeição de promise) lançado dentro do handler é automaticamente
encaminhado para o middleware de erro global.*/

export function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
