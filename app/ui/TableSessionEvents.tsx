'use client';

import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import TableContainer from '@mui/material/TableContainer';
import { formatDateToLocal } from '@/app/lib/utils';

type SessionEventRow = {
  id: string;
  [key: string]: unknown;
};

function prettifyHeader(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (s) => s.toUpperCase());
}

function looksLikeDateField(key: string) {
  const normalized = key.toLowerCase();
  return normalized === 'ts' || normalized.endsWith('ts') || normalized.endsWith('at');
}

function parseUnknownToDate(value: unknown): Date | null {
  if (value == null || value === '') return null;

  // Numbers: assume seconds if it's small, ms if it's large.
  if (typeof value === 'number' && Number.isFinite(value)) {
    const ms = value < 1e12 ? value * 1000 : value;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // Numeric strings: DynamoDB / API often serializes numbers as strings.
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;

    if (/^\d+$/.test(trimmed)) {
      const n = Number(trimmed);
      if (!Number.isFinite(n)) return null;
      const ms = n < 1e12 ? n * 1000 : n;
      const d = new Date(ms);
      return Number.isNaN(d.getTime()) ? null : d;
    }

    const d = new Date(trimmed);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // Fallback: attempt Date constructor on anything else (rare).
  const d = new Date(value as any);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatCellValue(key: string, value: unknown) {
  // For date-like fields, return a Date (or null) so filtering/sorting works reliably.
  if (looksLikeDateField(key)) return parseUnknownToDate(value);

  if (value == null) return '';
  if (typeof value === 'string') return value;
  return String(value);
}

export default function TableSessionEvents({
  rows,
  isLoading,
}: {
  rows: SessionEventRow[];
  isLoading: boolean;
}) {
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row)))).filter((key) => key !== 'id');

  const priority = ['ts', 'name', 'userId', 'sessionId', 'sk', 'pk', 'props'];
  keys.sort((a, b) => {
    const ia = priority.indexOf(a);
    const ib = priority.indexOf(b);
    if (ia !== -1 || ib !== -1) {
      return (ia === -1 ? Number.MAX_SAFE_INTEGER : ia) - (ib === -1 ? Number.MAX_SAFE_INTEGER : ib);
    }
    return a.localeCompare(b);
  });

  const columns: GridColDef[] = keys.map((key) => {
    const isDate = looksLikeDateField(key);

    return {
      field: key,
      headerName: prettifyHeader(key),
      flex: key === 'props' ? 2 : 1,
      minWidth: key === 'props' ? 220 : 140,

      // Explicit typing avoids MUI guessing (and mis-parsing) values during filtering.
      type: isDate ? 'dateTime' : 'string',

      valueGetter: (_value, row) => formatCellValue(key, row[key]),

      // Display a readable date, but keep the underlying value as a Date.
      ...(isDate
        ? {
            valueFormatter: (value) => {
              const d = value instanceof Date ? value : parseUnknownToDate(value);
              if (!d) return '';
              try {
                // Use your shared formatter when it supports Date-like inputs.
                return (formatDateToLocal as any)(d);
              } catch {
                return d.toLocaleString();
              }
            },
          }
        : {}),
    };
  });

  return (
    <TableContainer>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        loading={isLoading}
        rows={rows}
        columns={columns}
        rowHeight={32}
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 50 },
          },
          sorting: {
            sortModel: keys.includes('ts') ? [{ field: 'ts', sort: 'asc' }] : [],
          },
        }}
        pageSizeOptions={[20, 50, 100]}
      />
    </TableContainer>
  );
}
