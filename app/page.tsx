import DataLogs from "@/app/ui/DataLogs"
import DataSessions from "@/app/ui/DataSessions"
 
export default async function Page() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-10 md:p-24">
      <DataLogs />
      <DataSessions />
    </main>
  );
}
