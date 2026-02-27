import DataSessionEvents from '@/app/ui/DataSessionEvents';

export default function SessionDetailPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center py-10 md:p-24">
      <DataSessionEvents sessionId={params.sessionId} />
    </main>
  );
}
