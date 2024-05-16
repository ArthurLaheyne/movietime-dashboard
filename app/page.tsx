import DataLogs from "@/app/ui/DataLogs"
 
export default async function Page() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-10 md:p-24">
      <DataLogs />
    </main>
  );
}
