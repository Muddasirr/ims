'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/auth/login`, data);
      alert('Login successful: ' + response.data.message);
     router.push('/dashboard/Inventorytable');
    } catch (error) {
      alert('Error: ' + error.response.data.message); 
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

         
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          
         
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
