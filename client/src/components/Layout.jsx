import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, PieChart, User } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
  { to: '/graficas', label: 'Gráficas', icon: PieChart },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export default function Layout() {
  const { data: user } = useApi('/api/usuario');
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">💸 FinTrack</div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <Icon size={18} /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        {user && (
          <div className="sidebar-user">
            <div className="avatar">{user.nombres[0]}{user.apellidos[0]}</div>
            <div><strong>{user.nombres}</strong><small>{user.email}</small></div>
          </div>
        )}
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  );
}