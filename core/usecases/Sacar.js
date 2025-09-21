import { ContaUseCasePort } from '../../ports/ContaUseCasePort.js';
import { criarConta } from '../domain/Conta.js';

const assertNumero = (n, nome) => {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError(`${nome} deve ser um número finito`);
  }
};

const assertPositivo = (n, nome) => {
  if (n <= 0) {
    throw new RangeError(`${nome} deve ser maior que zero`);
  }
};

export class SacarUseCase extends ContaUseCasePort {
  constructor(repository) {
    super();
    if (!repository || typeof repository.buscarConta !== 'function' || typeof repository.atualizarSaldo !== 'function') {
      throw new TypeError('repository inválido: requer buscarConta e atualizarSaldo');
    }
    this.repository = repository;
  }

  async execute({ idConta, valor }) {
    if (idConta === undefined || idConta === null) {
      throw new TypeError('idConta é obrigatório');
    }
    assertNumero(valor, 'valor');
    assertPositivo(valor, 'valor');

    const encontrado = await this.repository.buscarConta(idConta);
    if (!encontrado) {
      throw new Error('Conta não encontrada');
    }

    const conta = typeof encontrado.sacar === 'function' && typeof encontrado.obterSaldo === 'function'
      ? encontrado
      : criarConta(encontrado.id ?? idConta, encontrado.saldo ?? 0);

    conta.sacar(valor);
    const novoSaldo = conta.obterSaldo();

    await this.repository.atualizarSaldo(idConta, novoSaldo);

    return { id: idConta, saldo: novoSaldo };
  }
}
