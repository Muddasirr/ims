'use client'
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { TextField, Button, Grid, Paper, Typography, IconButton } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';

const Inventory = () => {
  const { register, handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      item_code: '',
      description: '',
      total_ctn: 0,
      ctn_size: 0,
      received_qty: 0,
      out_qty: 0,
      picture: null,
      locations: [
        {
          location_name: '',
          row_shelf: '',
          quantity: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'locations',
  });

  const [base64Image, setBase64Image] = useState('');

 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
   
    const formData = { ...data, picture: base64Image };

    try {
      const response = await fetch(`/api/inventory/createitem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        reset();
        setBase64Image('');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error('Failed to submit form:', err);
      alert('Failed to submit the form.');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Insert Item
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Item Code"
              fullWidth
              {...register('item_code', { required: 'Item Code is required' })}
            />
          </Grid>

        
          <Grid item xs={12} md={6}>
            <TextField
              label="Description"
              fullWidth
              {...register('description', { required: 'Description is required' })}
            />
          </Grid>

          
          <Grid item xs={12} md={4}>
            <TextField
              label="Total CTN"
              type="number"
              fullWidth
              {...register('total_ctn')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="CTN Size"
              type="number"
              fullWidth
              {...register('ctn_size')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Received Quantity"
              type="number"
              fullWidth
              {...register('received_qty')}
            />
          </Grid>

       
          <Grid item xs={12} md={6}>
            <TextField
              label="Out Quantity"
              type="number"
              fullWidth
              {...register('out_qty')}
            />
          </Grid>

       
          <Grid item xs={12} md={6}>
            <Button variant="contained" component="label" fullWidth>
              Upload Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {base64Image && (
              <Typography variant="caption" style={{ display: 'block', marginTop: '5px' }}>
                Picture uploaded successfully.
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Locations</Typography>
          </Grid>
          {fields.map((field, index) => (
            <Grid container spacing={2} key={field.id}>
            
              <Grid item xs={12} md={4}>
                <TextField
                  label="Location Name"
                  fullWidth
                  {...register(`locations.${index}.location_name`, {
                    required: 'Location Name is required',
                  })}
                />
              </Grid>

              {/* Row Shelf */}
              <Grid item xs={12} md={4}>
                <TextField
                  label="Row Shelf"
                  fullWidth
                  {...register(`locations.${index}.row_shelf`, {
                    required: 'Row Shelf is required',
                  })}
                />
              </Grid>

          
              <Grid item xs={12} md={3}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  {...register(`locations.${index}.quantity`)}
                />
              </Grid>

           
              <Grid item xs={12} md={1}>
                <IconButton onClick={() => remove(index)}>
                  
                </IconButton>
              </Grid>
            </Grid>
          ))}

      
          <Grid item xs={12}>
            <Button
              variant="outlined"
              
              onClick={() =>
                append({ location_name: '', row_shelf: '', quantity: 0 })
              }
            >
              Add Location
            </Button>
          </Grid>

        
          <Grid item xs={12}>
            <Button variant="contained" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Inventory;
