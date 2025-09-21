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

export class TransferirUseCase extends ContaUseCasePort {
  constructor(repository) {
    super();
    if (!repository || typeof repository.buscarConta !== 'function' || typeof repository.atualizarSaldo !== 'function') {
      throw new TypeError('repository inválido: requer buscarConta e atualizarSaldo');
    }
    this.repository = repository;
  }

  async execute({ idOrigem, idDestino, valor }) {
    if (idOrigem === undefined || idOrigem === null) {
      throw new TypeError('idOrigem é obrigatório');
    }
    if (idDestino === undefined || idDestino === null) {
      throw new TypeError('idDestino é obrigatório');
    }
    assertNumero(valor, 'valor');
    assertPositivo(valor, 'valor');

    const dadosOrigem = await this.repository.buscarConta(idOrigem);
    if (!dadosOrigem) {
      throw new Error('Conta de origem não encontrada');
    }
    const dadosDestino = await this.repository.buscarConta(idDestino);
    if (!dadosDestino) {
      throw new Error('Conta de destino não encontrada');
    }

    const origem = typeof dadosOrigem.transferirPara === 'function' && typeof dadosOrigem.obterSaldo === 'function'
      ? dadosOrigem
      : criarConta(dadosOrigem.id ?? idOrigem, dadosOrigem.saldo ?? 0);

    const destino = typeof dadosDestino.depositar === 'function' && typeof dadosDestino.obterSaldo === 'function'
      ? dadosDestino
      : criarConta(dadosDestino.id ?? idDestino, dadosDestino.saldo ?? 0);

    origem.transferirPara(destino, valor);

    const saldoOrigem = origem.obterSaldo();
    const saldoDestino = destino.obterSaldo();

    await this.repository.atualizarSaldo(idOrigem, saldoOrigem);
    await this.repository.atualizarSaldo(idDestino, saldoDestino);

    return {
      origem: { id: idOrigem, saldo: saldoOrigem },
      destino: { id: idDestino, saldo: saldoDestino },
    };
  }
}
