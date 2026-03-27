import DataRouletteSessionEvents from '@/app/ui/DataRouletteSessionEvents';

export default function RouletteSessionDetailPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center py-10 md:p-24">
      <DataRouletteSessionEvents sessionId={params.sessionId} />
    </main>
  );
}
