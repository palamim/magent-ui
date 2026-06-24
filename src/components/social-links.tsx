import { ExternalLink } from '@/components/external-link';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

export function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-2 h-12 px-4 shrink-0">
      <p className="text-sm leading-4" style={{ color: 'var(--foreground)', opacity: 1 }}>
        by <ExternalLink href="https://palamim.com/">Palamim</ExternalLink>
      </p>
      <ExternalLink href="https://x.com/leopalamim">
        <FaXTwitter color="var(--foreground)" />
      </ExternalLink>
      <ExternalLink href="https://github.com/palamim">
        <FaGithub color="var(--foreground)" />
      </ExternalLink>
    </div>
  );
}
