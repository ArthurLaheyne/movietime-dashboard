'use client'; 

import { useEffect, useState } from 'react';
import TableLogs from "@/app/ui/TableLogs";
import ChartLogs from "@/app/ui/ChartLogs";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export default function DataTable() {

  const [logs, setLogs] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {

    // (1) define within effect callback scope
    const fetchData = async () => {
      setLoading(true)
      fetch('https://hufyvhlacb.execute-api.us-west-2.amazonaws.com/logs')
        .then((res) => res.json())
        .then((data) => {
          setLogs(data.Items)
          setLoading(false)
        })
      console.log('fetching');
      setLoading(false)
    };
      
    const id = setInterval(() => {
      fetchData(); // <-- (3) invoke in interval callback
    }, 30000);

    fetchData();
  
    return () => clearInterval(id);
  }, [])

  return (
    <>
      <Box sx={{ marginBottom: 3 }}>
        <Paper elevation={3} >
          <ChartLogs logs={logs} />
        </Paper>
      </Box>
      <Box>
        <Paper elevation={3} >
          <TableLogs logs={logs} isLoading={isLoading} />
        </Paper>
      </Box>
    </>
  );
}
