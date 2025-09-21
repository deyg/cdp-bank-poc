import { ContaUseCasePort } from '../../ports/ContaUseCasePort.js';
import { criarConta } from '../domain/Conta.js';

const assertNumero = (n, nome) => {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError(`${nome} deve ser um número finito`);
  }
};

export class CriarContaUseCase extends ContaUseCasePort {
  constructor(repository) {
    super();
    if (!repository || typeof repository.buscarConta !== 'function' || typeof repository.criarConta !== 'function') {
      throw new TypeError('repository inválido: requer buscarConta e criarConta');
    }
    this.repository = repository;
  }

  async execute({ idConta, saldoInicial = 0 }) {
    if (idConta === undefined || idConta === null) {
      throw new TypeError('idConta é obrigatório');
    }

    // validação do saldo inicial (pode ser 0)
    assertNumero(saldoInicial, 'saldoInicial');
    if (saldoInicial < 0) {
      throw new RangeError('saldoInicial não pode ser negativo');
    }

    const existente = await this.repository.buscarConta(idConta);
    if (existente) {
      throw new Error('Conta já existe');
    }

    const conta = criarConta(idConta, saldoInicial);
    const saldo = conta.obterSaldo();
    const persisted = await this.repository.criarConta({ id: idConta, saldo });
    return { id: persisted.id ?? idConta, saldo: persisted.saldo ?? saldo };
  }
}

