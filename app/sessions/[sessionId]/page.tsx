import DataSessionEvents from '@/app/ui/DataSessionEvents';

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return (
    <main className="flex min-h-screen flex-col items-center py-10 md:p-24">
      <DataSessionEvents sessionId={sessionId} />
    </main>
  );
}
