import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Search, CreditCard, Printer, UserCircle } from 'lucide-react';
import Modal from '../components/Modal';

const LibrarianReaders = () => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedReader, setSelectedReader] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ 
    studentId: '', 
    fullName: '', 
    email: '', 
    phoneNumber: '' 
  });

  const axiosConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  useEffect(() => {
    fetchReaders();
  }, []);

  const fetchReaders = async () => {
    try {
      const resp = await axios.get('http://localhost:5000/api/readers', axiosConfig);
      setReaders(resp.data.data);
    } catch (err) {
      toast.error('Lỗi lấy danh sách độc giả!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UC07: Sửa
        await axios.put(`http://localhost:5000/api/readers/${editingId}`, formData, axiosConfig);
        toast.success('Đã cập nhật thông tin độc giả!');
      } else {
        // UC05: Đăng ký thẻ
        await axios.post('http://localhost:5000/api/readers', formData, axiosConfig);
        toast.success('Đăng ký thẻ thành công!');
      }
      setIsModalOpen(false);
      resetForm();
      fetchReaders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleEdit = (reader) => {
    setEditingId(reader.id);
    setFormData({ 
      studentId: reader.studentId, 
      fullName: reader.fullName, 
      email: reader.email || '', 
      phoneNumber: reader.phoneNumber || '' 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thẻ độc giả này không?')) {
      try {
        await axios.delete(`http://localhost:5000/api/readers/${id}`, axiosConfig);
        toast.success('Đã xóa thành công!');
        fetchReaders();
      } catch (err) {
        toast.error('Lỗi khi xóa tài khoản!');
      }
    }
  };

  const handleOpenPrint = (reader) => {
    setSelectedReader(reader);
    setIsPrintModalOpen(true);
  };

  const triggerPrint = () => {
    window.print();
  };

  const resetForm = () => {
    setFormData({ studentId: '', fullName: '', email: '', phoneNumber: '' });
    setEditingId(null);
  };

  const filteredReaders = readers.filter(r => 
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cardId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 max-w-6xl no-print">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 font-outfit tracking-tight">Quản lý Độc giả</h1>
          <p className="text-slate-500 mt-1">Đăng ký và cấp phát thẻ thư viện cho sinh viên.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-200 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <Plus size={20} /> Đăng ký thẻ mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-primary-50 p-4 rounded-2xl text-primary-600">
            <CreditCard size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Tổng số thẻ</p>
            <h3 className="text-3xl font-bold text-slate-800">{readers.length} Thẻ</h3>
          </div>
        </div>
        <div className="md:col-span-2 bg-white px-6 py-2 rounded-3xl border border-slate-100 shadow-sm flex items-center">
          <Search size={22} className="text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Tìm theo tên, MSSV hoặc Mã thẻ..." 
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
              <th className="px-6 py-4 font-bold text-slate-700">Độc giả (MSSV)</th>
              <th className="px-6 py-4 font-bold text-slate-700">Mã thẻ</th>
              <th className="px-6 py-4 font-bold text-slate-700">Hạn thẻ</th>
              <th className="px-6 py-4 font-bold text-slate-700 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
            ) : filteredReaders.length > 0 ? filteredReaders.map(reader => (
              <tr key={reader.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-800">{reader.fullName}</p>
                  <p className="text-xs text-slate-500">{reader.studentId}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded-lg">
                    {reader.cardId}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className={new Date(reader.expiryDate) < new Date() ? 'text-red-500 font-bold' : 'text-slate-600'}>
                    {new Date(reader.expiryDate).toLocaleDateString('vi-VN')}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleOpenPrint(reader)}
                    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all mr-1"
                    title="In thẻ"
                  >
                    <Printer size={18} />
                  </button>
                  <button 
                    onClick={() => handleEdit(reader)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all mr-1"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(reader.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-400">Không tìm thấy độc giả nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form: Đăng ký/Sửa */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Cập nhật thông tin thẻ' : 'Đăng ký thẻ thư viện mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Mã số sinh viên (MSSV)</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 transition-all outline-none"
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Họ và tên</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 transition-all outline-none"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input 
              type="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 transition-all outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Số điện thoại</label>
            <input 
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 transition-all outline-none"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl mt-4 shadow-lg shadow-primary-100">
            {editingId ? 'Cập nhật thẻ' : 'Xác nhận tạo thẻ'}
          </button>
        </form>
      </Modal>

      {/* Modal In Thẻ (UC06) */}
      <Modal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} title="Xem trước Thẻ Thư viện">
        <div className="flex flex-col items-center">
          <div id="printable-card" className="w-[350px] h-[220px] bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            {/* Họa tiết trang trí */}
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                   <CreditCard size={20} />
                </div>
                <span className="font-bold tracking-widest text-xs uppercase opacity-80">Library Card</span>
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded backdrop-blur-md">Active</span>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl border border-white/30 flex items-center justify-center backdrop-blur-md">
                <UserCircle size={40} className="text-white/80" />
              </div>
              <div>
                <h2 className="text-xl font-black font-outfit uppercase leading-tight">{selectedReader?.fullName}</h2>
                <p className="text-xs opacity-70 tracking-widest">{selectedReader?.studentId}</p>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-white/20 pt-3">
              <div>
                <p className="text-[8px] uppercase opacity-50 font-bold mb-1">Card Number</p>
                <p className="font-mono font-bold tracking-widest">{selectedReader?.cardId}</p>
              </div>
              <div className="text-right">
                 <p className="text-[8px] uppercase opacity-50 font-bold mb-1">Valid Thru</p>
                 <p className="font-bold text-sm">
                   {selectedReader && new Date(selectedReader.expiryDate).toLocaleDateString('vi-VN')}
                 </p>
              </div>
            </div>
          </div>

          <button 
            onClick={triggerPrint}
            className="mt-8 flex items-center gap-2 bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg"
          >
            <Printer size={20} /> Print Now
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LibrarianReaders;
