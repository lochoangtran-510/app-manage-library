import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, User, Book as BookIcon, Plus, CheckCircle2, AlertCircle, Trash2, Calendar, CornerUpLeft, BookOpen, Clock, ScanBarcode } from 'lucide-react';

const LibrarianBorrow = () => {
  const [activeTab, setActiveTab] = useState('borrow'); // 'borrow' or 'return'
  const axiosConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  // --- PHẦN 1: MƯỢN SÁCH ---
  const [cardId, setCardId] = useState('');
  const [reader, setReader] = useState(null);
  const [barcodeOrTitle, setBarcodeOrTitle] = useState('');
  const [suggestions, setSuggestions] = useState([]); // Gợi ý tìm kiếm (NEW)
  const [borrowList, setBorrowList] = useState([]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Debounce tìm kiếm khi gõ tên sách
    const timer = setTimeout(() => {
      if (barcodeOrTitle.length >= 2 && !barcodeOrTitle.startsWith('BC-')) {
        handleSearchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [barcodeOrTitle]);

  const handleSearchSuggestions = async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/books?search=${barcodeOrTitle}`, axiosConfig);
      // Chỉ lấy các bản sao có sẵn (AVAILABLE)
      const availableCopies = [];
      resp.data.data.forEach(book => {
        book.copies.forEach(copy => {
          if (copy.status === 'AVAILABLE') {
            availableCopies.push({
              copyId: copy.id,
              barcode: copy.barcode,
              title: book.title,
              author: book.author
            });
          }
        });
      });
      setSuggestions(availableCopies.slice(0, 5)); // Lấy 5 gợi ý đầu
    } catch (err) {
      console.error(err);
    }
  };

  const checkReader = async () => {
    if (!cardId) return;
    try {
      const resp = await axios.get(`http://localhost:5000/api/readers/check/${cardId}`, axiosConfig);
      if (resp.data.isExpired) { toast.error('Thẻ hết hạn!'); setReader(null); }
      else { setReader(resp.data.data); }
    } catch (err) { setReader(null); toast.error('Không tìm thấy thẻ!'); }
  };

  const addCopyToList = (copy) => {
    if (borrowList.some(i => i.id === copy.copyId)) return toast.warning('Sách đã có trong danh sách!');
    setBorrowList([...borrowList, { id: copy.copyId, barcode: copy.barcode, title: copy.title }]);
    setBarcodeOrTitle('');
    setSuggestions([]);
  };

  const checkAndAddByBarcode = async () => {
    if (!barcodeOrTitle) return;
    try {
      const resp = await axios.get(`http://localhost:5000/api/books/copy-check/${barcodeOrTitle}`, axiosConfig);
      const copy = resp.data.data;
      if (copy.status !== 'AVAILABLE') toast.error('Sách không sẵn sàng!');
      else {
        addCopyToList({ copyId: copy.id, barcode: copy.barcode, title: copy.book.title });
      }
    } catch (err) { toast.error('Không tìm thấy mã sách!'); }
  };

  const finalizeBorrowing = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/borrow', { readerId: reader.id, copyIds: borrowList.map(i => i.id), dueDate }, axiosConfig);
      toast.success('Mượn sách thành công!');
      setReader(null); setCardId(''); setBorrowList([]);
    } catch (err) { 
      const errorMsg = err.response?.data?.message || 'Lỗi khi mượn sách!';
      toast.error(errorMsg); 
    } 
    finally { setLoading(false); }
  };

  // --- PHẦN 2: TRẢ SÁCH ---
  const [returnCardId, setReturnCardId] = useState('');
  const [returnReader, setReturnReader] = useState(null);
  const [activeBorrowings, setActiveBorrowings] = useState([]);

  const searchBorrowings = async () => {
    if (!returnCardId) return;
    try {
      const resp = await axios.get(`http://localhost:5000/api/borrow/active/${returnCardId}`, axiosConfig);
      setReturnReader(resp.data.reader);
      setActiveBorrowings(resp.data.data);
      if (resp.data.data.length === 0) toast.info('Độc giả này không có sách đang mượn.');
    } catch (err) {
      toast.error('Không tìm thấy thông tin mượn!');
    }
  };

  const handleReturn = async (id, condition) => {
    try {
      await axios.put(`http://localhost:5000/api/borrow/return/${id}`, { condition }, axiosConfig);
      toast.success('Đã ghi nhận trả sách!');
      searchBorrowings(); 
    } catch (err) {
      toast.error('Lỗi khi trả sách!');
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 mb-20 animate-in fade-in duration-500">
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-10 mx-auto shadow-inner">
        <button onClick={() => setActiveTab('borrow')} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'borrow' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
          <BookOpen size={20} /> Mượn sách
        </button>
        <button onClick={() => setActiveTab('return')} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'return' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
          <CornerUpLeft size={20} /> Trả sách
        </button>
      </div>

      {activeTab === 'borrow' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-fit">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700 font-outfit uppercase tracking-tight"><User size={20} /> Bước 1: Độc giả</h3>
             <div className="flex gap-2">
               <input type="text" placeholder="Mã thẻ (LIB-...)" className="flex-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={cardId} onChange={e => setCardId(e.target.value)} onKeyPress={e => e.key==='Enter' && checkReader()} />
               <button onClick={checkReader} className="bg-slate-800 text-white px-4 rounded-xl font-bold active:scale-95 transition-all outline-none">Check</button>
             </div>
             {reader && (
               <div className="mt-8 p-6 bg-primary-50 border border-primary-100 rounded-3xl animate-in slide-in-from-top-4">
                 <p className="font-bold text-primary-900 text-lg leading-tight">{reader.fullName}</p>
                 <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mt-2 italic">{reader.studentId}</p>
                 <div className="mt-6 pt-6 border-t border-primary-100">
                    <label className="text-[10px] font-black text-primary-400 uppercase mb-2 block tracking-widest">Hạn trả dự kiến ⏳</label>
                    <input type="date" className="w-full p-3 bg-white rounded-xl border-none font-bold text-slate-700 shadow-inner" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                 </div>
               </div>
             )}
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col min-h-[550px]">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700 font-outfit uppercase tracking-tight"><Plus size={20} /> Bước 2: Chọn sách</h3>
             <div className="relative mb-8">
                <div className="flex gap-2">
                   <div className="relative flex-1">
                      <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="text" 
                        placeholder="Tìm tên sách hoặc nhập Barcode..." 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-primary-500 focus:bg-white transition-all text-lg font-medium" 
                        value={barcodeOrTitle} 
                        onChange={e => setBarcodeOrTitle(e.target.value)} 
                        onKeyPress={e => e.key==='Enter' && barcodeOrTitle.startsWith('BC-') && checkAndAddByBarcode()} 
                      />
                   </div>
                   {barcodeOrTitle.startsWith('BC-') && (
                      <button onClick={checkAndAddByBarcode} className="bg-primary-600 text-white px-8 rounded-2xl font-bold shadow-lg shadow-primary-200">Thêm</button>
                   )}
                </div>

                {/* DROPDOWN GỢI Ý - SIÊU NĂNG LỰC MỚI */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[10px] font-black text-slate-400 p-3 uppercase tracking-widest border-b mb-2">Gợi ý sách đang mẫu (Available)</p>
                    {suggestions.map(s => (
                      <button 
                        key={s.copyId}
                        onClick={() => addCopyToList(s)}
                        className="w-full flex items-center justify-between p-4 hover:bg-primary-50 rounded-xl transition-all text-left group"
                      >
                         <div className="flex items-center gap-4">
                            <div className="bg-white p-2 rounded-lg text-primary-600 shadow-sm group-hover:scale-110 transition-transform"><BookIcon size={18}/></div>
                            <div>
                               <p className="font-bold text-slate-700 leading-none">{s.title}</p>
                               <p className="text-xs text-slate-400 mt-1 uppercase font-mono">{s.barcode}</p>
                            </div>
                         </div>
                         <Plus size={18} className="text-primary-400 group-hover:text-primary-600" />
                      </button>
                    ))}
                  </div>
                )}
             </div>

             <div className="flex-1 border-2 border-slate-50 rounded-3xl overflow-hidden mb-8">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-8 py-4 text-left font-black text-[10px] uppercase text-slate-400 tracking-[0.2em]">Barcode</th>
                      <th className="px-8 py-4 text-left font-black text-[10px] uppercase text-slate-400 tracking-[0.2em]">Tên sách đã chọn</th>
                      <th className="px-8 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {borrowList.map(i => (
                      <tr key={i.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4 font-mono text-primary-600 font-bold">{i.barcode}</td>
                        <td className="px-8 py-4 font-bold text-slate-700">{i.title}</td>
                        <td className="px-8 py-4 text-right">
                          <button onClick={() => setBorrowList(borrowList.filter(x => x.id!==i.id))} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                            <Trash2 size={18}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {borrowList.length === 0 && (
                      <tr><td colSpan="3" className="py-20 text-center text-slate-300 italic font-medium">Chưa có sách nào trong danh sách mượn.</td></tr>
                    )}
                  </tbody>
                </table>
             </div>
             <button disabled={!reader || borrowList.length===0 || loading} onClick={finalizeBorrowing} className="w-full py-5 bg-primary-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-primary-200 uppercase tracking-widest active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                {loading ? 'Đang xử ký dữ liệu...' : 'Xác nhận Hoàn tất Phiếu mượn'}
             </button>
          </div>
        </div>
      ) : (
        /* TRẢ SÁCH (Giữ nguyên logic tuyệt vời đã có) */
        <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-500">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-800 mb-8 font-outfit uppercase tracking-tighter">Tìm kiếm để trả sách</h2>
            <div className="flex gap-4 mb-10">
              <input 
                type="text" 
                placeholder="Nhập mã thẻ độc giả..." 
                className="flex-1 px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-lg outline-none focus:border-primary-500 focus:bg-white transition-all font-mono"
                value={returnCardId}
                onChange={e => setReturnCardId(e.target.value)}
                onKeyPress={e => e.key==='Enter' && searchBorrowings()}
              />
              <button onClick={searchBorrowings} className="px-10 bg-slate-800 text-white rounded-2xl font-black hover:bg-slate-900 shadow-xl transition-all">Truy vấn</button>
            </div>

            {returnReader && (
              <div className="mb-8 border-b border-slate-100 pb-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Độc giả mượn</p>
                  <h3 className="text-xl font-bold text-slate-800">{returnReader.fullName}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Số sách mượn</p>
                  <h3 className="text-3xl font-black text-primary-600">{activeBorrowings.length}</h3>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {activeBorrowings.map(item => (
                <div key={item.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-50 group transition-all">
                   <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm text-primary-600 group-hover:scale-110 transition-transform">
                        <BookIcon size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg leading-tight">{item.bookCopy?.book?.title}</p>
                        <p className="text-xs font-mono text-slate-500 mt-1 uppercase italic">{item.bookCopy?.barcode}</p>
                        <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold mt-2 uppercase tracking-tighter">
                           <Clock size={12} /> Hạn trả: {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 mt-4 md:mt-0">
                      <select id={`condition-${item.id}`} className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600">
                         <option value="Bình thường">Bình thường</option>
                         <option value="Rách">Sách bị rách</option>
                         <option value="Mất">Mất sách</option>
                      </select>
                      <button onClick={() => handleReturn(item.id, document.getElementById(`condition-${item.id}`).value)} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-100 active:scale-90 transition-all">
                        Trình trả
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarianBorrow;
