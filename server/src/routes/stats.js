import { Router } from 'express';
import { pool, USER_ID } from '../db.js';

const r = Router();
const mesActual = `date_trunc('month', fecha) = date_trunc('month', CURRENT_DATE)`;

r.get('/resumen', async (_req, res, next) => {
  try {
    const { rows: [t] } = await pool.query(
      `SELECT
        COALESCE(SUM(monto) FILTER (WHERE tipo='ingreso'),0)::float AS ingresos,
        COALESCE(SUM(monto) FILTER (WHERE tipo='gasto'),0)::float AS gastos,
        COALESCE(SUM(monto) FILTER (WHERE tipo='ingreso' AND ${mesActual}),0)::float AS ingresos_mes,
        COALESCE(SUM(monto) FILTER (WHERE tipo='gasto' AND ${mesActual}),0)::float AS gastos_mes
       FROM movimientos WHERE usuario_id=$1`, [USER_ID]);
    const { rows: [c] } = await pool.query(
      'SELECT COALESCE(SUM(saldo_inicial),0)::float AS s FROM cuentas WHERE usuario_id=$1', [USER_ID]);

    res.json({
      saldo: c.s + t.ingresos - t.gastos,
      ingresos_mes: t.ingresos_mes,
      gastos_mes: t.gastos_mes,
      ahorro_mes: t.ingresos_mes - t.gastos_mes,
    });
  } catch (e) { next(e); }
});

r.get('/mensual', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT to_char(date_trunc('month',fecha),'YYYY-MM') AS mes,
        COALESCE(SUM(monto) FILTER (WHERE tipo='ingreso'),0)::float AS ingresos,
        COALESCE(SUM(monto) FILTER (WHERE tipo='gasto'),0)::float AS gastos
       FROM movimientos WHERE usuario_id=$1 GROUP BY 1 ORDER BY 1`, [USER_ID]);
    res.json(rows.map((m) => ({ ...m, ahorro: Math.round((m.ingresos - m.gastos) * 100) / 100 })));
  } catch (e) { next(e); }
});

r.get('/categorias', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.nombre, c.color, SUM(m.monto)::float AS total
       FROM movimientos m JOIN categorias c ON c.id = m.categoria_id
       WHERE m.usuario_id=$1 AND m.tipo='gasto'
         AND m.fecha >= date_trunc('month', CURRENT_DATE) - INTERVAL '2 months'
       GROUP BY c.nombre, c.color ORDER BY total DESC`, [USER_ID]);
    res.json(rows);
  } catch (e) { next(e); }
});

export default r;