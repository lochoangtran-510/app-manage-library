import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Library, LogIn, User, Lock, AlertCircle } from 'lucide-react';
import API_BASE_URL from '../api/config';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra nếu đã đăng nhập thì không cho vào trang Login nữa (Redirect)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      const user = JSON.parse(userJson);
      // Điều hướng về trang phù hợp với Role
      if (user.role === 'ADMIN') {
        navigate('/admin/librarians');
      } else {
        navigate('/librarian/books');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return toast.warning('Vui lòng nhập đầy đủ thông tin!');
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        // Lưu thông tin
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success(`Chào mừng trở lại, ${user.fullName}!`);
        
        // Điều hướng thông minh dựa trên Role
        if (user.role === 'ADMIN') {
          navigate('/admin/librarians');
        } else if (user.role === 'LIBRARIAN') {
          navigate('/librarian/books');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập sai!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 transition-all">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-50 p-4 rounded-2xl">
            <Library size={48} className="text-primary-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-2 font-outfit">Vibe Library</h1>
        <p className="text-slate-500 text-center mb-8 font-medium">Trang dành cho cán bộ thư viện 🌟</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tên đăng nhập</label>
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Nhập username" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                placeholder="Nhập password" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-70"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
