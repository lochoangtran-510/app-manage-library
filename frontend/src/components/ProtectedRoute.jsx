import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Kiểm tra token trong localStorage
  const token = localStorage.getItem('token');

  // Nếu không có token, điều hướng về trang Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có token, hiển thị component con (thông qua Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
