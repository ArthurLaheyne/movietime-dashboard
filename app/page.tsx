import DataLogs from "@/app/ui/DataLogs"
import Container from '@mui/material/Container';
 
export default async function Page() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Container maxWidth="sm">
        <DataLogs />
      </Container>
    </main>
  );
}
