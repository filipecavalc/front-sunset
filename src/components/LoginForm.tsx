"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LockIcon from '@mui/icons-material/Lock';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(username, password);
    } catch (error) {
      alert('Login failed');
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin');
    } else if(user?.role === 'user') {
      router.push('/');
    }
  }, [user]);

  return (
    <form  id='login-form' name='login-form'  onSubmit={handleSubmit} className='login-form'>
      <LockIcon />
      <TextField
        id='username-field'
        name='username-field'
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        label="Username"
        variant="outlined"
      />
      <TextField
        id='password-field'
        name='password-field'
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
        variant="outlined"
      />
      <Button id='submit-login-button' type="submit" variant="contained">Login</Button>
    </form>
  );
};

export default LoginForm;
