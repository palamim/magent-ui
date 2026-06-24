import { ReactNode } from 'react';

export function ExternalLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a href={href} target="_blank" style={{ color: 'var(--link)', fontSize: 'inherit' }}>
      {children}
    </a>
  );
}
