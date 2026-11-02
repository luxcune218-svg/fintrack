import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useApi } from '../hooks/useApi';
import { money, fecha, mesCorto } from '../utils';

const REFRESH = 10000;

export default function Dashboard() {
  const { data: r } = useApi('/api/stats/resumen', { refresh: REFRESH });
  const { data: mensual } = useApi('/api/stats/mensual', { refresh: REFRESH });
  const { data: movs } = useApi('/api/movimientos?limit=6', { refresh: REFRESH });

  if (!r || !mensual || !movs) return <p className="muted">Cargando…</p>;

  const cards = [
    { label: 'Saldo total', value: r.saldo, icon: Wallet, color: '#4f46e5' },
    { label: 'Ingresos del mes', value: r.ingresos_mes, icon: TrendingUp, color: '#16a34a' },
    { label: 'Gastos del mes', value: r.gastos_mes, icon: TrendingDown, color: '#dc2626' },
    { label: 'Ahorro del mes', value: r.ahorro_mes, icon: PiggyBank, color: '#0ea5e9' },
  ];

  return (
    <>
      <div className="page-head"><h1>Dashboard</h1><p className="muted">Resumen de tus finanzas en tiempo real</p></div>

      <div className="grid cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div className="card stat" key={label}>
            <div className="icon" style={{ background: color + '1a', color }}><Icon size={22} /></div>
            <div><small>{label}</small><strong>{money(value)}</strong></div>
          </div>
        ))}
      </div>

      <div className="grid cols-2" style={{ marginTop: 20 }}>
        <div className="card">
          <h3>Ahorro mensual</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mensual}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tickFormatter={mesCorto} />
              <YAxis />
              <Tooltip formatter={(v) => money(v)} labelFormatter={mesCorto} />
              <Area dataKey="ahorro" stroke="#4f46e5" strokeWidth={2} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Últimos movimientos</h3>
          <table>
            <tbody>
              {movs.data.map((m) => (
                <tr key={m.id}>
                  <td><strong>{m.descripcion}</strong><br /><small className="muted">{fecha(m.fecha)}</small></td>
                  <td className={m.tipo} style={{ textAlign: 'right', fontWeight: 600 }}>
                    {m.tipo === 'gasto' ? '-' : '+'}{money(m.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}