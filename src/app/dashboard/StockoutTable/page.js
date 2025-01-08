'use client'
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, CircularProgress
} from '@mui/material';

const StockOutTable = () => {
  const [stockOutData, setStockOutData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockOutData = async () => {
      try {
        const response = await fetch(`/api/inventory/stockout`);
        const data = await response.json();
        setStockOutData(data.stockOut);
      } catch (error) {
        console.error('Error fetching stock-out data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockOutData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" component="div" sx={{ padding: 2 }}>
        Stock-Out Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Transfer ID</TableCell>
            <TableCell>Item Code</TableCell>
            <TableCell>Out Quantity</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockOutData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.customer_name}</TableCell>
              <TableCell>{row.transfer_id}</TableCell>
              <TableCell>{row.item_code}</TableCell>
              <TableCell>{row.out_qty}</TableCell>
              <TableCell>{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockOutTable;
