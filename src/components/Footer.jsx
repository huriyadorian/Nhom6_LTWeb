import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { 
    FiFacebook, 
    FiTwitter, 
    FiInstagram, 
    FiYoutube, 
    FiMapPin, 
    FiPhone, 
    FiMail, 
    FiBookOpen,
    FiSend
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-section mt-5">
            <div className="footer-top py-5 bg-white border-top">
                <Container>
                    <Row className="gy-4">
                        {/* Company Info */}
                        <Col lg={4} md={6}>
                            <div className="footer-logo mb-4">
                                <Link to="/" className="logo text-decoration-none">
                                    <FiBookOpen size={32} className="text-primary" />
                                    <span className="ms-2 fw-bold fs-4 text-dark">BOOK<span className="text-primary">STORE</span></span>
                                </Link>
                            </div>
                            <p className="text-muted mb-4 pe-lg-4">
                                Khởi nguồn tri thức, kết nối đam mê. Chúng tôi tự hào là đơn vị cung cấp sách hàng đầu với sứ mệnh mang văn hóa đọc đến mọi nhà.
                            </p>
                            <div className="social-links d-flex gap-3">
                                <a href="#!" className="social-icon"><FiFacebook /></a>
                                <a href="#!" className="social-icon"><FiTwitter /></a>
                                <a href="#!" className="social-icon"><FiInstagram /></a>
                                <a href="#!" className="social-icon"><FiYoutube /></a>
                            </div>
                        </Col>

                        {/* Quick Links */}
                        <Col lg={2} md={6}>
                            <h5 className="fw-bold mb-4">Danh Mục</h5>
                            <ul className="list-unstyled footer-links">
                                <li><Link to="/category/sach_moi">Sách Mới</Link></li>
                                <li><Link to="/category/top_best_seller">Bán Chạy Nhất</Link></li>
                                <li><Link to="/category/sach_thieu_nhi">Sách Thiếu Nhi</Link></li>
                                <li><Link to="/category/sach_kinh_doanh">Sách Kinh Doanh</Link></li>
                                <li><Link to="/shop">Tất Cả Danh Mục</Link></li>
                            </ul>
                        </Col>

                        {/* Customer Service */}
                        <Col lg={2} md={6}>
                            <h5 className="fw-bold mb-4">Hỗ Trợ</h5>
                            <ul className="list-unstyled footer-links">
                                <li><Link to="/order-tracking">Tra Cứu Đơn Hàng</Link></li>
                                <li><a href="#!">Chính Sách Đổi Trả</a></li>
                                <li><a href="#!">Chính Sách Bảo Mật</a></li>
                                <li><a href="#!">Điều Khoản Dịch Vụ</a></li>
                                <li><a href="#!">Liên Hệ</a></li>
                            </ul>
                        </Col>

                        {/* Contact Info */}
                        <Col lg={4} md={6}>
                            <h5 className="fw-bold mb-4">Liên Hệ</h5>
                            <div className="contact-item d-flex gap-3 mb-3">
                                <div className="contact-icon"><FiMapPin /></div>
                                <div className="text-muted">123 Đường Sách, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</div>
                            </div>
                            <div className="contact-item d-flex gap-3 mb-3">
                                <div className="contact-icon"><FiPhone /></div>
                                <div className="text-muted">Hotline: 1900 6789 (8:00 - 21:00)</div>
                            </div>
                            <div className="contact-item d-flex gap-3 mb-4">
                                <div className="contact-icon"><FiMail /></div>
                                <div className="text-muted">support@bookstore.vn</div>
                            </div>
                            
                            <h6 className="fw-bold mb-3 small text-uppercase letter-spacing-1">Đăng ký nhận ưu đãi</h6>
                            <Form className="d-flex gap-2">
                                <Form.Control 
                                    type="email" 
                                    placeholder="Email của bạn..." 
                                    className="rounded-pill border-0 bg-light px-3"
                                />
                                <Button variant="primary" className="rounded-circle p-2 d-flex align-items-center justify-content-center">
                                    <FiSend />
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="footer-bottom py-4 bg-light">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
                            <p className="text-muted small mb-0">
                                © 2024 Bookstore. Thiết kế bởi Antigravity. Tất cả quyền được bảo lưu.
                            </p>
                        </Col>
                        <Col md={6} className="text-center text-md-end">
                            <img src="https://salt.tikicdn.com/ts/upload/ae/b1/20/dbfa0037a346599b50b7318084a4413e.png" alt="payments" height="25" />
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    );
};

export default Footer;
