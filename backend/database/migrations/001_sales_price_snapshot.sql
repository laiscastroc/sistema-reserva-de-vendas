-- formatado para o caso do valor da ave for alterado futuramente
-- retornar o valor atual da ave na venda e não o "antigo", evitando
-- inconsistências no cálculo.

ALTER TABLE sales
  ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS legalization_total NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_price NUMERIC(10, 2);

CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_bird_id ON sales (bird_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales (status);
