"use client"

import '../styles/global.css';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Link } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider>
      <AuthProvider>
        <CssBaseline />
        <Layout>{children}</Layout>
      </AuthProvider>
    </AppRouterCacheProvider>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      router.refresh();
    }
  };

  const renderAdmin = () => {
    if (user?.role === 'admin') {
      return <Link href='/admin'>Admin</Link>;
    }
  }

  return (
    <html lang="en">
      <body>
        <header>
          <title>Sunset Store</title>
          <meta name="description" content='starting point to build the SEO'></meta>
          <div className='menu-container'>
            <Link href='/'>Home</Link>
            {renderAdmin()}
          </div>
          {user ? (
            <div className='login-container'>
              <LogoutIcon className='login-icon' />
              <Button onClick={handleLogout} variant="contained">Logout</Button>
            </div>
          ) : (
            <div className='login-container'>
              <LoginIcon className='login-icon' />
              <Button onClick={() => router.push('/login')} variant="contained">Login</Button>
            </div>
          )}
        </header>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
