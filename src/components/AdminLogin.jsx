import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dbData from '../database.json';
import './Admin.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mô phỏng độ trễ xác thực
    setTimeout(() => {
      const adminUser = dbData.users.find(
        (u) => u.email === form.email && u.password === form.password && u.role === 'admin'
      );

      if (adminUser) {
        // Lưu phiên đăng nhập vào localStorage
        localStorage.setItem('adminSession', JSON.stringify({ id: adminUser.id, name: adminUser.name, email: adminUser.email }));
        navigate('/admin/dashboard');
      } else {
        setError('Email hoặc mật khẩu không đúng, hoặc tài khoản không có quyền Admin.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        {/* Logo / Header */}
        <div className="admin-login-header">
          <div className="admin-login-icon">📚</div>
          <h1 className="admin-login-title">Trang Quản Trị</h1>
          <p className="admin-login-subtitle">Đăng nhập với tài khoản Admin</p>
        </div>

        {/* Gợi ý tài khoản demo */}
        <div className="admin-demo-hint">
          <strong>Tài khoản demo:</strong><br />
          Email: <code>admin@bookstore.vn</code><br />
          Mật khẩu: <code>admin123</code>
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@bookstore.vn"
              required
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Mật khẩu</label>
            <input
              id="admin-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu..."
              required
              className="admin-input"
            />
          </div>

          {error && <div className="admin-error-msg">{error}</div>}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="admin-back-link">
          <a href="/">← Quay về Trang Chủ</a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
