-- 001_sales_price_snapshot.sql
--
-- Problema que esta migração resolve:
-- A tabela "sales" original não guardava o valor da venda. O histórico
-- calculava o total na tela usando o preço ATUAL do catálogo, o que é
-- incorreto: se o preço de uma ave mudar no futuro, vendas antigas
-- passariam a mostrar um total errado. Preço de venda é um dado histórico
-- e precisa ser fotografado no momento da transação.

ALTER TABLE sales
  ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS legalization_total NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_price NUMERIC(10, 2);

-- Índices que aceleram os filtros e a ordenação usados pela API
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_bird_id ON sales (bird_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales (status);
