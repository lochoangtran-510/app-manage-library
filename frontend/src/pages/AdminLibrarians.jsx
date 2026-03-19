import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Search, UserCheck } from 'lucide-react';
import Modal from '../components/Modal';

const AdminLibrarians = () => {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    fullName: '', 
    email: '' 
  });

  const axiosConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  useEffect(() => {
    fetchLibrarians();
  }, []);

  const fetchLibrarians = async () => {
    try {
      const resp = await axios.get('http://localhost:5000/api/users', axiosConfig);
      setLibrarians(resp.data.data);
    } catch (err) {
      toast.error('Lỗi lấy danh sách thủ thư!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UC03: Sửa
        await axios.put(`http://localhost:5000/api/users/${editingId}`, formData, axiosConfig);
        toast.success('Đã cập nhật thông tin thủ thư!');
      } else {
        // UC02: Thêm mới
        await axios.post('http://localhost:5000/api/users', formData, axiosConfig);
        toast.success('Đã tạo thành công tài khoản thủ thư!');
      }
      setIsModalOpen(false);
      resetForm();
      fetchLibrarians();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleEdit = (lib) => {
    setEditingId(lib.id);
    setFormData({ 
      username: lib.username, 
      password: '', // Không nạp lại mật khẩu cũ vì lý do bảo mật
      fullName: lib.fullName, 
      email: lib.email 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thủ thư này không?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, axiosConfig);
        toast.success('Đã xóa thành công!');
        fetchLibrarians();
      } catch (err) {
        toast.error('Lỗi khi xóa tài khoản!');
      }
    }
  };

  const resetForm = () => {
    setFormData({ username: '', password: '', fullName: '', email: '' });
    setEditingId(null);
  };

  const filteredLibrarians = librarians.filter(l => 
    l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 font-outfit tracking-tight">Quản lý Thủ thư</h1>
          <p className="text-slate-500 mt-1">Chào Admin! Đây là nơi bạn quản lý đội ngũ của mình.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-200 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <Plus size={20} /> Thêm Thủ thư
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-primary-50 p-4 rounded-2xl text-primary-600">
            <UserCheck size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Tổng cộng</p>
            <h3 className="text-3xl font-black text-slate-800">{librarians.length} Nhân viên</h3>
          </div>
        </div>
        <div className="md:col-span-2 bg-white px-6 py-2 rounded-3xl border border-slate-100 shadow-sm flex items-center">
          <Search size={22} className="text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc username..." 
            className="w-full py-4 text-lg outline-none bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-700">Thủ thư</th>
              <th className="px-6 py-4 font-bold text-slate-700">Username</th>
              <th className="px-6 py-4 font-bold text-slate-700">Email</th>
              <th className="px-6 py-4 font-bold text-slate-700 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
            ) : filteredLibrarians.length > 0 ? filteredLibrarians.map(lib => (
              <tr key={lib.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-800">{lib.fullName}</td>
                <td className="px-6 py-4 text-slate-600">{lib.username}</td>
                <td className="px-6 py-4 text-slate-600">{lib.email}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleEdit(lib)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(lib.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-400">Không tìm thấy thủ thư nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Sửa thông tin' : 'Thêm Thủ thư mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Họ và tên</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 transition-all outline-none"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 transition-all outline-none"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 transition-all outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {editingId ? 'Mật khẩu mới (Để trống nếu không đổi)' : 'Mật khẩu'}
            </label>
            <input 
              type="password" 
              required={!editingId}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 transition-all outline-none"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminLibrarians;
