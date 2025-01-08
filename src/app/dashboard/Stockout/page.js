'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { TextField, MenuItem, Button, Typography, Box, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useAuth } from '../../../context/AuthContext';

const Stockout = () => {
  const { user } = useAuth();


  const { handleSubmit, control, register, setValue } = useForm({
    defaultValues: {
      entries: [{ item_code: '', customer_name: '', transfer_id: '', out_qty: 0, email: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entries',
  });

  const [itemCodes, setItemCodes] = useState([]);

  const fetchItemCodes = async () => {
    const response = await fetch(`/api/inventory/getitems`);
    if (!response.ok) {
      throw new Error('Failed to fetch item codes');
    }
    const data = await response.json();
    return data.items.map((item) => item.item_code);
  };

  

  useEffect(() => {
    fetchItemCodes()
      .then(setItemCodes)
      .catch((err) => console.error(err));
  }, []);

  const onSubmit = async (data) => {
    const updatedData = data.entries.map(item => ({
      ...item, 
      email: user.email,
    }));
    try {
      const response = await fetch(`/api/inventory/stockout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({entries:updatedData})
      });
      if (!response.ok) throw new Error('Failed to create stock-out records');
      alert('Stock-out records created successfully!');
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5">Stock Out Form</Typography>

      {fields.map((field, index) => (
        <Box key={field.id} p={1} sx={{ border: '1px solid #ccc', marginBottom: 2 }}>
          <Typography variant="h6">Entry {index + 1}</Typography>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Controller
              name={`entries[${index}].date`}
              control={control}
              defaultValue={new Date().toISOString().split('T')[0]} // Default to current date
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date"
                  type="date"
                  InputProps={{ readOnly: true }} // Read-only field
                  fullWidth
                  margin="normal"
                />
              )}
            />

            <Controller
              name={`entries.${index}.item_code`}
              control={control}
              defaultValue={field.item_code}
              render={({ field }) => (
                <TextField {...field} select label="Item Code" fullWidth margin="normal">
                  {itemCodes.map((code) => (
                    <MenuItem key={code} value={code}>
                      {code}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              label="Customer Name"
              fullWidth
              margin="normal"
              {...register(`entries.${index}.customer_name`, { required: true })}
            />
            <TextField
              label="Transfer ID"
              fullWidth
              margin="normal"
              {...register(`entries.${index}.transfer_id`)}
            />
            <TextField
              label="Out Quantity"
              type="number"
              fullWidth
              margin="normal"
              {...register(`entries.${index}.out_qty`, { required: true })}
            />
          </Box>

          <Button color="error" variant="outlined" onClick={() => remove(index)} sx={{ marginTop: 2 }}>
            Delete Entry
          </Button>
        </Box>
      ))}

      <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
        <Button
          startIcon={<AddCircleOutlineIcon />}
          variant="outlined"
          color="primary"
          onClick={() => append({ item_code: '', customer_name: '', transfer_id: '', out_qty: 0 })}
        >
          Add Another Entry
        </Button>

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Stockout;
