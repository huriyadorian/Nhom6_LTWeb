import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaAngleRight, FaFacebook } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Khối 1: Thông tin liên hệ */}
        <div className="footer-col">
          <h3 className="footer-title">THÔNG TIN LIÊN HỆ</h3>
          <ul className="footer-links contact-info">
            <li>
              <FaPhoneAlt className="footer-icon" />
              <span>Hotline: <span className="highlight-text">[035xxxxxxx]</span></span>
            </li>
            <li>
              <FaEnvelope className="footer-icon" />
              <span>Email: <span className="highlight-text">[XXX@gmail.com]</span></span>
            </li>
            <li>
              <FaMapMarkerAlt className="footer-icon" />
              <span>Địa chỉ: [Điền địa chỉ sau]</span>
            </li>
          </ul>

          <div className="footer-socials" style={{ marginTop: '20px' }}>
            <a href="[Điền link Facebook sau]" target="_blank" rel="noopener noreferrer" className="social-link facebook-link">
              <FaFacebook size={28} />
            </a>
          </div>
        </div>

        {/* Khối 2: Danh mục sản phẩm phổ biến */}
        <div className="footer-col">
          <h3 className="footer-title">DANH MỤC PHỔ BIẾN</h3>
          <ul className="footer-links">
            <li><Link to="/category/sach-moi" style={{ color: 'inherit', textDecoration: 'none' }}><FaAngleRight className="footer-bullet" /> Sản phẩm mới về</Link></li>
            <li><Link to="/category/top-best-seller" style={{ color: 'inherit', textDecoration: 'none' }}><FaAngleRight className="footer-bullet" /> Sản phẩm bán chạy</Link></li>
            <li><Link to="/category/khuyen-mai" style={{ color: 'inherit', textDecoration: 'none' }}><FaAngleRight className="footer-bullet" /> Khuyến mãi</Link></li>
          </ul>
        </div>

        {/* Khối 3: Hỗ trợ khách hàng */}
        <div className="footer-col">
          <h3 className="footer-title">HỖ TRỢ KHÁCH HÀNG</h3>
          <ul className="footer-links">
            <li><Link to="/policy/huong-dan-mua-hang" style={{ color: 'inherit', textDecoration: 'none' }}><FaAngleRight className="footer-bullet" /> Hướng dẫn mua hàng</Link></li>
            <li><Link to="/cart" style={{ color: 'inherit', textDecoration: 'none' }}><FaAngleRight className="footer-bullet" /> Kiểm tra đơn hàng</Link></li>
            <li><Link to="/policy/chinh-sach-doi-tra" style={{ color: 'inherit', textDecoration: 'none' }}><FaAngleRight className="footer-bullet" /> Chính sách đổi trả</Link></li>
          </ul>
        </div>
      </div>

      {/* Phần bản quyền */}
      <div className="footer-bottom">
        <p>© 2026 Bản quyền thuộc về Nhà Sách Online.</p>
      </div>
    </footer>
  );
}

export default Footer;
