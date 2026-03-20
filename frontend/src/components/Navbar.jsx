import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Library, LogOut, User, Menu, X, ChevronDown, BookOpen, Users, ArrowLeftRight, PieChart } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || '{}')
  });

  useEffect(() => {
    const updateAuth = () => {
      setAuth({
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || '{}')
      });
    };
    window.addEventListener('storage', updateAuth);
    const interval = setInterval(updateAuth, 1000); 
    return () => {
      window.removeEventListener('storage', updateAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: {} });
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-[1001]">
      <div className="container mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 decoration-transparent group">
          <div className="bg-primary-50 p-2 rounded-xl group-hover:bg-primary-100 transition-colors">
            <Library size={28} className="text-primary-600" />
          </div>
          <span className="text-2xl font-black text-slate-800 font-outfit tracking-tight">VibeLib</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`font-semibold transition-colors ${location.pathname==='/' ? 'text-primary-600' : 'text-slate-500 hover:text-primary-600'}`}>Tra cứu</Link>
          
          {auth.token ? (
            <>
              {auth.user.role === 'ADMIN' && (
                <Link to="/admin/librarians" className={`font-semibold transition-colors ${isActive('/admin') ? 'text-primary-600' : 'text-slate-500 hover:text-primary-600'}`}>Thủ thư</Link>
              )}
              
              {/* Dropdown Nghiệp vụ */}
              {auth.user.role === 'LIBRARIAN' && (
                <div className="relative group">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    className={`flex items-center gap-1 font-semibold transition-colors ${isActive('/librarian') ? 'text-primary-600' : 'text-slate-500 hover:text-primary-600'}`}
                  >
                    Nghiệp vụ <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div 
                    onMouseLeave={() => setIsDropdownOpen(false)}
                    className={`absolute top-full left-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 transition-all duration-300 origin-top transform ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                  >
                    <Link to="/librarian/books" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700">
                      <BookOpen size={18} className="text-primary-600"/> Quản lý Kho sách
                    </Link>
                    <Link to="/librarian/readers" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700">
                      <Users size={18} className="text-primary-600"/> Quản lý Độc giả
                    </Link>
                    <Link to="/librarian/borrow-return" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 text-sm font-black text-primary-700">
                      <ArrowLeftRight size={18} className="text-primary-600"/> Mượn & Trả sách
                    </Link>
                    <Link to="/librarian/reports" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700">
                      <PieChart size={18} className="text-primary-600"/> Báo cáo Thống kê
                    </Link>
                  </div>
                </div>
              )}
              
              <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
              
              <div className="flex items-center gap-3 pl-4">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-bold text-slate-800">{auth.user.fullName}</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{auth.user.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="bg-primary-600 px-6 py-2.5 rounded-xl text-white font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 active:scale-95 transition-all">
              Nhân viên
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-2 overflow-auto max-h-[80vh]">
          <Link to="/" className="text-lg font-bold py-3 border-b border-slate-50 font-outfit" onClick={() => setIsOpen(false)}>🏠 Tra cứu</Link>
          {auth.token ? (
            <>
              {auth.user.role === 'ADMIN' && <Link to="/admin/librarians" className="text-lg font-bold py-3 border-b border-slate-50 font-outfit" onClick={() => setIsOpen(false)}>👮 Quản lý Thủ thư</Link>}
              {auth.user.role === 'LIBRARIAN' && (
                <>
                  <Link to="/librarian/books" className="text-lg font-bold py-3 border-b border-slate-50 font-outfit" onClick={() => setIsOpen(false)}>📚 Quản lý Kho sách</Link>
                  <Link to="/librarian/readers" className="text-lg font-bold py-3 border-b border-slate-50 font-outfit" onClick={() => setIsOpen(false)}>👥 Quản lý Độc giả</Link>
                  <Link to="/librarian/borrow-return" className="text-lg font-black py-3 border-b border-slate-50 text-primary-600 font-outfit" onClick={() => setIsOpen(false)}>🔄 Mượn & Trả sách</Link>
                  <Link to="/librarian/reports" className="text-lg font-bold py-3 border-b border-slate-50 font-outfit" onClick={() => setIsOpen(false)}>📊 Thống kê</Link>
                </>
              )}
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold py-6 text-lg">
                <LogOut size={20} /> Đăng xuất ({auth.user.fullName})
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-primary-600 text-center py-4 rounded-xl text-white font-bold shadow-lg" onClick={() => setIsOpen(false)}>Đăng nhập</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
