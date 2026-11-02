import { Router } from 'express';
import { pool, USER_ID } from '../db.js';

const r = Router();

// GET /api/movimientos?tipo=gasto&q=super&page=1&limit=12
r.get('/', async (req, res, next) => {
  try {
    const { tipo, q } = req.query;
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;

    const params = [USER_ID];
    let where = 'm.usuario_id = $1';
    if (tipo) { params.push(tipo); where += ` AND m.tipo = $${params.length}`; }
    if (q) { params.push(`%${q}%`); where += ` AND m.descripcion ILIKE $${params.length}`; }

    const total = await pool.query(`SELECT COUNT(*)::int AS n FROM movimientos m WHERE ${where}`, params);

    params.push(limit, (page - 1) * limit);
    const { rows } = await pool.query(
      `SELECT m.id, m.descripcion, m.monto::float AS monto, m.tipo,
              to_char(m.fecha,'YYYY-MM-DD') AS fecha,
              c.nombre AS categoria, c.color, a.banco
       FROM movimientos m
       JOIN categorias c ON c.id = m.categoria_id
       JOIN cuentas a ON a.id = m.cuenta_id
       WHERE ${where}
       ORDER BY m.fecha DESC, m.id DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`, params);

    res.json({ total: total.rows[0].n, data: rows });
  } catch (e) { next(e); }
});

// POST /api/movimientos  { cuenta_id, categoria_id, descripcion, monto, tipo, fecha }
r.post('/', async (req, res, next) => {
  try {
    const { cuenta_id, categoria_id, descripcion, monto, tipo, fecha } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO movimientos (usuario_id,cuenta_id,categoria_id,descripcion,monto,tipo,fecha)
       VALUES ($1,$2,$3,$4,$5,$6,COALESCE($7, CURRENT_DATE)) RETURNING id`,
      [USER_ID, cuenta_id, categoria_id, descripcion, monto, tipo, fecha]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

export default r;