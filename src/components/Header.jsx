import React, { useState } from 'react'
import { Nav, Navbar, NavLink } from 'react-bootstrap'
import { FaSearch, FaUser, FaTimes, FaHome, FaList, FaQuestion, FaExchangeAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../firebase';

function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  return (
    <div>
      <Navbar bg="dark" expand="lg" variant="dark" style={{ backgroundColor: 'rgba(35,35,41,0.95)', width: '100%', margin: 0, padding: 0 }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 88px', minHeight: 64 }}>
          <Navbar.Brand href="/">LOGO</Navbar.Brand>
          <Nav className="me-auto my-2 my-lg-0 ms-3" >
            <NavLink as={Link} to="/" className="custom-nav-link">TRANG CHỦ</NavLink>
            <NavLink as={Link} to="/list" className="custom-nav-link">DANH SÁCH</NavLink>
            <NavLink as={Link} to="/contact" className="custom-nav-link">LIÊN HỆ</NavLink>
          </Nav>
          <div className="d-flex align-items-center gap-4">
            <span
              className="custom-navbar-icon"
              onClick={() => setShowSearch(true)}
            >
              <FaSearch />
            </span>
            <span
              className="custom-navbar-icon"
              onClick={() => setShowAccount(true)}
            >
              <FaUser />
            </span>
          </div>
        </div>
      </Navbar>
      {showSearch && (
        <div className="custom-search-modal">
          <div className="custom-search-box">
            <input
              className="custom-search-input"
              type="text"
              placeholder="Nhập từ khóa"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              autoFocus
            />
            <span className="custom-search-close" onClick={() => setShowSearch(false)}>
              <FaTimes />
            </span>
            <div className="custom-search-divider" />
            <div className="custom-search-result">Không Tìm Thấy Kết Quả...</div>
          </div>
        </div>
      )}
      {showAccount && (
        <div className="custom-search-modal">
          <div className="custom-account-box">
            <div className="custom-account-header">
              <span>Tính Năng Tài Khoản</span>
              <span className="custom-search-close" onClick={() => setShowAccount(false)}><FaTimes /></span>
            </div>
            <div className="custom-account-list">
              <div className="custom-account-item" onClick={() => { setShowAccount(false); setShowLogin(true); }}><FaUser style={{marginRight:8}}/> Đăng nhập</div>
              <div className="custom-account-item" onClick={() => { setShowAccount(false); setShowSignUp(true); }}><FaUser style={{marginRight:8}}/> Đăng ký</div>
              <div className="custom-account-divider" />
              <div className="custom-account-item" onClick={() => { navigate('/'); setShowAccount(false); }}><FaHome style={{marginRight:8}}/> Trang Chủ</div>
              <div className="custom-account-item" onClick={() => { navigate('/list'); setShowAccount(false); }}><FaList style={{marginRight:8}}/> Danh Sách</div>
              <div className="custom-account-item" onClick={() => { navigate('/contact'); setShowAccount(false); }}><FaQuestion style={{marginRight:8}}/> Liên Hệ</div>
              <div className="custom-account-item"><FaExchangeAlt style={{marginRight:8}}/> Chuyển Đổi Giao Diện</div>
              <div className="custom-account-divider" />
            </div>
          </div>
        </div>
      )}
      {showLogin && (
        <div className="custom-search-modal">
          <div className="custom-account-box custom-login-box">
            <div className="custom-account-header">
              <span>Đăng Nhập</span>
              <span className="custom-search-close" onClick={() => setShowLogin(false)}><FaTimes /></span>
            </div>
            <div style={{ padding: '15px' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button
                onClick={async () => {
                  try {
                    await signInWithEmailAndPassword(auth, email, password);
                    setShowLogin(false);
                    setEmail('');
                    setPassword('');
                    setError('');
                  } catch (err) {
                    setError('Đăng nhập thất bại: ' + err.message);
                  }
                }}
                style={{ width: '100%', padding: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Đăng Nhập
              </button>
              <div style={{ margin: '8px 0', textAlign: 'center' }}>hoặc</div>
              <button
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
                style={{ width: '100%', padding: '8px', backgroundColor: '#db4437', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Đăng Nhập với Google
              </button>
              <div style={{ margin: '8px 0', textAlign: 'center', cursor: 'pointer', color: '#007bff' }} onClick={() => { setShowLogin(false); setShowSignUp(true); }}>không có tài khoản ? Đăng ký</div>
            </div>
          </div>
        </div>
      )}
      {showSignUp && (
        <div className="custom-search-modal">
          <div className="custom-account-box custom-login-box">
            <div className="custom-account-header">
              <span>Đăng Ký</span>
              <span className="custom-search-close" onClick={() => setShowSignUp(false)}><FaTimes /></span>
            </div>
            <div style={{ padding: '15px' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button
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
                style={{ width: '100%', padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Đăng Ký
              </button>
              <div style={{ margin: '8px 0', textAlign: 'center' }}>hoặc</div>
              <button
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
                style={{ width: '100%', padding: '8px', backgroundColor: '#db4437', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Đăng Ký với Google
              </button>
              <div style={{ margin: '8px 0', textAlign: 'center', cursor: 'pointer', color: '#007bff' }} onClick={() => { setShowSignUp(false); setShowLogin(true); }}>đã có tài khoản ? Đăng nhập</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header