import DataRouletteSessions from '@/app/ui/DataRouletteSessions';
import PageMenu from '@/app/ui/PageMenu';

export default function RouletteSessionsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center py-10 md:p-24">
      <PageMenu current="roulette-sessions" />
      <DataRouletteSessions />
    </main>
  );
}

