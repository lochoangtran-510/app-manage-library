import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Search, Book, Layers, Tag as TagIcon, Hash, User } from 'lucide-react';
import Modal from '../components/Modal';
import API_BASE_URL from '../api/config';

const LibrarianBooks = () => {
  const [activeTab, setActiveTab] = useState('books'); // 'books' or 'categories'
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [bookFormData, setBookFormData] = useState({
    title: '', author: '', isbn: '', publisher: '', publishYear: '', categoryId: '', pageCount: '', bookSize: '', initialCopies: 1
  });
  const [catFormData, setCatFormData] = useState({ categoryCode: '', name: '', description: '' });

  const axiosConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookResp, catResp] = await Promise.all([
        axios.get(`${API_BASE_URL}/books`, axiosConfig),
        axios.get(`${API_BASE_URL}/categories`, axiosConfig)
      ]);
      setBooks(bookResp.data.data);
      setCategories(catResp.data.data);
    } catch (err) {
      toast.error('Lỗi lấy dữ liệu từ hệ thống!');
    } finally {
      setLoading(false);
    }
  };

  // --- Chuyên ngành CRUD ---
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/categories/${editingId}`, catFormData, axiosConfig);
        toast.success('Đã cập nhật chuyên ngành!');
      } else {
        await axios.post(`${API_BASE_URL}/categories`, catFormData, axiosConfig);
        toast.success('Đã thêm chuyên ngành mới!');
      }
      setIsCatModalOpen(false);
      resetForms();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Sau khi xóa, các sách thuộc chuyên ngành này sẽ bị ảnh hưởng. Bạn có muốn tiếp tục?')) {
      try {
        await axios.delete(`${API_BASE_URL}/categories/${id}`, axiosConfig);
        toast.success('Đã xóa chuyên ngành!');
        fetchData();
      } catch (err) {
        toast.error('Lỗi khi xóa chuyên ngành!');
      }
    }
  };

  // --- Đầu sách CRUD ---
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/books/${editingId}`, bookFormData, axiosConfig);
        toast.success('Đã cập nhật đầu sách!');
      } else {
        // UC09 & UC10: Bao gồm initialCopies
        await axios.post(`${API_BASE_URL}/books`, bookFormData, axiosConfig);
        toast.success('Đã nhập kho đầu sách và các bản sao thành công!');
      }
      setIsBookModalOpen(false);
      resetForms();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi lưu sách!');
    }
  };

  const deleteBook = async (id) => {
    if (window.confirm('Mọi thông tin mượn trả liên quan đến đầu sách này sẽ bị ảnh hưởng. Bạn có chắc không?')) {
      try {
        await axios.delete(`${API_BASE_URL}/books/${id}`, axiosConfig);
        toast.success('Đã xóa đầu sách và bản sao!');
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Lỗi khi xóa!');
      }
    }
  };

  const resetForms = () => {
    setBookFormData({ title: '', author: '', isbn: '', publisher: '', publishYear: '', categoryId: '', pageCount: '', bookSize: '', initialCopies: 1 });
    setCatFormData({ categoryCode: '', name: '', description: '' });
    setEditingId(null);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 max-w-6xl pb-20">
      <div className="mb-8 py-6 border-b border-slate-200">
        <h1 className="text-4xl font-extrabold text-slate-800 font-outfit tracking-tight">Quản lý Kho sách</h1>
        <p className="text-slate-500 mt-1">Nơi quản lý thông tin đầu sách và các danh mục chuyên ngành.</p>
      </div>

      {/* Tabs Control */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-8 shadow-inner">
        <button 
          onClick={() => setActiveTab('books')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'books' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Book size={18} /> Đầu sách
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'categories' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Layers size={18} /> Chuyên ngành
        </button>
      </div>

      {activeTab === 'books' ? (
        <section className="animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
            <div className="bg-white flex-1 px-6 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center max-w-lg">
              <Search size={22} className="text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="Tìm sách, tác giả..." 
                className="w-full py-2 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { resetForms(); setIsBookModalOpen(true); }}
              className="flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-primary-700 active:scale-95 transition-all"
            >
              <Plus size={20} /> Nhập sách mới
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-700">Đầu sách</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Tác giả</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Chuyên ngành</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Số bản sao</th>
                  <th className="px-6 py-4 font-bold text-slate-700 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-20 text-center opacity-50">Đang tải đầu sách...</td></tr>
                ) : filteredBooks.length > 0 ? filteredBooks.map(book => (
                  <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 leading-tight">{book.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{book.isbn}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-semibold text-slate-500 border border-slate-200">
                        {book.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-primary-600 font-bold bg-primary-50 px-3 py-1 rounded-lg border border-primary-100">
                        {book.copies?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setEditingId(book.id);
                          setBookFormData({ ...book, initialCopies: book.copies?.length || 0 });
                          setIsBookModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all mr-2"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteBook(book.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="px-6 py-20 text-center opacity-50">Kho sách đang trống.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        /* Tab Chuyên ngành (UC13) */
        <section className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl">
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => { resetForms(); setIsCatModalOpen(true); }}
              className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-900 active:scale-95 transition-all"
            >
              <Plus size={20} /> Thêm Chuyên ngành
            </button>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-700">Mã CN</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Tên chuyên ngành</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Mô tả</th>
                  <th className="px-6 py-4 font-bold text-slate-700 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="px-6 py-4 font-mono font-bold text-slate-500">
                      {cat.categoryCode}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                       <TagIcon size={14} className="text-primary-500" /> {cat.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 leading-relaxed italic line-clamp-1">{cat.description || 'Chưa có mô tả'}</td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => { setEditingId(cat.id); setCatFormData(cat); setIsCatModalOpen(true); }} className="p-2 text-slate-400 hover:text-primary-600 mr-2"><Edit size={16} /></button>
                       <button onClick={() => deleteCategory(cat.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Modal Nhập Sách (UC09, UC10) */}
      <Modal 
        isOpen={isBookModalOpen} 
        onClose={() => setIsBookModalOpen(false)} 
        title={editingId ? 'Sửa thông tin sách' : 'Nhập kho sách mới'}
      >
        <form onSubmit={handleBookSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Book size={14}/> Tên sách</label>
              <input type="text" required className="modal-input w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={bookFormData.title} onChange={e => setBookFormData({...bookFormData, title: e.target.value})}/>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><User size={14}/> Tác giả</label>
              <input type="text" required className="modal-input w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={bookFormData.author} onChange={e => setBookFormData({...bookFormData, author: e.target.value})}/>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Hash size={14}/> Mã đầu sách (ISBN)</label>
              <input type="text" className="modal-input w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={bookFormData.isbn} onChange={e => setBookFormData({...bookFormData, isbn: e.target.value})}/>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-slate-700 mb-1">Chuyên ngành</label>
              <select 
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                value={bookFormData.categoryId}
                onChange={e => setBookFormData({...bookFormData, categoryId: e.target.value})}
              >
                <option value="">-- Chọn chuyên ngành --</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1">Nhà xuất bản</label>
              <input type="text" className="modal-input w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={bookFormData.publisher} onChange={e => setBookFormData({...bookFormData, publisher: e.target.value})}/>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1">Năm xuất bản</label>
              <input type="number" className="modal-input w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={bookFormData.publishYear} onChange={e => setBookFormData({...bookFormData, publishYear: e.target.value})}/>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1">Số trang</label>
              <input type="number" className="modal-input w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={bookFormData.pageCount} onChange={e => setBookFormData({...bookFormData, pageCount: e.target.value})}/>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1">Kích thước</label>
              <input type="text" placeholder="VD: 13x19 cm" className="modal-input w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={bookFormData.bookSize} onChange={e => setBookFormData({...bookFormData, bookSize: e.target.value})}/>
            </div>
            
            {/* UC10: Input số lượng bản sao (Chỉ khi thêm mới) */}
            {!editingId && (
              <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <label className="text-sm font-bold text-blue-700 mb-1 flex items-center gap-1">Khởi tạo bản sao (UC10)</label>
                <div className="flex items-center gap-4 mt-1">
                  <input 
                    type="number" min="1" max="100" required
                    className="w-24 px-4 py-3 bg-white border border-blue-200 rounded-xl font-bold text-blue-800"
                    value={bookFormData.initialCopies} 
                    onChange={e => setBookFormData({...bookFormData, initialCopies: e.target.value})}
                  />
                  <span className="text-blue-500 font-medium text-xs">Hệ thống sẽ tự động tạo {bookFormData.initialCopies} mã định danh cho số sách này.</span>
                </div>
              </div>
            )}
          </div>
          <button type="submit" className="w-full py-4 bg-primary-600 text-white font-black rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-100 mt-4 transition-all active:scale-[0.98]">
            {editingId ? 'Lưu thay đổi' : 'Cập nhật kho sách'}
          </button>
        </form>
      </Modal>

      {/* Modal Chuyên ngành (UC13) */}
      <Modal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} title="Thông tin Chuyên ngành">
        <form onSubmit={handleCatSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1">Mã chuyên ngành</label>
            <input type="text" required placeholder="VD: CNTT, TOAN..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={catFormData.categoryCode} onChange={e => setCatFormData({...catFormData, categoryCode: e.target.value.toUpperCase()})}/>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1">Tên chuyên ngành</label>
            <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={catFormData.name} onChange={e => setCatFormData({...catFormData, name: e.target.value})}/>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1">Mô tả ngắn</label>
            <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl h-24" value={catFormData.description} onChange={e => setCatFormData({...catFormData, description: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 shadow-lg mt-4">Xác nhận</button>
        </form>
      </Modal>
    </div>
  );
};

export default LibrarianBooks;
