import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h1>Chào mừng bạn đến với Dashboard Thư viện</h1>
      <p>Đây là trang bảo mật, chỉ dành cho Thủ thư và Admin.</p>
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
};

export default Dashboard;
