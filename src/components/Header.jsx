import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaSearch, FaUser, FaTimes, FaShoppingCart, FaSun, FaMoon } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { getBooks, publishers } from '../bookStore';
import dbData from '../database.json';
import './Header.css';

function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Lấy danh sách gợi ý tìm kiếm
  const suggestions = useMemo(() => {
    if (!searchValue.trim()) return [];
    const query = searchValue.trim().toLowerCase();
    const books = getBooks();

    const matched = books.filter(b => {
      const pub = publishers.find(p => p.id === b.publisher_id);
      const pubName = pub ? pub.name.toLowerCase() : '';
      return b.title.toLowerCase().includes(query) ||
        (b.author && b.author.toLowerCase().includes(query)) ||
        pubName.includes(query);
    });

    return matched.slice(0, 5); // Chỉ lấy 5 kết quả đầu
  }, [searchValue]);

  // Đóng gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cập nhật số lượng giỏ hàng khi localStorage thay đổi
  const syncCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((s, i) => s + (i.qty || 1), 0));
    } catch { setCartCount(0); }
  };

  useEffect(() => {
    syncCartCount();
    window.addEventListener('cartUpdated', syncCartCount);
    window.addEventListener('storage', syncCartCount);
    return () => {
      window.removeEventListener('cartUpdated', syncCartCount);
      window.removeEventListener('storage', syncCartCount);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setShowSuggestions(false);
      navigate(`/category?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleSuggestionClick = (bookId) => {
    setShowSuggestions(false);
    navigate(`/product/${bookId}`);
    setSearchValue('');
  };

  return (
    <div className="header-container">
      {/* Top Header Row */}
      <div className="header-top">
        <Link to="/" className="brand-logo">
          Bán Sách
        </Link>

        <div className="search-bar-container" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <input
              className="search-input"
              type="text"
              placeholder="Tìm kiếm sách, tác giả, nhà xuất bản..."
              value={searchValue}
              onChange={e => {
                setSearchValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <button type="submit" className="search-btn">
              <FaSearch size={18} />
            </button>
          </form>

          {/* Hộp gợi ý tìm kiếm */}
          {showSuggestions && searchValue.trim() && (
            <div className="search-suggestions">
              {suggestions.length > 0 ? (
                <ul className="suggestion-list">
                  {suggestions.map((book) => (
                    <li key={book.id} onClick={() => handleSuggestionClick(book.id)}>
                      {book.image ? (
                        <img src={book.image} alt={book.title} className="suggestion-image" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                      ) : null}
                      <div className="suggestion-info">
                        <span className="suggestion-title">{book.title}</span>
                        {book.author && <span className="suggestion-author"> - {book.author}</span>}
                      </div>
                    </li>
                  ))}
                  <li className="suggestion-view-all" onClick={handleSearch}>
                    Xem tất cả kết quả cho "{searchValue}"
                  </li>
                </ul>
              ) : (
                <div className="suggestion-empty">Không tìm thấy sách phù hợp</div>
              )}
            </div>
          )}
        </div>

        <div className="header-actions">
          <Link to="/cart" className="action-icon-wrapper" title="Giỏ hàng" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaShoppingCart size={20} />
            <span className="cart-badge">{cartCount}</span>
          </Link>
          <div
            className="action-icon-wrapper"
            title="Tài khoản"
            onClick={() => setShowAccount(true)}
          >
            <FaUser size={20} />
          </div>
        </div>
      </div>

      {/* Bottom Category Navbar */}
      <div className="header-bottom">
        <Navbar expand="lg" className="nav-container py-0">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto main-nav">
              <Nav.Link as={Link} to="/" className="nav-link-custom">Trang chủ</Nav.Link>
              <Nav.Link as={Link} to="/category" className="nav-link-custom">Danh mục</Nav.Link>

              <NavDropdown title="Thể loại" id="basic-nav-dropdown" className="category-dropdown">
                <NavDropdown.Item as={Link} to="/category/sach-mam-non">Sách mầm non</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/sach-thieu-nhi">Sách thiếu nhi</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/sach-ki-nang">Sách kĩ năng</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/sach-kinh-doanh">Sách kinh doanh</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/sach-me-va-be">Sách mẹ và bé</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/sach-van-hoc">Sách văn học</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/sach-tham-khao">Sách tham khảo</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/category/notebook">Notebook</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/truyen">Truyện</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/manga">Manga</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/category/top-best-seller" style={{ color: '#ff6b6b', fontWeight: '600' }}>Top best seller</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/sach-moi" style={{ color: '#20c997', fontWeight: '600' }}>Sách mới</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/sach-sap-phat-hanh" style={{ color: '#339af0', fontWeight: '600' }}>Sách sắp phát hành</NavDropdown.Item>
              </NavDropdown>

              {/* Extras links if needed in future */}
              <Nav.Link as={Link} to="/contact" className="nav-link-custom">Liên hệ</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      {/* Modals for Account, Login, SignUp */}
      {showAccount && (
        <div className="custom-modal-overlay" onClick={() => setShowAccount(false)}>
          <div className="custom-modal-box" onClick={e => e.stopPropagation()}>
            <div className="custom-modal-header">
              <span>Tính Năng Tài Khoản</span>
              <FaTimes className="close-btn" onClick={() => setShowAccount(false)} />
            </div>
            <div className="custom-modal-body" style={{ padding: '10px 0' }}>
              <div className="dropdown-item" style={{ padding: '12px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border-color, #eee)' }} onClick={() => { setShowAccount(false); setShowLogin(true); }}>
                <FaUser style={{ marginRight: 10, color: '#007bff' }} /> Đăng nhập
              </div>
              <div className="dropdown-item" style={{ padding: '12px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border-color, #eee)' }} onClick={() => { setShowAccount(false); setShowSignUp(true); }}>
                <FaUser style={{ marginRight: 10, color: '#28a745' }} /> Đăng ký
              </div>
              <div
                className="dropdown-item"
                style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                onClick={() => { setIsDarkMode(!isDarkMode); setShowAccount(false); }}
              >
                {isDarkMode ? <FaSun style={{ marginRight: 10, color: '#f39c12' }} /> : <FaMoon style={{ marginRight: 10, color: '#666' }} />}
                {isDarkMode ? 'Giao diện sáng' : 'Giao diện tối'}
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="custom-modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="custom-modal-box" onClick={e => e.stopPropagation()}>
            <div className="custom-modal-header">
              <span>Đăng Nhập</span>
              <FaTimes className="close-btn" onClick={() => setShowLogin(false)} />
            </div>
            <div className="custom-modal-body">
              <input
                type="email"
                placeholder="Email"
                className="modal-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="modal-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p style={{ color: '#dc3545', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
              <button
                className="modal-btn modal-btn-primary"
                onClick={async () => {
                  try {
                    // Kiểm tra tài khoản admin local trước
                    const adminUser = dbData.users?.find(
                      (u) => u.email === email && u.password === password && u.role === 'admin'
                    );
                    if (adminUser) {
                      localStorage.setItem('adminSession', JSON.stringify({ id: adminUser.id, name: adminUser.name, email: adminUser.email }));
                      setShowLogin(false);
                      setEmail('');
                      setPassword('');
                      setError('');
                      navigate('/admin/dashboard');
                      return;
                    }
                    // Nếu không phải admin, đăng nhập Firebase bình thường
                    await signInWithEmailAndPassword(auth, email, password);
                    setShowLogin(false);
                    setEmail('');
                    setPassword('');
                    setError('');
                  } catch (err) {
                    setError('Đăng nhập thất bại: ' + err.message);
                  }
                }}
              >
                Đăng Nhập
              </button>
              <div style={{ margin: '15px 0', textAlign: 'center', color: '#888', fontSize: '14px' }}>hoặc</div>
              <button
                className="modal-btn modal-btn-google"
                onClick={async () => {
                  try {
                    await signInWithPopup(auth, provider);
                    setShowLogin(false);
                    setEmail('');
                    setPassword('');
                    setError('');
                  } catch (err) {
                    setError('Đăng nhập với Google thất bại: ' + err.message);
                  }
                }}
              >
                Đăng Nhập với Google
              </button>
              <div className="auth-switch">
                Không có tài khoản? <span onClick={() => { setShowLogin(false); setShowSignUp(true); }}>Đăng ký ngay</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSignUp && (
        <div className="custom-modal-overlay" onClick={() => setShowSignUp(false)}>
          <div className="custom-modal-box" onClick={e => e.stopPropagation()}>
            <div className="custom-modal-header">
              <span>Đăng Ký Tài Khoản</span>
              <FaTimes className="close-btn" onClick={() => setShowSignUp(false)} />
            </div>
            <div className="custom-modal-body">
              <input
                type="email"
                placeholder="Email"
                className="modal-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Mật khẩu (ít nhất 6 ký tự)"
                className="modal-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p style={{ color: '#dc3545', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
              <button
                className="modal-btn modal-btn-primary"
                style={{ backgroundColor: '#28a745' }}
                onClick={async () => {
                  try {
                    await createUserWithEmailAndPassword(auth, email, password);
                    setShowSignUp(false);
                    setEmail('');
                    setPassword('');
                    setError('');
                  } catch (err) {
                    setError('Đăng ký thất bại: ' + err.message);
                  }
                }}
              >
                Đăng Ký
              </button>
              <div style={{ margin: '15px 0', textAlign: 'center', color: '#888', fontSize: '14px' }}>hoặc đăng ký bằng</div>
              <button
                className="modal-btn modal-btn-google"
                onClick={async () => {
                  try {
                    await signInWithPopup(auth, provider);
                    setShowSignUp(false);
                    setEmail('');
                    setPassword('');
                    setError('');
                  } catch (err) {
                    setError('Đăng ký với Google thất bại: ' + err.message);
                  }
                }}
              >
                Đăng Ký với Google
              </button>
              <div className="auth-switch">
                Đã có tài khoản? <span onClick={() => { setShowSignUp(false); setShowLogin(true); }}>Đăng nhập</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;