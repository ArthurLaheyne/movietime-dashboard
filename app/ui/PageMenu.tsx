'use client';

import Link from 'next/link';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useApiEnv } from '@/app/lib/api-env';

type PageMenuProps = {
  current: 'home' | 'logs' | 'sessions' | 'roulette-sessions' | 'regenerates';
};

const LINKS: Array<{ href: string; label: string; key: PageMenuProps['current'] }> = [
  { href: '/', label: 'Accueil', key: 'home' },
  { href: '/logs', label: 'Logs', key: 'logs' },
  { href: '/sessions', label: 'Sessions', key: 'sessions' },
  { href: '/roulette-sessions', label: 'Roulette Sessions', key: 'roulette-sessions' },
  { href: '/regenerates', label: 'Regenerates', key: 'regenerates' },
];

export default function PageMenu({ current }: PageMenuProps) {
  const { apiEnv, setApiEnv } = useApiEnv();
  const isProd = apiEnv === 'prod';

  const handleToggle = () => {
    setApiEnv(isProd ? 'dev' : 'prod');
  };

  return (
    <div className="mb-6 w-full max-w-5xl">
      <div className="flex w-full items-center justify-between gap-3">
        <nav className="flex flex-wrap items-center justify-start gap-3">
          {LINKS.map((link) => {
            const isActive = link.key === current;
            const classes = isActive
              ? 'rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition'
              : 'rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-300';

            return (
              <Link key={link.href} href={link.href} className={classes}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-full border border-slate-300 bg-white px-3 py-1 shadow-sm">
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: isProd ? 700 : 500,
                color: isProd ? '#0f172a' : '#64748b',
              }}
            >
              PROD
            </Typography>
            <Switch checked={!isProd} onChange={handleToggle} color="default" />
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: apiEnv === 'dev' ? 700 : 500,
                color: apiEnv === 'dev' ? '#0f172a' : '#64748b',
              }}
            >
              DEV
            </Typography>
          </Stack>
        </div>
      </div>
    </div>
  );
}
