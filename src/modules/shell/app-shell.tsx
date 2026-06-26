'use client';

import { Sidebar } from '@/modules/shell/sidebar';
import { TopBar } from '@/modules/shell/top-bar';
import { GitSetupModal } from '@/modules/onboarding/git-setup-modal';
import { useMagent } from '@/providers/magent.provider';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { needsGitSetup, confirmGitSetup, cancelGitSetup } = useMagent();

  return (
    <div className="flex h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      {needsGitSetup && <GitSetupModal onConfirm={confirmGitSetup} onClose={cancelGitSetup} />}
    </div>
  );
};
