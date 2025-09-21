import fastify from 'fastify';
import { createContaRepositoryPostgresFromEnv } from './adapters/postgres/ContaRepositoryPostgres.js';
import { buildUseCases } from './core/usecases/buildUseCases.js';

export async function createApp() {
  const app = fastify({ logger: true });

  // Injeta repositório Postgres e casos de uso
  const repository = createContaRepositoryPostgresFromEnv();
  const usecases = buildUseCases(repository);

  // Rotas
  app.post('/deposito', async (request, reply) => {
    try {
      const { idConta, valor } = request.body ?? {};
      const result = await usecases.deposito.execute({ idConta, valor });
      return reply.code(200).send(result);
    } catch (err) {
      request.log.warn({ err }, 'Erro em /deposito');
      return reply.code(400).send({ message: err?.message ?? 'Bad Request' });
    }
  });

  app.post('/saque', async (request, reply) => {
    try {
      const { idConta, valor } = request.body ?? {};
      const result = await usecases.saque.execute({ idConta, valor });
      return reply.code(200).send(result);
    } catch (err) {
      request.log.warn({ err }, 'Erro em /saque');
      return reply.code(400).send({ message: err?.message ?? 'Bad Request' });
    }
  });

  app.post('/transferencia', async (request, reply) => {
    try {
      const { idOrigem, idDestino, valor } = request.body ?? {};
      const result = await usecases.transferencia.execute({ idOrigem, idDestino, valor });
      return reply.code(200).send(result);
    } catch (err) {
      request.log.warn({ err }, 'Erro em /transferencia');
      return reply.code(400).send({ message: err?.message ?? 'Bad Request' });
    }
  });

  // Encerramento gracioso
  const close = async () => {
    try {
      await repository?.close?.();
      await app.close();
    } catch (e) {
      app.log.error(e, 'Erro ao encerrar');
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGINT', close);
  process.on('SIGTERM', close);

  return app;
}

// Bootstrap quando executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = Number(process.env.PORT || process.env.API_PORT || 3000);
  const HOST = process.env.HOST || '0.0.0.0';
  const app = await createApp();
  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`API ouvindo em http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
