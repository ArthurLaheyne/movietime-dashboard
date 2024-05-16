'use client'; 

import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { formatDateToLocal } from '@/app/lib/utils';
import { Logs } from "@/app/lib/definitions";
import TableContainer from '@mui/material/TableContainer';

export default function DataTable({
  logs,
  isLoading,
}: {
  logs: Logs[];
  isLoading: boolean
}) {

  const columns: GridColDef[] = [
    { 
      field: 'user', 
      headerName: 'User',
      flex: 1,
    },
    { 
      field: 'action', 
      headerName: 'Action',
      flex: 1,
    },
    { 
      field: 'formatteddatetime', 
      headerName: 'Datetime',
      flex: 1,
      valueGetter: (value, row) => formatDateToLocal(row.datetime)
    },
    { 
      field: 'datetime', 
      headerName: 'trueDatetime',
      flex: 1
    },
  ];
  return (
    <TableContainer>
      <DataGrid 
        slots={{
          toolbar: GridToolbar,
        }}
        loading={isLoading}
        rows={logs}
        columns={columns}
        rowHeight={25}
        initialState={{
          columns: {
            columnVisibilityModel: {
              datetime: false,
            },
          },
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
          sorting: {
            sortModel: [{ field: 'datetime', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </TableContainer>
  );
}
