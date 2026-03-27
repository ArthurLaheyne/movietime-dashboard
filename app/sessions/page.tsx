import DataSessions from '@/app/ui/DataSessions';
import PageMenu from '@/app/ui/PageMenu';

export default function SessionsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center py-10 md:p-24">
      <PageMenu current="sessions" />
      <DataSessions />
    </main>
  );
}
