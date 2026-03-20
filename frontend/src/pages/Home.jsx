import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Book as BookIcon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const resp = await axios.get(`${API_BASE_URL}/books`);
        setBooks(resp.data.data);
      } catch (err) {
        console.error('Lỗi khi tải sách:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 max-w-7xl animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="py-20 text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-black text-slate-800 font-outfit tracking-tighter mb-4">
           Khám Phá <span className="text-primary-600">Tri Thức</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mb-12">
           Tìm kiếm trong kho tài liệu khổng lồ tại Thư viện VibeLib. 
           Truy cập mọi lúc, mọi nơi, hoàn toàn miễn phí cho sinh viên.
        </p>
        
        {/* Search Bar Premium */}
        <div className="w-full max-w-3xl relative group">
          <div className="absolute inset-0 bg-primary-200 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
          <div className="relative bg-white p-2 rounded-3xl border border-slate-200 shadow-2xl flex items-center gap-2 group-focus-within:border-primary-400 transition-all">
            <div className="pl-4 text-slate-400">
               <Search size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Nhập tên sách, tác giả hoặc ISBN để tìm kiếm..." 
              className="flex-1 py-4 text-lg outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-primary-600 hidden md:flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all">
               Tìm ngay
            </button>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="pb-32">
        <div className="flex items-center justify-between mb-10">
           <h2 className="text-2xl font-bold text-slate-800">Sách mới nhất</h2>
           <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{filteredBooks.length} Kết quả</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
             {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map(book => (
              <div key={book.id} className="premium-card p-8 group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                  <BookIcon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight h-[3.5rem] line-clamp-2">{book.title}</h3>
                <p className="text-slate-500 text-sm mb-6 flex items-center gap-1 italic">{book.author}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200">
                    {book.category?.name || 'Chuyên ngành'}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                    book.copies?.some(c => c.status === 'AVAILABLE') 
                    ? 'bg-green-50 text-green-600 border-green-100' 
                    : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {book.copies?.some(c => c.status === 'AVAILABLE') ? 'Sẵn sàng' : 'Hết sách'}
                  </span>
                </div>

                <Link 
                  to={`/book/${book.id}`} 
                  className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 text-slate-800 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all duration-300"
                >
                  Chi tiết <ChevronRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <Search size={40} />
            </div>
            <p className="text-xl font-bold text-slate-400">Không tìm thấy đầu sách nào phù hợp.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
