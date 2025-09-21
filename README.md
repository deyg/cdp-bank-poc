CDP Bank POC — Arquitetura Hexagonal (Node ESM)

Visão geral
- Projeto base com Arquitetura Hexagonal (ports/adapters) em Node.js (ESM).
- Domínio: contas com saldo, depósito, saque e transferência.
- Adapters: PostgreSQL (real) e memória (tests).

Pré‑requisitos
- Node 20.11.1
- Docker + Docker Compose

Instalação e execução
- Instalar dependências: `npm i`
- Subir PostgreSQL: `npm run db:up`
- Iniciar API (Fastify): `npm run dev`
- Rodar testes (Jest): `npm test`

Conexão ao Postgres (variáveis)
- `PGHOST=localhost`
- `PGPORT=5432`
- `PGUSER=postgres`
- `PGPASSWORD=postgres`
- `PGDATABASE=cdp_bank`
- `PGSSL=false`

 Criação de conta
 - POST `/contas`
   - Body: `{ "idConta": "c1", "saldoInicial": 100 }` (opcional `saldoInicial`, padrão `0`)
   - 201: `{ "id": "c1", "saldo": 100 }`
   - 400: `{ "message": "<erro>" }`

Endpoints
- POST `/saldo`
  - Body: `{ "idConta": "c1" }`
  - 200: `{ "id": "c1", "saldo": 100 }`
  - 400: `{ "message": "<erro>" }`

- POST `/contas`
  - Body: `{ "idConta": "c1", "saldoInicial": 100 }`
  - 201: `{ "id": "c1", "saldo": 100 }`
  - 400: `{ "message": "<erro>" }`

- POST `/deposito`
  - Body: `{ "idConta": "c1", "valor": 25 }`
  - 200: `{ "id": "c1", "saldo": 125 }`
  - 400: `{ "message": "<erro>" }`

- POST `/saque`
  - Body: `{ "idConta": "c1", "valor": 10 }`
  - 200: `{ "id": "c1", "saldo": 115 }`
  - 400: `{ "message": "<erro>" }`

- POST `/transferencia`
  - Body: `{ "idOrigem": "c1", "idDestino": "c2", "valor": 30 }`
  - 200: `{ "origem": { "id": "c1", "saldo": 85 }, "destino": { "id": "c2", "saldo": 80 } }`
  - 400: `{ "message": "<erro>" }`

Exemplos cURL
- Saldo:
  - `curl -X POST http://localhost:3000/saldo -H "Content-Type: application/json" -d '{"idConta":"c1"}'`
- Criar conta:
  - `curl -X POST http://localhost:3000/contas -H "Content-Type: application/json" -d '{"idConta":"c1","saldoInicial":100}'`
- Depósito:
  - `curl -X POST http://localhost:3000/deposito -H "Content-Type: application/json" -d '{"idConta":"c1","valor":25}'`
- Saque:
  - `curl -X POST http://localhost:3000/saque -H "Content-Type: application/json" -d '{"idConta":"c1","valor":10}'`
- Transferência:
  - `curl -X POST http://localhost:3000/transferencia -H "Content-Type: application/json" -d '{"idOrigem":"c1","idDestino":"c2","valor":30}'`

Estrutura (resumo)
- `core/domain/Conta.js` — entidade como closure.
- `core/usecases/*.js` — casos de uso + `buildUseCases.js`.
- `ports/*.js` — portas de entrada/saída.
- `adapters/postgres/ContaRepositoryPostgres.js` — adapter real (pg Pool).
- `adapters/memory/ContaRepositoryMemory.js` — adapter em memória.
- `app.js` — Fastify com endpoints do domínio.

Docker
- Subir: `npm run db:up`
- Derrubar: `npm run db:down`

Links rápidos
- [VISAO.md](VISAO.md)
- [Procedimento.md](Procedimento.md)

Recursos adicionais
- Guia de visão do projeto: veja `VISAO.md`
- Procedimentos (Docker, Postman, cURL): veja `Procedimento.md`
