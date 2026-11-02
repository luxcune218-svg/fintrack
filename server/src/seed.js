import fs from 'fs';
import { pool } from './db.js';

const rnd = (a, b) => Math.round((Math.random() * (b - a) + a) * 100) / 100;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

await pool.query(fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));

const { rows: [u] } = await pool.query(
  `INSERT INTO usuarios (nombres, apellidos, email, telefono, documento, fecha_nacimiento,
     ciudad, pais, ocupacion, ingreso_mensual, meta_ahorro_mensual, moneda)
   VALUES ('Andrés','Ramírez Torres','andres.ramirez@correo.com','+34 600 123 456','12345678',
     '1994-05-18','Madrid','España','Ingeniero de software',3200,1200,'EUR') RETURNING id`
);

const cuentas = [];
for (const [banco, tipo, numero, saldo] of [
  ['Banco Nova', 'Ahorros', '**** 4821', 1500],
  ['Banco Digital', 'Corriente', '**** 9033', 400],
]) {
  const { rows: [c] } = await pool.query(
    'INSERT INTO cuentas (usuario_id,banco,tipo,numero,saldo_inicial) VALUES ($1,$2,$3,$4,$5) RETURNING id',
    [u.id, banco, tipo, numero, saldo]
  );
  cuentas.push(c.id);
}

const cats = {};
for (const [n, t, c] of [
  ['Salario', 'ingreso', '#22c55e'], ['Freelance', 'ingreso', '#14b8a6'],
  ['Vivienda', 'gasto', '#6366f1'], ['Alimentación', 'gasto', '#f59e0b'],
  ['Transporte', 'gasto', '#0ea5e9'], ['Servicios', 'gasto', '#8b5cf6'],
  ['Entretenimiento', 'gasto', '#ec4899'], ['Salud', 'gasto', '#ef4444'],
  ['Educación', 'gasto', '#10b981'], ['Compras', 'gasto', '#64748b'],
]) {
  const { rows: [r] } = await pool.query(
    'INSERT INTO categorias (nombre,tipo,color) VALUES ($1,$2,$3) RETURNING id', [n, t, c]);
  cats[n] = r.id;
}

const gastos = {
  Alimentación: [['Supermercado', 40, 140], ['Restaurante', 15, 70]],
  Transporte: [['Gasolina', 30, 70], ['Transporte público', 10, 35]],
  Servicios: [['Electricidad', 35, 90], ['Internet', 30, 45]],
  Entretenimiento: [['Cine', 10, 25], ['Streaming', 9, 16], ['Salida con amigos', 20, 80]],
  Salud: [['Farmacia', 10, 60], ['Consulta médica', 40, 120]],
  Educación: [['Curso online', 20, 90]],
  Compras: [['Ropa', 30, 150], ['Tecnología', 25, 250]],
};

const hoy = new Date();
const mov = (cat, desc, monto, tipo, fecha) =>
  pool.query(
    `INSERT INTO movimientos (usuario_id,cuenta_id,categoria_id,descripcion,monto,tipo,fecha)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [u.id, pick(cuentas), cats[cat], desc, monto, tipo, fecha]
  );

for (let m = 11; m >= 0; m--) {
  const base = new Date(hoy.getFullYear(), hoy.getMonth() - m, 1);
  const maxDia = m === 0 ? hoy.getDate() : 28;
  const dia = (d) => new Date(base.getFullYear(), base.getMonth(), Math.min(d, maxDia));

  await mov('Salario', 'Nómina mensual', 3200, 'ingreso', dia(1));
  await mov('Vivienda', 'Alquiler', 850, 'gasto', dia(3));
  if (Math.random() > 0.5) await mov('Freelance', 'Proyecto freelance', rnd(150, 600), 'ingreso', dia(15));

  for (let i = 0; i < 20; i++) {
    const cat = pick(Object.keys(gastos));
    const [desc, min, max] = pick(gastos[cat]);
    await mov(cat, desc, rnd(min, max), 'gasto', dia(1 + Math.floor(Math.random() * 28)));
  }
}

console.log('✅ Base de datos lista');
await pool.end();