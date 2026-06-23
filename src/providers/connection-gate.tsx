'use client';

import { OnboardingView } from '@/modules/onboarding/onboarding.view';
import { useConnection } from '@/hooks/use-connection.hook';

export const ConnectionGate = ({ children }: { children: React.ReactNode }) => {
  const { status, check } = useConnection();
  if (status === 'connected') return <>{children}</>;
  return <OnboardingView status={status} onRetry={check} />;
};
