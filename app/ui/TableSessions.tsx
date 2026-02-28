'use client';

import { DataGrid, GridColDef, GridToolbar, GridRowParams } from '@mui/x-data-grid';
import TableContainer from '@mui/material/TableContainer';
import { useRouter } from 'next/navigation';
import { formatDateToLocal } from '@/app/lib/utils';
import type { SessionRow } from '@/app/ui/DataSessions';

function safeFormatDate(input: string) {
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return input;
  try {
    return formatDateToLocal(input);
  } catch {
    return input;
  }
}

function formatMsToLocalString(value: unknown) {
  if (value == null) return '-';
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return '-';
  return safeFormatDate(String(n));
}

export default function TableSessions({
  sessions,
  isLoading,
}: {
  sessions: SessionRow[];
  isLoading: boolean;
}) {
  const router = useRouter();

  // Fixed columns: UserId, EventCount, Context, FirstSeen, LastSeen
  // Supports both shapes:
  // - { firstSeen, lastSeen } formatted strings (recommended)
  // - { firstSeenAt, lastSeenAt } timestamps (ms)
  const columns: GridColDef[] = [
    {
      field: 'userId',
      headerName: 'UserId',
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row) => String((row as any).userId ?? 'anonymous'),
    },
    {
      field: 'eventCount',
      headerName: 'EventCount',
      width: 130,
      valueGetter: (_value, row) => {
        const v = (row as any).eventCount;
        const n = typeof v === 'number' ? v : Number(v ?? 0);
        return Number.isFinite(n) ? n : 0;
      },
    },
    {
      field: 'context',
      headerName: 'Context',
      flex: 2,
      minWidth: 260,
      valueGetter: (_value, row) => String((row as any).context ?? '{}'),
    },
    {
      field: 'firstSeen',
      headerName: 'FirstSeen',
      width: 190,
      valueGetter: (_value, row) => {
        const v = (row as any).firstSeen ?? (row as any).firstSeenAt;
        if (typeof v === 'string') return v;
        return formatMsToLocalString(v);
      },
    },
    {
      field: 'lastSeen',
      headerName: 'LastSeen',
      width: 190,
      valueGetter: (_value, row) => {
        const v = (row as any).lastSeen ?? (row as any).lastSeenAt;
        if (typeof v === 'string') return v;
        return formatDateToLocal(v);
      },
    },
  ];

  const handleRowClick = (params: GridRowParams<SessionRow>) => {
    const sessionId = (params.row as any).sessionId;
    if (!sessionId || typeof sessionId !== 'string') return;
    router.push(`/sessions/${encodeURIComponent(sessionId)}`);
  };

  return (
    <TableContainer>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        loading={isLoading}
        rows={sessions}
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
