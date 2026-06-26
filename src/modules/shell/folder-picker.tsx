'use client';

import { useState, useEffect } from 'react';

import { apiBrowse } from '@/core/api/browse.api';

interface FolderPickerProps {
  onSelect: (path: string) => void;
  onClose: () => void;
}

interface Entry {
  name: string;
  path: string;
}

export const FolderPicker = ({ onSelect, onClose }: FolderPickerProps) => {
  const [current, setCurrent] = useState('');
  const [parent, setParent] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const browse = async (path?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiBrowse(path);
      setCurrent(res.current);
      setParent(res.parent);
      setEntries(res.entries);
    } catch {
      setError('Cannot read that folder.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiBrowse();
        if (!active) return;
        setCurrent(res.current);
        setParent(res.parent);
        setEntries(res.entries);
        setLoading(false);
      } catch {
        if (active) {
          setError('Cannot read that folder.');
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="rounded-lg border flex flex-col"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', width: 440, maxHeight: '70vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header: current path */}
        <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--foreground-faint)', fontWeight: 600 }}>SELECT PROJECT FOLDER</p>
          <p className="mt-1 truncate" style={{ fontSize: 12, color: 'var(--foreground-muted)' }}>
            {current || '…'}
          </p>
        </div>

        {/* listing */}
        <div className="flex-1 overflow-auto py-1 min-h-0">
          {/* up */}
          <button
            onClick={() => browse(parent)}
            className="w-full text-left px-4 py-2 transition-colors"
            style={{ color: 'var(--foreground-muted)', fontSize: 13 }}
          >
            ↑ ..
          </button>

          {loading && (
            <p className="px-4 py-2" style={{ color: 'var(--foreground-faint)', fontSize: 12 }}>
              Loading…
            </p>
          )}
          {error && (
            <p className="px-4 py-2" style={{ color: 'var(--negative)', fontSize: 12 }}>
              {error}
            </p>
          )}

          {!loading &&
            entries.map((e) => (
              <button
                key={e.path}
                onClick={() => browse(e.path)}
                className="w-full text-left px-4 py-2 truncate transition-colors flex items-center gap-2"
                style={{ color: 'var(--foreground)', fontSize: 13 }}
              >
                <span style={{ color: 'var(--foreground-faint)' }}>📁</span> {e.name}
              </button>
            ))}
          {!loading && entries.length === 0 && !error && (
            <p className="px-4 py-2" style={{ color: 'var(--foreground-faint)', fontSize: 12 }}>
              No subfolders here.
            </p>
          )}
        </div>

        {/* actions */}
        <div
          className="px-4 py-3 border-t shrink-0 flex items-center justify-between"
          style={{ borderColor: 'var(--border)' }}
        >
          <button
            onClick={onClose}
            style={{ color: 'var(--foreground-muted)', fontSize: 13, background: 'transparent' }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSelect(current);
              onClose();
            }}
            className="px-4 py-2 rounded"
            style={{ background: 'var(--accent)', color: 'var(--background)', fontSize: 13 }}
          >
            Select this folder
          </button>
        </div>
      </div>
    </div>
  );
};
