'use client';

import { DataGrid, GridColDef, GridRowParams, GridToolbar } from '@mui/x-data-grid';
import TableContainer from '@mui/material/TableContainer';
import { useRouter } from 'next/navigation';
import { formatDateToLocal } from '@/app/lib/utils';
import type { RouletteSessionRow } from '@/app/ui/DataRouletteSessions';

function formatMsToLocalString(value: unknown) {
  if (value == null) return '-';
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return '-';
  try {
    return formatDateToLocal(String(n));
  } catch {
    return String(n);
  }
}

export default function TableRouletteSessions({
  rows,
  isLoading,
}: {
  rows: RouletteSessionRow[];
  isLoading: boolean;
}) {
  const router = useRouter();

  const columns: GridColDef[] = [
    { field: 'sessionId', headerName: 'SessionId', flex: 1.4, minWidth: 250 },
    { field: 'userId', headerName: 'UserId', flex: 1, minWidth: 180 },
    { field: 'eventsCount', headerName: 'Events', width: 100 },
    { field: 'moviesSwipedCount', headerName: 'Swiped', width: 100 },
    { field: 'moviesLikedCount', headerName: 'Liked', width: 90 },
    { field: 'moviesIgnoredCount', headerName: 'Ignored', width: 95 },
    { field: 'moviesToBeSeenCount', headerName: 'ToBeSeen', width: 110 },
    { field: 'moviesViewedCount', headerName: 'Viewed', width: 95 },
    { field: 'mixId', headerName: 'MixId', flex: 0.8, minWidth: 140 },
    { field: 'durationSec', headerName: 'Duration(s)', width: 115 },
    {
      field: 'startedAt',
      headerName: 'Started At',
      width: 190,
      valueGetter: (_value, row) => formatMsToLocalString((row as any).startedAt),
    },
    {
      field: 'endedAt',
      headerName: 'Ended At',
      width: 190,
      valueGetter: (_value, row) => formatMsToLocalString((row as any).endedAt),
    },
    {
      field: 'lastEventAt',
      headerName: 'Last Event',
      width: 190,
      valueGetter: (_value, row) => formatMsToLocalString((row as any).lastEventAt),
    },
  ];

  const handleRowClick = (params: GridRowParams<RouletteSessionRow>) => {
    const sessionId = params.row?.sessionId;
    if (!sessionId || typeof sessionId !== 'string') return;
    router.push(`/roulette-sessions/${encodeURIComponent(sessionId)}`);
  };

  return (
    <TableContainer>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        loading={isLoading}
        rows={rows}
        columns={columns}
        rowHeight={32}
        disableRowSelectionOnClick
        onRowClick={handleRowClick}
        sx={{
          '& .MuiDataGrid-row': { cursor: 'pointer' },
        }}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </TableContainer>
  );
}
