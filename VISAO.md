CDP Bank POC — Visao Geral (Arquitetura Hexagonal)

**Visao Geral**
- Banco Digital de exemplo com operacoes de saldo, deposito, saque e transferencia.
- Node.js moderno (ESM) com foco em modularidade e testabilidade.
- Hexagonal (Ports & Adapters): dominio isolado de infraestrutura (HTTP/DB).

**Arquitetura Hexagonal**
- Dominio define portas (interfaces) que expressam necessidades do negocio.
- Adapters implementam as portas para tecnologias especificas (ex.: PostgreSQL, memoria).
- Beneficios: baixo acoplamento, facilidade de troca de adapters, testes simples do dominio.

**Como Rodar a API**
- Requisitos: Node 20.11.1, Docker e Docker Compose.
- Instale dependencias: `npm i`
- Suba o PostgreSQL local: `npm run db:up`
- Inicie a API (Fastify): `npm run dev` (porta padrao `3000`)
- Variaveis de conexao (opcionais): `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGSSL`
- Parar/limpar banco: `npm run db:down`

**Composicao dos Diretorios**
- `core/domain/` — Entidades de dominio (ex.: `Conta.js` como closure pura).
- `core/usecases/` — Casos de uso (`Depositar.js`, `Sacar.js`, `Transferir.js`, `buildUseCases.js`).
- `ports/` — Portas do dominio (`ContaRepositoryPort.js`, `ContaUseCasePort.js`).
- `adapters/postgres/` — Adapter PostgreSQL (`ContaRepositoryPostgres.js`).
- `adapters/memory/` — Adapter em memoria para testes (`ContaRepositoryMemory.js`).
- `tests/` — Testes unitarios e de integracao (Jest).
- `app.js` — Servidor Fastify e injeção dos casos de uso.
- `docker-compose.yml`, `docker/init.sql` — Infra local do PostgreSQL.

**Comando para Testes**
- Executar toda a suite: `npm test`

