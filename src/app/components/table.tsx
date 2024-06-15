"use client"
import React, { useState } from 'react';

const DynamicTable = () => {
  type TableData = {
    rows: number;
    columns: number;
    headers: { [key: string]: string };
    data: { [key: string]: string };
  };

  const [tableData, setTableData] = useState<TableData>({
    rows: 1,
    columns: 1,
    headers: { '0': '' },
    data: { '0-0': '' },
  });

  const addRow = () => {
    const newRow = tableData.rows;
    const newData = { ...tableData.data };
    for (let col = 0; col < tableData.columns; col++) {
      newData[`${newRow}-${col}`] = '';
    }
    setTableData({
      ...tableData,
      rows: tableData.rows + 1,
      data: newData,
    });
  };

  const addColumn = () => {
    const newColumn = tableData.columns;
    const newHeaders = { ...tableData.headers, [`${newColumn}`]: '' }; // Add new header
    const newData = { ...tableData.data };
    for (let row = 0; row < tableData.rows; row++) {
      newData[`${row}-${newColumn}`] = '';
    }
    setTableData({
      ...tableData,
      columns: tableData.columns + 1,
      headers: newHeaders,
      data: newData,
    });
  };

  const updateHeader = (column: number, value: string) => {
    const newHeaders = { ...tableData.headers, [`${column}`]: value };
    setTableData({ ...tableData, headers: newHeaders });
  };

  const updateData = (row: number, column: number, value: string) => {
    const newData = { ...tableData.data, [`${row}-${column}`]: value };
    setTableData({ ...tableData, data: newData });
  };

  const deleteColumn = () => {
    if (tableData.columns > 1) { // Ensure there's at least one column left
      const newColumns = tableData.columns - 1;
      const newHeaders = { ...tableData.headers };
      delete newHeaders[`${newColumns}`]; // Remove the last header

      const newData = { ...tableData.data };
      Object.keys(newData).forEach(key => {
        const [row, col] = key.split('-').map(Number);
        if (col === newColumns) {
          delete newData[key]; // Remove data for the last column
        }
      });

      setTableData({
        ...tableData,
        columns: newColumns,
        headers: newHeaders,
        data: newData,
      });
    }
  };

  const renderTable = () => {
    const headerCells = [];
    for (let col = 0; col < tableData.columns; col++) {
      headerCells.push(
        <th key={`header-${col}`} className='border-2 border-black'>
          <input
            type="text"
            value={tableData.headers[col]}
            onChange={(e) => updateHeader(col, e.target.value)}
            placeholder="Player Name"
          />
        </th>
      );
    }

    const rows = [];
    for (let row = 0; row < tableData.rows; row++) {
      const cells = [];
      for (let col = 0; col < tableData.columns; col++) {
        cells.push(
          <td key={`${row}-${col}`} className='border-2 border-black'>
            <input
            className='w-full'
              type="number"
              value={tableData.data[`${row}-${col}`]}
              onChange={(e) => updateData(row, col, e.target.value)}
            />
          </td>
        );
      }
      rows.push(<tr key={row}>{cells}</tr>);
    }

    // Column sums
    const sums = [];
    for (let col = 0; col < tableData.columns; col++) {
      let sum = 0;
      for (let row = 0; row < tableData.rows; row++) {
        sum += parseFloat(tableData.data[`${row}-${col}`]) || 0;
      }
      sums.push(<td key={`sum-${col}`} className='border-2 border-black'>{sum}</td>);
    }

    return (
      <>
        <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{headerCells}</tr>
          </thead>
          <tbody>
            {rows}
            <tr>{sums}</tr>
          </tbody>
        </table>
        <div className='flex gap-2 mt-2'>

        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={addRow}>+ Row</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={addColumn}>+ Player</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"  onClick={deleteColumn}>- Player</button>
        </div>
      </>
    );
  };

  return <div className='px-2 pt-2'>{renderTable()}</div>;
};

export default DynamicTable;
