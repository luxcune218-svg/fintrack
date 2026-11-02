import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import usuario from './routes/usuario.js';
import movimientos from './routes/movimientos.js';
import stats from './routes/stats.js';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/usuario', usuario);
app.use('/api/movimientos', movimientos);
app.use('/api/stats', stats);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

app.listen(process.env.PORT, () => console.log(`API en http://localhost:${process.env.PORT}`));