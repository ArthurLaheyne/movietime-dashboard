import DataRegenerates from '@/app/ui/DataRegenerates';
import PageMenu from '@/app/ui/PageMenu';

export default function RegeneratesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center py-10 md:p-24">
      <PageMenu current="regenerates" />
      <DataRegenerates />
    </main>
  );
}
