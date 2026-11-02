import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { useApi } from '../hooks/useApi';
import { money, mesCorto } from '../utils';

export default function Graficas() {
  const { data: mensual } = useApi('/api/stats/mensual', { refresh: 10000 });
  const { data: cats } = useApi('/api/stats/categorias', { refresh: 10000 });
  const { data: user } = useApi('/api/usuario');

  if (!mensual || !cats || !user) return <p className="muted">Cargando…</p>;

  return (
    <>
      <div className="page-head"><h1>Gráficas</h1><p className="muted">Ingresos, gastos y ahorro</p></div>

      <div className="grid cols-2">
        <div className="card">
          <h3>Ingresos vs gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mensual}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tickFormatter={mesCorto} /><YAxis />
              <Tooltip formatter={(v) => money(v)} labelFormatter={mesCorto} /><Legend />
              <Bar dataKey="ingresos" fill="#16a34a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="gastos" fill="#dc2626" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Gastos por categoría (3 meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={cats} dataKey="total" nameKey="nombre" innerRadius={65} outerRadius={105} paddingAngle={2}>
                {cats.map((c) => <Cell key={c.nombre} fill={c.color} />)}
              </Pie>
              <Tooltip formatter={(v) => money(v)} /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3>Ahorro vs meta mensual ({money(user.meta_ahorro_mensual)})</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mensual}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tickFormatter={mesCorto} /><YAxis />
              <Tooltip formatter={(v) => money(v)} labelFormatter={mesCorto} />
              <ReferenceLine y={user.meta_ahorro_mensual} stroke="#f59e0b" strokeDasharray="6 4" label="Meta" />
              <Line dataKey="ahorro" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}