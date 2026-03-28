import React, { useState } from 'react'
import { Nav, Navbar, NavLink } from 'react-bootstrap'
import { FaSearch, FaUser, FaTimes, FaHome, FaList, FaQuestion, FaExchangeAlt } from 'react-icons/fa';

function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  return (
    <div>
      <Navbar bg="light" expand="lg" variant="light" className="container">
        <Navbar.Brand href="#home">LOGO</Navbar.Brand>
        <Nav className="me-auto my-2 my-lg-0 ms-3" >
          <NavLink href="#home">Trang chủ</NavLink>
          <NavLink href="#features">Danh sách</NavLink>
          <NavLink href="#pricing">Liên hệ</NavLink>
        </Nav>
        <div className="d-flex align-items-center gap-4">
          <span
            style={{ fontSize: '1.8rem', color: '#454545', background: '#ffffff', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => setShowSearch(true)}
          >
            <FaSearch />
          </span>
          <span
            style={{ fontSize: '1.8rem', color: '#454545', background: '#ffffff', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => setShowAccount(true)}
          >
            <FaUser />
          </span>
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
              <div className="custom-account-item"><FaUser style={{marginRight:8}}/> Đăng nhập</div>
              <div className="custom-account-divider" />
              <div className="custom-account-item"><FaHome style={{marginRight:8}}/> Trang Chủ</div>
              <div className="custom-account-item"><FaList style={{marginRight:8}}/> Danh Sách</div>
              <div className="custom-account-item"><FaQuestion style={{marginRight:8}}/> Liên Hệ</div>
              <div className="custom-account-item"><FaExchangeAlt style={{marginRight:8}}/> Chuyển Đổi Giao Diện</div>
              <div className="custom-account-divider" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header