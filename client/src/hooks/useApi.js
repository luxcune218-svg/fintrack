import { useEffect, useState } from 'react';

export function useApi(url, { refresh = 0 } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(url)
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then((d) => { if (alive) { setData(d); setError(null); } })
        .catch((e) => alive && setError(e.message));

    load();
    const id = refresh ? setInterval(load, refresh) : null;
    return () => { alive = false; if (id) clearInterval(id); };
  }, [url, refresh]);

  return { data, error };
}