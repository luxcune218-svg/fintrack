export const money = (n) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

export const fecha = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

export const mesCorto = (ym) => {
  const [y, m] = ym.split('-');
  return new Date(y, m - 1).toLocaleDateString('es-ES', { month: 'short' });
};