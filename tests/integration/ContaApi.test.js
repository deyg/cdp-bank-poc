import { createApp } from '../../app.js';
import { ContaRepositoryMemory } from '../../adapters/memory/ContaRepositoryMemory.js';

describe('API - Criar Conta', () => {
  test('POST /contas cria conta', async () => {
    const repo = new ContaRepositoryMemory([]);
    const app = await createApp({ repository: repo });

    const res = await app.inject({
      method: 'POST',
      url: '/contas',
      payload: { idConta: 'api1', saldoInicial: 25 },
    });

    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    const body = res.json();
    expect(body).toEqual({ id: 'api1', saldo: 25 });

    await app.close();
  });

  test('POST /contas falha ao criar duplicada', async () => {
    const repo = new ContaRepositoryMemory([{ id: 'dup', saldo: 10 }]);
    const app = await createApp({ repository: repo });

    const res = await app.inject({
      method: 'POST',
      url: '/contas',
      payload: { idConta: 'dup', saldoInicial: 5 },
    });

    expect(res.statusCode).toBe(400);
    const body = res.json();
    expect(body).toEqual({ message: 'Conta já existe' });

    await app.close();
  });
});

