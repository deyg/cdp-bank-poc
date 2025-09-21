import { ContaUseCasePort } from '../../ports/ContaUseCasePort.js';

export class ConsultarSaldoUseCase extends ContaUseCasePort {
  constructor(repository) {
    super();
    if (!repository || typeof repository.buscarConta !== 'function') {
      throw new TypeError('repository inválido: requer buscarConta');
    }
    this.repository = repository;
  }

  async execute({ idConta }) {
    if (idConta === undefined || idConta === null) {
      throw new TypeError('idConta é obrigatório');
    }

    const encontrado = await this.repository.buscarConta(idConta);
    if (!encontrado) {
      throw new Error('Conta não encontrada');
    }
    return { id: encontrado.id ?? idConta, saldo: encontrado.saldo };
  }
}

