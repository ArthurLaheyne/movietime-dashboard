'use client';

import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import TableContainer from '@mui/material/TableContainer';
import type { RegenerateRunRow } from '@/app/ui/DataRegenerates';
import { formatDateToLocal } from '@/app/lib/utils';

function formatTimestamp(value: unknown) {
  if (value == null) return '-';
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return '-';
  try {
    return formatDateToLocal(String(n));
  } catch {
    return new Date(n).toLocaleString();
  }
}

export default function TableRegenerates({
  rows,
  isLoading,
}: {
  rows: RegenerateRunRow[];
  isLoading: boolean;
}) {
  const columns: GridColDef[] = [
    { field: 'runType', headerName: 'RunType', width: 120 },
    { field: 'triggerSource', headerName: 'Trigger', width: 120 },
    { field: 'status', headerName: 'Status', width: 110 },
    { field: 'statusCode', headerName: 'HTTP', width: 90, type: 'number' },
    { field: 'durationMs', headerName: 'DurationMs', width: 120, type: 'number' },
    { field: 'poolsUpdatedCount', headerName: 'PoolsUpdated', width: 130, type: 'number' },
    { field: 'moviesTotalInjected', headerName: 'MoviesInjected', width: 140, type: 'number' },
    { field: 'poolsEmptyCount', headerName: 'PoolsEmpty', width: 120, type: 'number' },
    { field: 'uploadedCount', headerName: 'Uploaded', width: 110, type: 'number' },
    {
      field: 'createdAt',
      headerName: 'CreatedAt',
      width: 160,
      valueGetter: (_value, row) => formatTimestamp((row as RegenerateRunRow).createdAt),
    },
    {
      field: 'error',
      headerName: 'Error',
      flex: 1,
      minWidth: 220,
      valueGetter: (_value, row) => String((row as RegenerateRunRow).error ?? '-'),
    },
  ];

  return (
    <TableContainer>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        loading={isLoading}
        rows={rows}
        columns={columns}
        rowHeight={36}
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </TableContainer>
  );
}
