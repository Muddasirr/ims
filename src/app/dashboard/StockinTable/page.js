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
        const response = await fetch(`/api/inventory/stockin`);
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
  console.log(stockInData)

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
            <TableCell>User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockInData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{new Date(row.mtd).toLocaleString('en-GB', { timeZone: 'Asia/Karachi' })}</TableCell>
              
              <TableCell>{row.container_id}</TableCell>
              <TableCell>{row.po_id}</TableCell>
              <TableCell>{row.item_code}</TableCell>
              <TableCell>{row.in_qty}</TableCell>
              <TableCell>{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockInTable;
