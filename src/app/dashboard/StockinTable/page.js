'use client'
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, CircularProgress
} from '@mui/material';

const StockInTable = () => {
  const [stockInData, setStockInData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockInData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/inventory/stockin`);
        const data = await response.json();
        setStockInData(data.stockIn);
      } catch (error) {
        console.error('Error fetching stock-in data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockInData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" component="div" sx={{ padding: 2 }}>
        Stock-In Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>MTD</TableCell>
            <TableCell>Container ID</TableCell>
            <TableCell>PO ID</TableCell>
            <TableCell>Item Code</TableCell>
            <TableCell>In Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockInData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.mtd}</TableCell>
              <TableCell>{row.container_id}</TableCell>
              <TableCell>{row.po_id}</TableCell>
              <TableCell>{row.item_code}</TableCell>
              <TableCell>{row.in_qty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockInTable;
