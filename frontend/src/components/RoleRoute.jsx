import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RoleRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // 1. Kiểm tra đăng nhập (đã có token chưa)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Kiểm tra quyền (có trong danh sách allowedRoles không)
  if (!allowedRoles.includes(user.role)) {
    // Nếu không có quyền, điều hướng về Home (hoặc trang báo lỗi)
    return <Navigate to="/" replace />;
  }

  // 3. Đúng quyền, hiển thị tiếp component con
  return <Outlet />;
};

export default RoleRoute;
