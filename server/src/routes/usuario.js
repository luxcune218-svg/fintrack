import { Router } from 'express';
import { pool, USER_ID } from '../db.js';

const r = Router();

r.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT *, ingreso_mensual::float AS ingreso_mensual,
              meta_ahorro_mensual::float AS meta_ahorro_mensual,
              to_char(fecha_nacimiento,'YYYY-MM-DD') AS fecha_nacimiento
       FROM usuarios WHERE id=$1`, [USER_ID]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

export default r;