// Porta de saída do domínio para persistência de Contas
// Interface baseada em classe abstrata (métodos lançam se não implementados)

export class ContaRepositoryPort {
  /**
   * Cria/persiste uma nova conta.
   * @param {object} conta - Dados da conta (ex.: { id, saldo }).
   * @returns {Promise<any>} Resultado específico do adapter.
   */
  // eslint-disable-next-line no-unused-vars
  async criarConta(conta) {
    throw new Error('criarConta(conta) não implementado');
  }

  /**
   * Busca uma conta pelo identificador.
   * @param {string|number} id - Identificador da conta.
   * @returns {Promise<object|null>} Dados da conta ou null se não encontrada.
   */
  // eslint-disable-next-line no-unused-vars
  async buscarConta(id) {
    throw new Error('buscarConta(id) não implementado');
  }

  /**
   * Atualiza o saldo da conta.
   * @param {string|number} id - Identificador da conta.
   * @param {number} novoSaldo - Novo saldo a ser persistido.
   * @returns {Promise<any>} Resultado específico do adapter.
   */
  // eslint-disable-next-line no-unused-vars
  async atualizarSaldo(id, novoSaldo) {
    throw new Error('atualizarSaldo(id, novoSaldo) não implementado');
  }
}
