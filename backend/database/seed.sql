INSERT INTO birds (name, scientific_name, type, price, legalization_price, image_url, stock)
VALUES
  ('Papagaio-verdadeiro', 'Amazona aestiva', 'Papagaio', 1500.00, 300.00, '/papagaio.jpg', 4),
  ('Agapornis', 'Agapornis roseicollis', 'Agapórnis', 420.00, 70.00, '/agapornis.jpg', 10),
  ('Cacatua-de-Crista-Amarela', 'Cacatua galerita', 'Cacatua', 6000.00, 700.00, '/cacatuas-aves.jpg', 2),
  ('Periquito-Australiano', 'Melopsittacus undulatus', 'Periquito', 120.00, 80.00, '/periquito.webp', 15),
  ('Jandaia-Amarela', 'Aratinga jandaya', 'Jandaia', 800.00, 200.00, '/jandaia.jpg', 6),
  ('Calopsita', 'Nymphicus hollandicus', 'Calopsita', 350.00, 90.00, '/calopsita.webp', 8),
ON CONFLICT DO NOTHING;
