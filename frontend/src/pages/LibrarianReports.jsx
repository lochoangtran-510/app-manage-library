import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, AlertTriangle, User, Book as BookIcon, Clock } from 'lucide-react';
import API_BASE_URL from '../api/config';

const LibrarianReports = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [overdueReaders, setOverdueReaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [topResp, overdueResp] = await Promise.all([
        axios.get(`${API_BASE_URL}/reports/top-books`, axiosConfig),
        axios.get(`${API_BASE_URL}/reports/overdue`, axiosConfig)
      ]);
      setTopBooks(topResp.data.data);
      setOverdueReaders(overdueResp.data.data);
    } catch (err) {
      console.error('Lỗi lấy thống kê:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'];

  // Helper tính số ngày trễ hạn (UC20)
  const calculateOverdueDays = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = Math.abs(today - due);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-10 pb-24 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-800 font-outfit uppercase tracking-tight flex items-center gap-4">
           Báo cáo Thống kê <TrendingUp size={32} className="text-primary-600" />
        </h1>
        <p className="text-slate-500 mt-2">Dữ liệu quan trọng về hiệu suất mượn sách và tình trạng quá hạn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* KHỐI 1: BIỂU ĐỒ TOP 10 SÁCH (UC19) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-700 mb-8 flex items-center gap-2">
            Top 10 Sách mượn nhiều nhất
          </h2>
          
          <div className="h-[400px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBooks} layout="vertical" margin={{ left: 40, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="bookTitle" 
                  type="category" 
                  width={150} 
                  fontSize={10} 
                  fontWeight={700}
                  tick={{ fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="borrowCount" radius={[0, 8, 8, 0]} barSize={25}>
                   {topBooks.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
             <span>Dữ liệu tính theo lượt mượn</span>
             <span className="text-primary-600">Tháng này</span>
          </div>
        </div>

        {/* KHỐI 2: DÂN SÁCH QUÁ HẠN (UC20) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-8 flex items-center gap-2">
             <AlertTriangle size={20} /> Cảnh báo: Sách quá hạn chưa trả
          </h2>
          
          <div className="space-y-4 max-h-[500px] overflow-auto pr-2 custom-scrollbar">
            {overdueReaders.length > 0 ? overdueReaders.map(item => (
              <div key={item.id} className="p-5 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between group hover:bg-red-100/50 transition-colors">
                 <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-xl text-red-600 shadow-sm self-start">
                       <User size={20} />
                    </div>
                    <div>
                       <p className="font-bold text-red-900 leading-tight">{item.reader?.fullName}</p>
                       <p className="text-xs text-red-700 mt-1 flex items-center gap-1">
                          <BookIcon size={12} /> {item.bookCopy?.book?.title}
                       </p>
                       <div className="flex gap-3 mt-3">
                          <div className="flex items-center gap-1 text-[10px] bg-white/60 px-2 py-0.5 rounded-md text-slate-600 font-bold">
                             <Calendar size={10} /> {new Date(item.borrowDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] bg-red-600 px-2 py-0.5 rounded-md text-white font-bold">
                             <Clock size={10} /> Trễ {calculateOverdueDays(item.dueDate)} ngày
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )) : (
              <div className="py-20 text-center text-slate-300 italic">Không có độc giả quá hạn tại thời điểm này. 🥳</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianReports;
