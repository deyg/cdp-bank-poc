import { createApp } from '../../app.js';
import { ContaRepositoryMemory } from '../../adapters/memory/ContaRepositoryMemory.js';

describe('API - Saldo', () => {
  test('POST /saldo retorna saldo', async () => {
    const repo = new ContaRepositoryMemory([{ id: 'c1', saldo: 77 }]);
    const app = await createApp({ repository: repo });

    const res = await app.inject({
      method: 'POST',
      url: '/saldo',
      payload: { idConta: 'c1' },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toEqual({ id: 'c1', saldo: 77 });

    await app.close();
  });

  test('POST /saldo 400 para conta inexistente', async () => {
    const repo = new ContaRepositoryMemory([]);
    const app = await createApp({ repository: repo });

    const res = await app.inject({
      method: 'POST',
      url: '/saldo',
      payload: { idConta: 'naoexiste' },
    });

    expect(res.statusCode).toBe(400);
    const body = res.json();
    expect(body).toEqual({ message: 'Conta não encontrada' });

    await app.close();
  });
});

