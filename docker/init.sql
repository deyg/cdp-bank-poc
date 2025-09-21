-- Schema inicial para Banco Digital
CREATE TABLE IF NOT EXISTS contas (
  id TEXT PRIMARY KEY,
  saldo NUMERIC(18,2) NOT NULL DEFAULT 0
);

-- Índice primário já cobre buscas por id

