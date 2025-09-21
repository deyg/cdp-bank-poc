import { ContaRepositoryMemory } from '../../adapters/memory/ContaRepositoryMemory.js';
import { buildUseCases } from '../../core/usecases/buildUseCases.js';

describe('Casos de Uso com ContaRepositoryMemory', () => {
  test('Depósito → saldo correto', async () => {
    const repo = new ContaRepositoryMemory([{ id: 'c1', saldo: 100 }]);
    const { deposito } = buildUseCases(repo);

    const result = await deposito.execute({ idConta: 'c1', valor: 25 });
    expect(result).toEqual({ id: 'c1', saldo: 125 });

    const persisted = await repo.buscarConta('c1');
    expect(persisted).toEqual({ id: 'c1', saldo: 125 });
  });

  test('Saque → saldo reduzido', async () => {
    const repo = new ContaRepositoryMemory([{ id: 'c1', saldo: 100 }]);
    const { saque } = buildUseCases(repo);

    const result = await saque.execute({ idConta: 'c1', valor: 40 });
    expect(result).toEqual({ id: 'c1', saldo: 60 });

    const persisted = await repo.buscarConta('c1');
    expect(persisted).toEqual({ id: 'c1', saldo: 60 });
  });

  test('Transferência → origem e destino atualizados', async () => {
    const repo = new ContaRepositoryMemory([
      { id: 'o1', saldo: 120 },
      { id: 'd1', saldo: 30 },
    ]);
    const { transferencia } = buildUseCases(repo);

    const result = await transferencia.execute({ idOrigem: 'o1', idDestino: 'd1', valor: 70 });
    expect(result).toEqual({
      origem: { id: 'o1', saldo: 50 },
      destino: { id: 'd1', saldo: 100 },
    });

    const origem = await repo.buscarConta('o1');
    const destino = await repo.buscarConta('d1');
    expect(origem).toEqual({ id: 'o1', saldo: 50 });
    expect(destino).toEqual({ id: 'd1', saldo: 100 });
  });

  test('Depósito → erro quando conta não existe', async () => {
    const repo = new ContaRepositoryMemory([]);
    const { deposito } = buildUseCases(repo);
    await expect(deposito.execute({ idConta: 'inexistente', valor: 10 }))
      .rejects.toThrow('Conta não encontrada');
  });

  test('Saque → erro quando conta não existe', async () => {
    const repo = new ContaRepositoryMemory([]);
    const { saque } = buildUseCases(repo);
    await expect(saque.execute({ idConta: 'inexistente', valor: 10 }))
      .rejects.toThrow('Conta não encontrada');
  });

  test('Transferência → erro quando origem não existe', async () => {
    const repo = new ContaRepositoryMemory([{ id: 'd1', saldo: 10 }]);
    const { transferencia } = buildUseCases(repo);
    await expect(transferencia.execute({ idOrigem: 'o1', idDestino: 'd1', valor: 5 }))
      .rejects.toThrow('Conta de origem não encontrada');
  });

  test('Transferência → erro quando destino não existe', async () => {
    const repo = new ContaRepositoryMemory([{ id: 'o1', saldo: 10 }]);
    const { transferencia } = buildUseCases(repo);
    await expect(transferencia.execute({ idOrigem: 'o1', idDestino: 'd1', valor: 5 }))
      .rejects.toThrow('Conta de destino não encontrada');
  });

  test('Saque → erro por saldo insuficiente (estado inalterado)', async () => {
    const repo = new ContaRepositoryMemory([{ id: 'c1', saldo: 50 }]);
    const { saque } = buildUseCases(repo);
    await expect(saque.execute({ idConta: 'c1', valor: 60 }))
      .rejects.toThrow('Saldo insuficiente');
    const persisted = await repo.buscarConta('c1');
    expect(persisted).toEqual({ id: 'c1', saldo: 50 });
  });

  test('Transferência → erro por saldo insuficiente (sem alterações)', async () => {
    const repo = new ContaRepositoryMemory([
      { id: 'o1', saldo: 40 },
      { id: 'd1', saldo: 10 },
    ]);
    const { transferencia } = buildUseCases(repo);
    await expect(transferencia.execute({ idOrigem: 'o1', idDestino: 'd1', valor: 100 }))
      .rejects.toThrow('Saldo insuficiente');
    const origem = await repo.buscarConta('o1');
    const destino = await repo.buscarConta('d1');
    expect(origem).toEqual({ id: 'o1', saldo: 40 });
    expect(destino).toEqual({ id: 'd1', saldo: 10 });
  });

  // Validações de entrada (não numéricos / negativos / zero)
  test('Depósito → valor inválido (não numérico, NaN, zero, negativo)', async () => {
    const repo = new ContaRepositoryMemory([{ id: 'c1', saldo: 10 }]);
    const { deposito } = buildUseCases(repo);
    await expect(deposito.execute({ idConta: 'c1', valor: '10' })).rejects.toThrow(TypeError);
    await expect(deposito.execute({ idConta: 'c1', valor: NaN })).rejects.toThrow(TypeError);
    await expect(deposito.execute({ idConta: 'c1', valor: 0 })).rejects.toThrow(RangeError);
    await expect(deposito.execute({ idConta: 'c1', valor: -5 })).rejects.toThrow(RangeError);
  });

  test('Saque → valor inválido (não numérico, NaN, zero, negativo)', async () => {
    const repo = new ContaRepositoryMemory([{ id: 'c1', saldo: 10 }]);
    const { saque } = buildUseCases(repo);
    await expect(saque.execute({ idConta: 'c1', valor: '1' })).rejects.toThrow(TypeError);
    await expect(saque.execute({ idConta: 'c1', valor: NaN })).rejects.toThrow(TypeError);
    await expect(saque.execute({ idConta: 'c1', valor: 0 })).rejects.toThrow(RangeError);
    await expect(saque.execute({ idConta: 'c1', valor: -1 })).rejects.toThrow(RangeError);
  });

  test('Transferência → valor inválido (não numérico, NaN, zero, negativo)', async () => {
    const repo = new ContaRepositoryMemory([
      { id: 'o1', saldo: 100 },
      { id: 'd1', saldo: 0 },
    ]);
    const { transferencia } = buildUseCases(repo);
    await expect(transferencia.execute({ idOrigem: 'o1', idDestino: 'd1', valor: '5' }))
      .rejects.toThrow(TypeError);
    await expect(transferencia.execute({ idOrigem: 'o1', idDestino: 'd1', valor: NaN }))
      .rejects.toThrow(TypeError);
    await expect(transferencia.execute({ idOrigem: 'o1', idDestino: 'd1', valor: 0 }))
      .rejects.toThrow(RangeError);
    await expect(transferencia.execute({ idOrigem: 'o1', idDestino: 'd1', valor: -1 }))
      .rejects.toThrow(RangeError);
  });
});
