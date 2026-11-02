DROP TABLE IF EXISTS movimientos, cuentas, categorias, usuarios CASCADE;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombres VARCHAR(80) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  documento VARCHAR(20),
  fecha_nacimiento DATE,
  ciudad VARCHAR(60),
  pais VARCHAR(60),
  ocupacion VARCHAR(80),
  ingreso_mensual NUMERIC(12,2),
  meta_ahorro_mensual NUMERIC(12,2),
  moneda VARCHAR(3) DEFAULT 'EUR',
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cuentas (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  banco VARCHAR(60),
  tipo VARCHAR(30),
  numero VARCHAR(30),
  saldo_inicial NUMERIC(12,2) DEFAULT 0
);

CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50),
  tipo VARCHAR(10) CHECK (tipo IN ('ingreso','gasto')),
  color VARCHAR(7)
);

CREATE TABLE movimientos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  cuenta_id INT REFERENCES cuentas(id),
  categoria_id INT REFERENCES categorias(id),
  descripcion VARCHAR(150),
  monto NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  tipo VARCHAR(10) CHECK (tipo IN ('ingreso','gasto')),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE
);
CREATE INDEX idx_mov_fecha ON movimientos(usuario_id, fecha DESC);