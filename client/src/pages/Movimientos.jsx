import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { money, fecha } from '../utils';

const LIMIT = 12;

export default function Movimientos() {
  const [tipo, setTipo] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const qs = new URLSearchParams({ limit: LIMIT, page, ...(tipo && { tipo }), ...(q && { q }) });
  const { data } = useApi(`/api/movimientos?${qs}`, { refresh: 10000 });
  const pages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1;

  return (
    <>
      <div className="page-head"><h1>Movimientos</h1><p className="muted">Historial de tus transacciones</p></div>

      <div className="filters">
        <input placeholder="Buscar descripción…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <select value={tipo} onChange={(e) => { setTipo(e.target.value); setPage(1); }}>
          <option value="">Todos</option>
          <option value="ingreso">Ingresos</option>
          <option value="gasto">Gastos</option>
        </select>
      </div>

      <div className="card">
        {!data ? <p className="muted">Cargando…</p> : (
          <>
            <table>
              <thead><tr><th>Fecha</th><th>Descripción</th><th>Categoría</th><th>Cuenta</th><th style={{ textAlign: 'right' }}>Monto</th></tr></thead>
              <tbody>
                {data.data.map((m) => (
                  <tr key={m.id}>
                    <td>{fecha(m.fecha)}</td>
                    <td>{m.descripcion}</td>
                    <td><span className="badge" style={{ background: m.color + '22', color: m.color }}>{m.categoria}</span></td>
                    <td className="muted">{m.banco}</td>
                    <td className={m.tipo} style={{ textAlign: 'right', fontWeight: 600 }}>
                      {m.tipo === 'gasto' ? '-' : '+'}{money(m.monto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pager">
              <span className="muted">{data.total} movimientos</span>
              <div>
                <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Anterior</button>
                <span style={{ margin: '0 12px' }}>{page} / {pages}</span>
                <button className="btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>Siguiente →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}