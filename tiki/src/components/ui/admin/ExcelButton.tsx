import { Button } from '@mui/material';
import type { UseMutationResult } from '@tanstack/react-query';
import React, { useRef } from 'react';
import * as XLSX from 'xlsx';

interface ExcelButtonProps<T, U> {
  mode: 'export' | 'import';
  data?: T[];
  mutationFn?: UseMutationResult<any, unknown, U, unknown>;
  mapDataForExport?: (data: T[]) => any[];
  fileName?: string;
  sheetName?: string;
  buttonText?: string;
  disabled?: boolean;
  onImportSuccess?: () => void;
}

const ExcelButton = <T, U>({
  mode,
  data = [],
  mutationFn,
  mapDataForExport,
  fileName = 'data',
  sheetName = 'Sheet1',
  buttonText,
  disabled = false,
  onImportSuccess,
}: ExcelButtonProps<T, U>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!data || data.length === 0) return;

    const exportData = mapDataForExport ? mapDataForExport(data) : data;
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!mutationFn) return;

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(fileData, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      json.forEach((row: any) => {
        mutationFn.mutate(row, {
          onSuccess: onImportSuccess,
        });
      });

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Button
        variant='contained'
        color={mode === 'export' ? 'primary' : 'secondary'}
        onClick={mode === 'export' ? handleExport : () => inputRef.current?.click()}
        disabled={disabled || (mode === 'export' && (!data || data.length === 0)) || (mode === 'import' && !mutationFn)}
      >
        {buttonText || (mode === 'export' ? 'Export to Excel' : 'Import from Excel')}
      </Button>
      {mode === 'import' && (
        <input type='file' accept='.xlsx, .xls' ref={inputRef} style={{ display: 'none' }} onChange={handleImport} />
      )}
    </>
  );
};

export default ExcelButton;
