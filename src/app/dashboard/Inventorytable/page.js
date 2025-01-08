'use client'
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import axios from 'axios';

const InventoryTable = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/inventory/getitems`);
        const data = await response.json();
        setItems(data.items);
        console.log(data)
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" component="div" sx={{ padding: 2 }}>
        Inventory Table
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Code</TableCell>
            <TableCell>Picture</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Total CTN</TableCell>
            <TableCell>CTN Size</TableCell>
            <TableCell>Total PCS</TableCell>
            <TableCell>Received Qty</TableCell>
            <TableCell>Out Qty</TableCell>
            <TableCell>On Hand Qty</TableCell>
            <TableCell>Reorder Status</TableCell>
            <TableCell>Locations</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.item_code}>
              <TableCell>{item.item_code}</TableCell>
              <TableCell>
                {item.picture ? (
                  <img
                    src={item.picture}
                    alt={item.item_code}
                    style={{ width: 50, height: 50 }}
                  />
                ) : (
                  'No Image'
                )}
              </TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.total_ctn}</TableCell>
              <TableCell>{item.ctn_size}</TableCell>
              <TableCell>{item.total_pcs}</TableCell>
              <TableCell>{item.received_qty}</TableCell>
              <TableCell>{item.out_qty}</TableCell>
              <TableCell>{item.on_hand_qty}</TableCell>
              <TableCell>{item.reorder_status || 'N/A'}</TableCell>
              
              <TableCell>
                {item.locations.length > 0 ? (
                  <ul style={{ paddingLeft: '16px' }}>
                    {item.locations.map((location, index) => (
                      <li key={index}>
                        <strong>{location.location_name}</strong>: {location.row_shelf} ({location.quantity})
                      </li>
                    ))}
                  </ul>
                ) : (
                  'No Locations'
                )}
              </TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;
