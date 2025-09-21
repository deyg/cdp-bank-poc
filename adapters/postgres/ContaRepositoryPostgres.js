import pg from 'pg';
import { ContaRepositoryPort } from '../../ports/ContaRepositoryPort.js';

const { Pool } = pg;

export class ContaRepositoryPostgres extends ContaRepositoryPort {
  constructor(pool) {
    super();
    if (!pool || typeof pool.query !== 'function') {
      throw new TypeError('pool inválido: requer método query');
    }
    this.pool = pool;
  }

  async criarConta(conta) {
    const { id, saldo } = conta ?? {};
    if (id === undefined || id === null) throw new TypeError('id é obrigatório');
    if (typeof saldo !== 'number' || !Number.isFinite(saldo)) throw new TypeError('saldo deve ser número finito');

    const text = 'INSERT INTO contas (id, saldo) VALUES ($1, $2) RETURNING id, saldo';
    const values = [id, saldo];
    const { rows } = await this.pool.query(text, values);
    const row = rows[0];
    return { id: row.id, saldo: Number(row.saldo) };
  }

  async buscarConta(id) {
    if (id === undefined || id === null) throw new TypeError('id é obrigatório');
    const { rows } = await this.pool.query('SELECT id, saldo FROM contas WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return { id: row.id, saldo: Number(row.saldo) };
  }

  async atualizarSaldo(id, novoSaldo) {
    if (id === undefined || id === null) throw new TypeError('id é obrigatório');
    if (typeof novoSaldo !== 'number' || !Number.isFinite(novoSaldo)) throw new TypeError('novoSaldo deve ser número finito');
    const { rows, rowCount } = await this.pool.query(
      'UPDATE contas SET saldo = $2 WHERE id = $1 RETURNING id, saldo',
      [id, novoSaldo],
    );
    if (rowCount === 0) throw new Error('Conta não encontrada');
    const row = rows[0];
    return { id: row.id, saldo: Number(row.saldo) };
  }

  async close() {
    if (typeof this.pool.end === 'function') {
      await this.pool.end();
    }
  }
}

export function createPostgresPoolFromEnv() {
  const {
    PGHOST = 'localhost',
    PGPORT = '5432',
    PGUSER = 'postgres',
    PGPASSWORD = 'postgres',
    PGDATABASE = 'cdp_bank',
    PGSSL = 'false',
  } = process.env;

  return new Pool({
    host: PGHOST,
    port: Number(PGPORT),
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    ssl: /^true$/i.test(PGSSL) ? { rejectUnauthorized: false } : undefined,
  });
}

export function createContaRepositoryPostgresFromEnv() {
  const pool = createPostgresPoolFromEnv();
  return new ContaRepositoryPostgres(pool);
}
