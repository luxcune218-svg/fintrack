import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Movimientos from './pages/Movimientos';
import Graficas from './pages/Graficas';
import Perfil from './pages/Perfil';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="movimientos" element={<Movimientos />} />
        <Route path="graficas" element={<Graficas />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="*" element={<h1>404 · Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
}