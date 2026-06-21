'use client';

import { Sidebar } from '@/modules/shell/sidebar';
import { TopBar } from '@/modules/shell/top-bar';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
