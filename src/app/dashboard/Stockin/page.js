'use client';
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { TextField, MenuItem, Button, Typography, Box, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const Stockin = () => {
  const { handleSubmit, control, register } = useForm({
    defaultValues: {
      entries: [{ item_code: '', container_id: '', po_id: '', in_qty: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entries',
  });
  const [itemCodes, setItemCodes] = useState([]);

  useEffect(() => {
    fetchItemCodes()
      .then(setItemCodes)
      .catch((err) => console.error(err));
  }, []);

  const fetchItemCodes = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/inventory/getitems`);
    if (!response.ok) {
      throw new Error('Failed to fetch item codes');
    }
    const data = await response.json();
    return data.items?.map((item) => item.item_code);
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/inventory/stockin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send the array of entries
      });
      if (!response.ok) throw new Error('Failed to create stock-in records');
      alert('Stock-in records created successfully!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" gutterBottom>
        Stock In Form
      </Typography>

      {fields.map((field, index) => (
        <Box key={field.id} sx={{ border: '1px solid #ccc', padding: 1, marginBottom: 2 }}>
          
          <Typography variant="h6">Entry {index + 1}</Typography>
          <Box display={'flex'} justifyContent={'space-between'}>
          <Controller
            name={`entries[${index}].mtd`}
            control={control}
            defaultValue={new Date().toISOString().split('T')[0]}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date"
                type="date"
                InputProps={{ readOnly: true }}
                fullWidth
                margin="normal"
              />
            )}
          />
          <TextField
            select
            label="Item Code"
            fullWidth
            margin="normal"
            defaultValue=""
            {...register(`entries[${index}].item_code`, { required: true })}
          >
            {itemCodes.map((code) => (
              <MenuItem key={code} value={code}>
                {code}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Container ID"
            fullWidth
            margin="normal"
            {...register(`entries[${index}].container_id`)}
          />
          <TextField
            label="PO ID"
            fullWidth
            margin="normal"
            {...register(`entries[${index}].po_id`)}
          />
          <TextField
            label="In Quantity"
            type="number"
            fullWidth
            margin="normal"
            {...register(`entries[${index}].in_qty`, { required: true })}
          />
          </Box>
          <Button color="error" onClick={() => remove(index)} sx={{ marginTop: 2 }}>
            Delete Entry
          </Button>
        </Box>
      ))}
<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} p={1}>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        variant="outlined"
        color="primary"
        onClick={() =>
          append({ item_code: '', container_id: '', po_id: '', in_qty: '' })
        }
        
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

export default Stockin;
