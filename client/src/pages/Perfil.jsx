import { useApi } from '../hooks/useApi';
import { money, fecha } from '../utils';

export default function Perfil() {
  const { data: u } = useApi('/api/usuario');
  if (!u) return <p className="muted">Cargando…</p>;

  const campos = [
    ['Nombres', u.nombres], ['Apellidos', u.apellidos], ['Email', u.email],
    ['Teléfono', u.telefono], ['Documento', u.documento],
    ['Nacimiento', fecha(u.fecha_nacimiento)], ['Ciudad', u.ciudad], ['País', u.pais],
    ['Ocupación', u.ocupacion], ['Ingreso mensual', money(u.ingreso_mensual)],
    ['Meta de ahorro', money(u.meta_ahorro_mensual)], ['Moneda', u.moneda],
  ];

  return (
    <>
      <div className="page-head"><h1>Mi perfil</h1><p className="muted">Información de tu cuenta</p></div>
      <div className="card">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
          <div className="avatar" style={{ width: 64, height: 64, fontSize: '1.4rem' }}>{u.nombres[0]}{u.apellidos[0]}</div>
          <div><h2>{u.nombres} {u.apellidos}</h2><p className="muted">{u.ocupacion}</p></div>
        </div>
        <div className="profile">
          {campos.map(([k, v]) => <div key={k}><label>{k}</label><p>{v}</p></div>)}
        </div>
      </div>
    </>
  );
}