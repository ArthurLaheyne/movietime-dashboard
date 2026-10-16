import DataRouletteSessionEvents from '@/app/ui/DataRouletteSessionEvents';

export default async function RouletteSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return (
    <main className="flex min-h-screen flex-col items-center py-10 md:p-24">
      <DataRouletteSessionEvents sessionId={sessionId} />
    </main>
  );
}
