-- Run this in your Vercel Postgres / Neon SQL editor to initialize the schema.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- API keys issued to desktop app instances (one per user per device)
CREATE TABLE IF NOT EXISTS api_keys (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT        NOT NULL,
  user_email  TEXT,
  key_hash    TEXT        NOT NULL UNIQUE,   -- SHA-256 of the raw key
  name        TEXT        NOT NULL DEFAULT 'Desktop App',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- Individual layer configs (one row per layer per user)
CREATE TABLE IF NOT EXISTS layers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT        NOT NULL,
  layer_id    TEXT        NOT NULL,          -- local key e.g. "default", "abc123"
  data        JSONB       NOT NULL,          -- full layer JSON
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, layer_id)
);

-- Full interface configs (the entire config.json, with nested layers)
CREATE TABLE IF NOT EXISTS interface_configs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT        NOT NULL,
  name        TEXT        NOT NULL DEFAULT 'Default',
  data        JSONB       NOT NULL,          -- full config.json JSON
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id  ON api_keys (user_id);
CREATE INDEX IF NOT EXISTS idx_layers_user_id     ON layers (user_id);
CREATE INDEX IF NOT EXISTS idx_iconfigs_user_id   ON interface_configs (user_id);
