import { ContaRepositoryPort } from '../../ports/ContaRepositoryPort.js';

const assertNumero = (n, nome) => {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError(`${nome} deve ser um número finito`);
  }
};

export class ContaRepositoryMemory extends ContaRepositoryPort {
  constructor(initial = []) {
    super();
    this._map = new Map();
    if (Array.isArray(initial)) {
      for (const c of initial) {
        if (!c || c.id === undefined || c.id === null) continue;
        assertNumero(c.saldo ?? 0, 'saldo');
        this._map.set(c.id, { id: c.id, saldo: c.saldo ?? 0 });
      }
    }
  }

  async criarConta(conta) {
    const { id, saldo } = conta ?? {};
    if (id === undefined || id === null) throw new TypeError('id é obrigatório');
    assertNumero(saldo, 'saldo');
    if (this._map.has(id)) throw new Error('Conta já existe');
    this._map.set(id, { id, saldo });
    return { id, saldo };
  }

  async buscarConta(id) {
    if (id === undefined || id === null) throw new TypeError('id é obrigatório');
    const found = this._map.get(id);
    return found ? { id: found.id, saldo: found.saldo } : null;
  }

  async atualizarSaldo(id, novoSaldo) {
    if (id === undefined || id === null) throw new TypeError('id é obrigatório');
    assertNumero(novoSaldo, 'novoSaldo');
    const found = this._map.get(id);
    if (!found) throw new Error('Conta não encontrada');
    found.saldo = novoSaldo;
    this._map.set(id, found);
    return { id: found.id, saldo: found.saldo };
  }

  // Auxiliar para testes
  clear() {
    this._map.clear();
  }
}
