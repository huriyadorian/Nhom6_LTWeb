import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dbData from '../database.json';
import './Admin.css';

// ==================== Khởi tạo dữ liệu từ localStorage hoặc database.json ====================
const initBooks = () => {
  const stored = localStorage.getItem('adminBooks');
  return stored ? JSON.parse(stored) : dbData.books;
};

const saveBooks = (books) => {
  localStorage.setItem('adminBooks', JSON.stringify(books));
};

// ==================== Modal Thêm / Sửa Sản Phẩm ====================
const EMPTY_FORM = {
  title: '', author: '', publisher_id: 1, category_id: 1,
  oldPrice: '', discount: '', stock: '',
  image: '', description: '', pages: '', year: new Date().getFullYear(),
  isNew: false, isBestSeller: false, isComingSoon: false,
};

function ProductModal({ book, onClose, onSave, categories, publishers }) {
  const [form, setForm] = useState(book ? {
    ...book,
    oldPrice: book.oldPrice,
    discount: book.discount,
    stock: book.stock,
    pages: book.pages,
    year: book.year,
  } : { ...EMPTY_FORM });

  // Tự động tính giá mới khi giá gốc hoặc % giảm thay đổi
  const newPrice = form.oldPrice && form.discount
    ? Math.round(Number(form.oldPrice) * (1 - Number(form.discount) / 100))
    : '';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.oldPrice || !form.discount || !form.stock) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return;
    }
    onSave({
      ...form,
      id: book ? book.id : Date.now(),
      oldPrice: Number(form.oldPrice),
      discount: Number(form.discount),
      newPrice: Number(newPrice),
      stock: Number(form.stock),
      pages: Number(form.pages) || 0,
      year: Number(form.year) || new Date().getFullYear(),
      publisher_id: Number(form.publisher_id),
      category_id: Number(form.category_id),
      rating: book ? book.rating : 0,
      sold: book ? book.sold : 0,
    });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>{book ? '✏️ Sửa Sản Phẩm' : '➕ Thêm Sản Phẩm Mới'}</h2>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-product-form">
          {/* Hàng 1: Tên + Tác giả */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Tên sách *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Tên sách..." className="admin-input" required />
            </div>
            <div className="admin-form-group">
              <label>Tác giả</label>
              <input name="author" value={form.author || ''} onChange={handleChange} placeholder="Tác giả..." className="admin-input" />
            </div>
          </div>

          {/* Hàng 2: Danh mục + NXB */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Danh mục *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className="admin-input">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Nhà xuất bản *</label>
              <select name="publisher_id" value={form.publisher_id} onChange={handleChange} className="admin-input">
                {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          {/* Hàng 3: Giá gốc + % giảm + Giá sau giảm */}
          <div className="admin-form-row admin-price-row">
            <div className="admin-form-group">
              <label>Giá gốc (đ) *</label>
              <input name="oldPrice" type="number" value={form.oldPrice} onChange={handleChange} placeholder="vd: 120000" className="admin-input" min="0" required />
            </div>
            <div className="admin-form-group">
              <label>Giảm giá (%) *</label>
              <input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="vd: 20" className="admin-input" min="0" max="100" required />
            </div>
            <div className="admin-form-group">
              <label>Giá sau giảm (tự động)</label>
              <input value={newPrice ? newPrice.toLocaleString('vi-VN') + 'đ' : ''} readOnly className="admin-input admin-input-readonly" placeholder="Tự tính..." />
            </div>
          </div>

          {/* Hàng 4: Số lượng + Số trang + Năm */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Số lượng tồn kho *</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="vd: 50" className="admin-input" min="0" required />
            </div>
            <div className="admin-form-group">
              <label>Số trang</label>
              <input name="pages" type="number" value={form.pages || ''} onChange={handleChange} placeholder="vd: 200" className="admin-input" min="0" />
            </div>
            <div className="admin-form-group">
              <label>Năm xuất bản</label>
              <input name="year" type="number" value={form.year} onChange={handleChange} className="admin-input" min="1900" />
            </div>
          </div>

          {/* URL Hình ảnh */}
          <div className="admin-form-group admin-form-full">
            <label>URL Hình ảnh</label>
            <input name="image" value={form.image || ''} onChange={handleChange} placeholder="https://... hoặc /images/books/..." className="admin-input" />
            {form.image && (
              <div className="admin-img-preview">
                <img 
                  key={form.image}
                  src={form.image} 
                  alt="Preview" 
                  onLoad={e => e.target.style.display='block'}
                  onError={e => e.target.style.display='none'} 
                />
              </div>
            )}
          </div>

          {/* Mô tả */}
          <div className="admin-form-group admin-form-full">
            <label>Mô tả</label>
            <textarea name="description" value={form.description || ''} onChange={handleChange} rows={3} placeholder="Mô tả sách..." className="admin-input admin-textarea" />
          </div>

          {/* Checkboxes */}
          <div className="admin-checkbox-row">
            <label className="admin-checkbox-label">
              <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} />
              Sách mới
            </label>
            <label className="admin-checkbox-label">
              <input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={handleChange} />
              Bán chạy
            </label>
            <label className="admin-checkbox-label">
              <input type="checkbox" name="isComingSoon" checked={form.isComingSoon} onChange={handleChange} />
              Sắp phát hành
            </label>
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="admin-btn admin-btn-save">
              {book ? '💾 Lưu thay đổi' : '➕ Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== Dashboard chính ====================
function AdminDashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState(initBooks());
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Kiểm tra đăng nhập
  const session = JSON.parse(localStorage.getItem('adminSession') || 'null');
  useEffect(() => {
    if (!session) navigate('/');
  }, [session, navigate]);

  // Lưu khi danh sách sách thay đổi
  useEffect(() => {
    saveBooks(books);
  }, [books]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  // Lọc sách theo tìm kiếm và danh mục
  const filteredBooks = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.author || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || b.category_id === Number(filterCat);
    return matchSearch && matchCat;
  });

  const handleSave = (bookData) => {
    if (editBook) {
      setBooks(prev => prev.map(b => b.id === bookData.id ? bookData : b));
    } else {
      setBooks(prev => [...prev, bookData]);
    }
    setShowModal(false);
    setEditBook(null);
  };

  const handleDelete = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    setDeleteConfirm(null);
  };

  const openAdd = () => { setEditBook(null); setShowModal(true); };
  const openEdit = (book) => { setEditBook(book); setShowModal(true); };

  const getCatName = (id) => dbData.categories.find(c => c.id === id)?.name || '—';
  const getPubName = (id) => dbData.publishers.find(p => p.id === id)?.name || '—';

  return (
    <div className="admin-dashboard">
      {/* Thanh topbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <span className="admin-logo">📚 BookStore</span>
          <span className="admin-topbar-title">Quản Trị Sản Phẩm</span>
        </div>
        <div className="admin-topbar-right">
          <span className="admin-user-badge">👤 {session?.name}</span>
          <button className="admin-btn admin-btn-logout" onClick={handleLogout}>Đăng xuất</button>
          <a href="/" className="admin-btn admin-btn-home">🏠 Trang chủ</a>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="admin-main">
        {/* Thanh công cụ */}
        <div className="admin-toolbar">
          <div className="admin-toolbar-left">
            <input
              type="text"
              placeholder="🔍 Tìm theo tên sách, tác giả..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="admin-search-input"
            />
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="admin-select">
              <option value="all">Tất cả danh mục</option>
              {dbData.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button className="admin-btn admin-btn-add" onClick={openAdd}>
            ➕ Thêm Sản Phẩm
          </button>
        </div>

        {/* Thống kê nhanh */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <div className="admin-stat-number">{books.length}</div>
            <div className="admin-stat-label">Tổng sản phẩm</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-number">{books.filter(b => b.stock > 0).length}</div>
            <div className="admin-stat-label">Còn hàng</div>
          </div>
          <div className="admin-stat-card admin-stat-warn">
            <div className="admin-stat-number">{books.filter(b => b.stock === 0).length}</div>
            <div className="admin-stat-label">Hết hàng</div>
          </div>
          <div className="admin-stat-card admin-stat-green">
            <div className="admin-stat-number">{books.filter(b => b.isBestSeller).length}</div>
            <div className="admin-stat-label">Bán chạy</div>
          </div>
        </div>

        {/* Bảng sản phẩm */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{width: 50}}>#</th>
                <th style={{width: 60}}>Ảnh</th>
                <th>Tên sách</th>
                <th>Danh mục</th>
                <th>NXB</th>
                <th>Giá gốc</th>
                <th>Giảm</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th style={{width: 120}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr><td colSpan={10} className="admin-empty">Không tìm thấy sản phẩm nào.</td></tr>
              ) : filteredBooks.map((book, idx) => (
                <tr key={book.id} className={book.stock === 0 ? 'admin-row-out' : ''}>
                  <td className="admin-td-center">{idx + 1}</td>
                  <td className="admin-td-center">
                    {book.image ? (
                      <img 
                        key={book.image}
                        src={book.image} 
                        alt={book.title} 
                        className="admin-book-thumb"
                        onLoad={e => e.target.style.display='block'}
                        onError={e => { e.target.onerror=null; e.target.src=''; e.target.style.display='none'; }} 
                      />
                    ) : <span className="admin-no-img">—</span>}
                  </td>
                  <td>
                    <div className="admin-book-name">{book.title}</div>
                    <div className="admin-book-author">{book.author || '—'}</div>
                    <div className="admin-tag-row">
                      {book.isNew && <span className="admin-tag admin-tag-new">Mới</span>}
                      {book.isBestSeller && <span className="admin-tag admin-tag-hot">Hot</span>}
                      {book.isComingSoon && <span className="admin-tag admin-tag-soon">Sắp ra</span>}
                    </div>
                  </td>
                  <td>{getCatName(book.category_id)}</td>
                  <td>{getPubName(book.publisher_id)}</td>
                  <td><s className="admin-old-price">{book.oldPrice.toLocaleString('vi-VN')}đ</s></td>
                  <td><span className="admin-discount-badge">-{book.discount}%</span></td>
                  <td><strong className="admin-new-price">{book.newPrice.toLocaleString('vi-VN')}đ</strong></td>
                  <td>
                    <span className={book.stock === 0 ? 'admin-stock-out' : 'admin-stock-ok'}>
                      {book.stock === 0 ? 'Hết hàng' : book.stock}
                    </span>
                  </td>
                  <td className="admin-td-actions">
                    <button className="admin-btn-icon admin-btn-edit" title="Sửa" onClick={() => openEdit(book)}>✏️</button>
                    <button className="admin-btn-icon admin-btn-delete" title="Xóa" onClick={() => setDeleteConfirm(book)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-table-footer">Hiển thị {filteredBooks.length} / {books.length} sản phẩm</div>
      </main>

      {/* Modal thêm/sửa */}
      {showModal && (
        <ProductModal
          book={editBook}
          onClose={() => { setShowModal(false); setEditBook(null); }}
          onSave={handleSave}
          categories={dbData.categories}
          publishers={dbData.publishers}
        />
      )}

      {/* Xác nhận xóa */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-confirm-box" onClick={e => e.stopPropagation()}>
            <h3>🗑️ Xác nhận xóa</h3>
            <p>Bạn có chắc muốn xóa sản phẩm <strong>"{deleteConfirm.title}"</strong> không? Hành động này không thể hoàn tác.</p>
            <div className="admin-confirm-actions">
              <button className="admin-btn admin-btn-cancel" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
