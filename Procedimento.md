Procedimento — Docker, Postman e cURL

Resumo
- Suba o PostgreSQL com Docker, instale deps e inicie a API.
- Importe a colecao Postman abaixo para testar rotas.
- Alternativamente, use os comandos cURL prontos.

Requisitos
- Docker e Docker Compose instalados
- Node 20.11.1 (para rodar a API)

1) Subir e derrubar o banco (Docker)
- Subir: `npm run db:up`
- Ver logs (opcional): `docker compose logs -f postgres`
- Derrubar e limpar volumes: `npm run db:down`

2) Iniciar a API
- Instalar dependencias: `npm i`
- Iniciar em modo dev: `npm run dev`
- Porta padrao: `3000` (override com `PORT` ou `API_PORT`)

3) Variaveis de conexao (opcional)
- `PGHOST=localhost`, `PGPORT=5432`
- `PGUSER=postgres`, `PGPASSWORD=postgres`
- `PGDATABASE=cdp_bank`, `PGSSL=false`

4) Preparar dados iniciais
- Você pode criar contas via API ou direto no banco:
  - Via API: `curl -X POST http://localhost:3000/contas -H "Content-Type: application/json" -d '{"idConta":"c1","saldoInicial":100}'`
  - Via SQL: `docker exec -it cdp-bank-postgres psql -U postgres -d cdp_bank -c "INSERT INTO contas (id, saldo) VALUES ('c1', 100) ON CONFLICT (id) DO NOTHING;"`

5) Colecao Postman (import)
- Copie o JSON abaixo para um arquivo local, por exemplo `postman_cdp_bank_collection.json`.
- No Postman: Import > Raw text > cole o JSON > Import.

```
{
  "info": {
    "name": "CDP Bank POC",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Saldo",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "url": { "raw": "{{baseUrl}}/saldo", "host": ["{{baseUrl}}"], "path": ["saldo"] },
        "body": { "mode": "raw", "raw": "{\n  \"idConta\": \"c1\"\n}" }
      }
    },
    {
      "name": "Criar Conta",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "url": { "raw": "{{baseUrl}}/contas", "host": ["{{baseUrl}}"], "path": ["contas"] },
        "body": { "mode": "raw", "raw": "{\n  \"idConta\": \"c1\",\n  \"saldoInicial\": 100\n}" }
      }
    },
    {
      "name": "Deposito",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "url": { "raw": "{{baseUrl}}/deposito", "host": ["{{baseUrl}}"], "path": ["deposito"] },
        "body": { "mode": "raw", "raw": "{\n  \"idConta\": \"c1\",\n  \"valor\": 25\n}" }
      }
    },
    {
      "name": "Saque",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "url": { "raw": "{{baseUrl}}/saque", "host": ["{{baseUrl}}"], "path": ["saque"] },
        "body": { "mode": "raw", "raw": "{\n  \"idConta\": \"c1\",\n  \"valor\": 10\n}" }
      }
    },
    {
      "name": "Transferencia",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "url": { "raw": "{{baseUrl}}/transferencia", "host": ["{{baseUrl}}"], "path": ["transferencia"] },
        "body": { "mode": "raw", "raw": "{\n  \"idOrigem\": \"c1\",\n  \"idDestino\": \"c2\",\n  \"valor\": 30\n}" }
      }
    }
  ],
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:3000" }
  ]
}
```

6) cURL — testes rapidos
- Saldo:
  - `curl -X POST http://localhost:3000/saldo -H "Content-Type: application/json" -d '{"idConta":"c1"}'`
- Criar conta:
  - `curl -X POST http://localhost:3000/contas -H "Content-Type: application/json" -d '{"idConta":"c1","saldoInicial":100}'`
- Deposito:
  - `curl -X POST http://localhost:3000/deposito -H "Content-Type: application/json" -d '{"idConta":"c1","valor":25}'`
- Saque:
  - `curl -X POST http://localhost:3000/saque -H "Content-Type: application/json" -d '{"idConta":"c1","valor":10}'`
- Transferencia:
  - `curl -X POST http://localhost:3000/transferencia -H "Content-Type: application/json" -d '{"idOrigem":"c1","idDestino":"c2","valor":30}'`

Erros e respostas
- Em caso de erro de negocio/validacao, a API responde `400` com `{ "message": "<descricao>" }`.
