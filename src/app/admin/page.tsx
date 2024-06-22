"use client"

import React, { useEffect, useState } from 'react';
import AdminPanel from '../../components/AdminPanel';
import { getUser } from '../../utils/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CircularProgress, LinearProgress } from '@mui/material';

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
    setLoading(false);
  }, [router, user]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!user || user.role !== 'admin') {
    return <LinearProgress />;
  }

  return (
    <div>
      <AdminPanel />
    </div>
  );
};

export default AdminPage;
