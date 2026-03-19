import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Book as BookIcon, MapPin, Hash, Building, Calendar, Info, CheckCircle, XCircle } from 'lucide-react';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  const fetchBookDetail = async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(resp.data.data);
    } catch (err) {
      console.error('Lỗi lấy chi tiết sách:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!book) return (
    <div className="container mx-auto px-6 py-20 text-center">
      <h2 className="text-2xl font-bold text-slate-400">Không tìm thấy sách.</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-primary-600 font-bold">Quay lại trang chủ</button>
    </div>
  );

  return (
    <div className="container mx-auto px-6 max-w-6xl py-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Nút quay lại */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold mb-10 transition-colors group"
      >
        <div className="bg-white p-2 rounded-xl shadow-sm group-hover:bg-primary-50">
          <ChevronLeft size={20} />
        </div>
        Quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cột 1: Hình ảnh/Icon minh họa */}
        <div className="lg:col-span-4">
           <div className="sticky top-32">
              <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-xl flex items-center justify-center text-primary-600 aspect-square">
                <BookIcon size={120} strokeWidth={1.5} />
              </div>
              <div className="mt-8 p-6 bg-primary-50 rounded-3xl border border-primary-100 italic text-primary-700 text-sm">
                 💡 <strong>Mẹo:</strong> Hãy ghi chú lại <strong>Mã vạch (Barcode)</strong> bên dưới và mang đến quầy thủ thư để làm thủ tục mượn sách.
              </div>
           </div>
        </div>

        {/* Cột 2: Thông tin chi tiết */}
        <div className="lg:col-span-8">
           <div className="mb-10">
              <span className="bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                {book.category?.name || 'Chiêu ngành'}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 font-outfit mt-4 leading-tight">
                {book.title}
              </h1>
              <p className="text-xl text-slate-500 mt-4 flex items-center gap-2">
                bởi <span className="font-bold text-slate-700 underline decoration-primary-200">{book.author}</span>
              </p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-5 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã ISBN</p>
                 <p className="font-bold text-slate-700 flex items-center gap-2"><Hash size={14}/> {book.isbn}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nhà xuất bản</p>
                 <p className="font-bold text-slate-700 flex items-center gap-2"><Building size={14}/> {book.publisher}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Năm xuất bản</p>
                 <p className="font-bold text-slate-700 flex items-center gap-2"><Calendar size={14}/> {book.publishYear}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng cộng</p>
                 <p className="font-bold text-slate-700 flex items-center gap-2"><Info size={14}/> {book.copies?.length} Cuốn</p>
              </div>
           </div>

           {/* Danh sách các bản sao vật lý */}
           <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-8 py-5 border-b border-slate-200">
                 <h3 className="font-bold text-slate-700">Tình trạng các bản sao tại kho</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {book.copies?.map((copy, idx) => (
                  <div key={copy.id} className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 font-mono italic">Barcode: {copy.barcode}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {copy.location || 'Vị trí: Khu A-01'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      {copy.status === 'AVAILABLE' ? (
                        <span className="flex items-center gap-1.5 text-green-600 font-black text-[10px] uppercase tracking-widest bg-green-50 px-4 py-2 rounded-full border border-green-100">
                           <CheckCircle size={14} /> Sẵn sàng cho mượn
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-500 font-black text-[10px] uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-100">
                           <XCircle size={14} /> Đang được mượn
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
