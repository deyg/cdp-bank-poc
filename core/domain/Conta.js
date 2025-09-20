// Entidade Conta implementada como closure pura (sem classes)
// Atributos: id, saldo (privado via closure)
// Métodos: depositar, sacar, transferirPara, obterSaldo

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

export function criarConta(id, saldoInicial = 0) {
  if (id === undefined || id === null) {
    throw new TypeError('id é obrigatório');
  }
  assertNumero(saldoInicial, 'saldoInicial');
  if (saldoInicial < 0) {
    throw new RangeError('saldoInicial não pode ser negativo');
  }

  let saldo = saldoInicial;

  const depositar = (valor) => {
    assertNumero(valor, 'valor');
    assertPositivo(valor, 'valor');
    saldo += valor;
  };

  const sacar = (valor) => {
    assertNumero(valor, 'valor');
    assertPositivo(valor, 'valor');
    if (valor > saldo) {
      throw new Error('Saldo insuficiente');
    }
    saldo -= valor;
  };

  const transferirPara = (outraConta, valor) => {
    if (!outraConta || typeof outraConta.depositar !== 'function') {
      throw new TypeError('outraConta inválida');
    }
    // Primeiro saca desta conta; se falhar, nada muda
    sacar(valor);
    // Depois deposita na conta de destino
    outraConta.depositar(valor);
  };

  const obterSaldo = () => saldo;

  const conta = {
    get id() {
      return id;
    },
    depositar,
    sacar,
    transferirPara,
    obterSaldo,
  };

  return Object.freeze(conta);
}
