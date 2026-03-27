import DataLogs from '@/app/ui/DataLogs';
import PageMenu from '@/app/ui/PageMenu';

export default function LogsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center py-10 md:p-24">
      <PageMenu current="logs" />
      <DataLogs />
    </main>
  );
}
