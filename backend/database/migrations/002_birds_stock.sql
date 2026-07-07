-- 002_birds_stock.sql
--
-- Adiciona controle de estoque ao catálogo. Sem isso, nada impedia registrar
-- infinitas vendas do mesmo pássaro. Novas aves entram com estoque de 5 por
-- padrão — ajuste manualmente pelo painel da Neon conforme o caso real.

ALTER TABLE birds
  ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 5 CHECK (stock >= 0);

CREATE INDEX IF NOT EXISTS idx_birds_type ON birds (type);
