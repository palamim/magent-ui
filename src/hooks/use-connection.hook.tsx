type ConnectionStatus = 'checking' | 'connected' | 'disconnected';

import { useState, useEffect } from 'react';

const BRAIN_URL = 'http://localhost:7842';

export const useConnection = () => {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [version, setVersion] = useState<string | null>(null);

  const check = async () => {
    setStatus('checking');
    try {
      const res = await fetch(`${BRAIN_URL}/ping`);
      const data = await res.json();
      setVersion(data.version ?? null);
      setStatus('connected');
    } catch {
      setStatus('disconnected');
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${BRAIN_URL}/ping`);
        const data = await res.json();
        if (!active) return;
        setVersion(data.version ?? null);
        setStatus('connected');
      } catch {
        if (active) setStatus('disconnected');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { status, version, check };
};
