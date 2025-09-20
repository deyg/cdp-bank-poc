import { criarConta } from '../../core/domain/Conta.js';

describe('Conta', () => {
  test('criarConta: id e saldo inicial padrão 0', () => {
    const conta = criarConta('c1');
    expect(conta.id).toBe('c1');
    expect(conta.obterSaldo()).toBe(0);
  });

  test('depositar: aumenta o saldo com valor positivo', () => {
    const conta = criarConta('c1', 10);
    conta.depositar(5);
    expect(conta.obterSaldo()).toBe(15);
  });

  test('depositar: rejeita zero ou negativo', () => {
    const conta = criarConta('c1', 10);
    expect(() => conta.depositar(0)).toThrow(RangeError);
    expect(() => conta.depositar(-1)).toThrow(RangeError);
  });

  test('sacar: diminui o saldo quando há fundos', () => {
    const conta = criarConta('c1', 10);
    conta.sacar(3);
    expect(conta.obterSaldo()).toBe(7);
  });

  test('sacar: lança erro com saldo insuficiente', () => {
    const conta = criarConta('c1', 10);
    expect(() => conta.sacar(11)).toThrow(/Saldo insuficiente/);
  });

  test('transferirPara: transfere entre contas', () => {
    const origem = criarConta('origem', 10);
    const destino = criarConta('destino', 1);
    origem.transferirPara(destino, 4);
    expect(origem.obterSaldo()).toBe(6);
    expect(destino.obterSaldo()).toBe(5);
  });

  test('transferirPara: valida outraConta', () => {
    const origem = criarConta('origem', 10);
    expect(() => origem.transferirPara({}, 1)).toThrow(TypeError);
  });

  test('criarConta: rejeita saldo inicial negativo', () => {
    expect(() => criarConta('c1', -1)).toThrow(RangeError);
  });

  test('imutabilidade: não permite sobrescrever métodos', () => {
    const conta = criarConta('c1', 0);
    expect(() => {
      // ESM é strict mode; atribuição deve falhar
      // eslint-disable-next-line no-param-reassign
      conta.depositar = () => {};
    }).toThrow(TypeError);
  });

  test('validação numérica: aceita apenas números finitos', () => {
    const conta = criarConta('c1', 0);
    expect(() => conta.depositar(NaN)).toThrow(TypeError);
    expect(() => conta.depositar('10')).toThrow(TypeError);
    expect(() => conta.sacar('1')).toThrow(TypeError);
  });
});
