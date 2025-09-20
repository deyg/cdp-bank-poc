import test from 'node:test';
import assert from 'node:assert/strict';
import { criarConta } from '../../core/domain/Conta.js';

test('criarConta: id e saldo inicial padrão 0', () => {
  const conta = criarConta('c1');
  assert.equal(conta.id, 'c1');
  assert.equal(conta.obterSaldo(), 0);
});

test('depositar: aumenta o saldo com valor positivo', () => {
  const conta = criarConta('c1', 10);
  conta.depositar(5);
  assert.equal(conta.obterSaldo(), 15);
});

test('depositar: rejeita zero ou negativo', () => {
  const conta = criarConta('c1', 10);
  assert.throws(() => conta.depositar(0), RangeError);
  assert.throws(() => conta.depositar(-1), RangeError);
});

test('sacar: diminui o saldo quando há fundos', () => {
  const conta = criarConta('c1', 10);
  conta.sacar(3);
  assert.equal(conta.obterSaldo(), 7);
});

test('sacar: lança erro com saldo insuficiente', () => {
  const conta = criarConta('c1', 10);
  assert.throws(() => conta.sacar(11), /Saldo insuficiente/);
});

test('transferirPara: transfere entre contas', () => {
  const origem = criarConta('origem', 10);
  const destino = criarConta('destino', 1);
  origem.transferirPara(destino, 4);
  assert.equal(origem.obterSaldo(), 6);
  assert.equal(destino.obterSaldo(), 5);
});

test('transferirPara: valida outraConta', () => {
  const origem = criarConta('origem', 10);
  assert.throws(() => origem.transferirPara({}, 1), TypeError);
});

test('criarConta: rejeita saldo inicial negativo', () => {
  assert.throws(() => criarConta('c1', -1), RangeError);
});

test('imutabilidade: não permite sobrescrever métodos', () => {
  const conta = criarConta('c1', 0);
  assert.throws(() => {
    // ESM é strict mode; atribuição deve falhar
    // eslint-disable-next-line no-param-reassign
    conta.depositar = () => {};
  }, TypeError);
});

test('validação numérica: aceita apenas números finitos', () => {
  const conta = criarConta('c1', 0);
  assert.throws(() => conta.depositar(NaN), TypeError);
  assert.throws(() => conta.depositar('10'), TypeError);
  assert.throws(() => conta.sacar('1'), TypeError);
});

