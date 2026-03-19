import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import RoleRoute from './components/RoleRoute';
import AdminLibrarians from './pages/AdminLibrarians';
import LibrarianReaders from './pages/LibrarianReaders';
import LibrarianBooks from './pages/LibrarianBooks';
import LibrarianBorrow from './pages/LibrarianBorrow';
import LibrarianReports from './pages/LibrarianReports';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="font-sans antialiased text-slate-900 pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/login" element={<Login />} />

            {/* Admin cụm */}
            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/librarians" element={<AdminLibrarians />} />
            </Route>

            {/* Librarian cụm */}
            <Route element={<RoleRoute allowedRoles={['LIBRARIAN', 'ADMIN']} />}>
              <Route path="/librarian/books" element={<LibrarianBooks />} />
              <Route path="/librarian/readers" element={<LibrarianReaders />} />
              <Route path="/librarian/borrow-return" element={<LibrarianBorrow />} />
              <Route path="/librarian/reports" element={<LibrarianReports />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
      
      <ToastContainer position="top-right" theme="colored" autoClose={3000} />
    </>
  );
}

export default App;
