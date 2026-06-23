'use client';

import { OnboardingView } from '@/modules/onboarding/onboarding.view';
import { useConnection } from '@/providers/connection.provider';

export const ConnectionGate = ({ children }: { children: React.ReactNode }) => {
  const { status, check } = useConnection();
  if (status === 'connected') return <>{children}</>;
  return <OnboardingView status={status} onRetry={check} />;
};
