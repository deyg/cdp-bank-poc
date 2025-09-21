// Porta de entrada do domínio para Casos de Uso
// Interface baseada em classe abstrata (contrato comum: execute(input): output)

export class ContaUseCasePort {
  /**
   * Executa o caso de uso.
   * Implementações podem retornar sincrono ou Promise.
   * @param {any} input - Dados de entrada do caso de uso.
   * @returns {any} output - Resultado do caso de uso (valor ou Promise).
   */
  // eslint-disable-next-line no-unused-vars
  execute(input) {
    throw new Error('execute(input) não implementado');
  }
}
