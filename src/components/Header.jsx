import React, { useState, useEffect, useRef } from 'react';
import { Container, Modal, Form, Button, Alert } from 'react-bootstrap';
import { FiSearch, FiTruck, FiShoppingCart, FiUser, FiBook, FiLock, FiHeart } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { cartCount } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null); // Ref để bắt sự kiện click ra ngoài menu

    const [showAuth, setShowAuth] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // State lưu thông tin người dùng đang đăng nhập
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });
    const [showDropdown, setShowDropdown] = useState(false); // State quản lý việc ẩn/hiện menu dropdown
    const [favoritesCount, setFavoritesCount] = useState(0); // State lưu số lượng sách yêu thích

    const navigate = useNavigate();

    useEffect(() => {
        const updateFavoritesCount = () => {
            const saved = localStorage.getItem('favorites');
            const list = saved ? JSON.parse(saved) : [];
            setFavoritesCount(list.length);
        };
        updateFavoritesCount();

        // Lắng nghe sự kiện storage (thay đổi từ tab khác)
        const handleStorageChange = () => {
            updateFavoritesCount();
        };
        window.addEventListener('storage', handleStorageChange);

        // Interval kiểm tra mỗi 1 giây để đồng bộ hóa trên cùng tab
        const checkInterval = setInterval(updateFavoritesCount, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(checkInterval);
        };
    }, []);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get('http://localhost:9999/category');
                let books = [];
                Object.values(res.data).forEach(catBooks => {
                    books = [...books, ...catBooks];
                });
                // Lọc trùng ID
                const unique = Array.from(new Map(books.map(b => [b.id, b])).values());
                setAllBooks(unique);
            } catch (error) {
                console.error("Error loading books for suggestions", error);
            }
        };
        fetchAllBooks();

        // Đóng gợi ý và dropdown tài khoản khi click bên ngoài
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim().length > 0) {
            const filtered = allBooks.filter(book => 
                book.name.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 6); // Lấy tối đa 6 gợi ý
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setShowSuggestions(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { username, password } = loginData;
        if (!username.trim() || !password.trim()) {
            setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                // Xử lý đăng nhập
                const res = await axios.get('http://localhost:9999/users');
                const user = res.data.find(u => 
                    u.username === username && u.password === password
                );

                if (user) {
                    console.log('Login success:', user);
                    setShowAuth(false);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    setCurrentUser(user);
                    setLoginData({ username: '', password: '' });
                    if (user.role === 'admin') {
                        navigate('/admin');
                    } else {
                        alert('Đăng nhập thành công!');
                    }
                } else {
                    setError('Tên đăng nhập hoặc mật khẩu không đúng!');
                }
            } else {
                // Xử lý đăng ký
                const res = await axios.get('http://localhost:9999/users');
                const userExists = res.data.some(u => u.username.toLowerCase() === username.toLowerCase());

                if (userExists) {
                    setError('Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.');
                    setLoading(false);
                    return;
                }

                // Thực hiện lưu user mới
                const newUser = {
                    username: username,
                    password: password,
                    role: 'user',
                    fullName: username
                };

                await axios.post('http://localhost:9999/users', newUser);
                alert('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
                setIsLogin(true); // Quay lại màn hình đăng nhập
            }
        } catch (err) {
            console.error(err);
            setError('Có lỗi xảy ra khi kết nối đến server!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="main-header">
            <Container>
                <div className="header-container">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <FiBook size={32} />
                        <span>BOOK<span>STORE</span></span>
                    </Link>

                    {/* Search Bar */}
                    <form className="search-container" onSubmit={handleSearch} ref={searchRef}>
                        <div className="search-wrapper">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sách, tác giả, nhà xuất bản..."
                                className="search-input"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                            />
                            <button type="submit" className="search-btn">
                                <FiSearch size={18} /> 
                                <span className="d-none d-md-inline">Tìm kiếm</span>
                            </button>
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="search-suggestions shadow-lg rounded-4 overflow-hidden border">
                                {suggestions.map(book => (
                                    <div 
                                        key={book.id} 
                                        className="suggestion-item d-flex align-items-center gap-3 p-3 border-bottom cursor-pointer"
                                        onClick={() => {
                                            setSearchTerm(book.name);
                                            setShowSuggestions(false);
                                            navigate(`/search?q=${encodeURIComponent(book.name)}`);
                                        }}
                                    >
                                        <img src={book.image} alt="" className="rounded shadow-sm" style={{ width: '35px', height: '48px', objectFit: 'cover' }} />
                                        <div>
                                            <div className="fw-bold small text-dark">{book.name}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{book.author}</div>
                                            <div className="text-primary fw-bold small">{Number(book.price).toLocaleString()}đ</div>
                                        </div>
                                    </div>
                                ))}
                                <div 
                                    className="p-2 text-center bg-light small text-primary fw-bold cursor-pointer hover-bg-primary-light"
                                    onClick={handleSearch}
                                >
                                    Xem tất cả kết quả cho "{searchTerm}"
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Actions */}
                    <div className="header-actions">
                        <Link to="/order-tracking" className="header-item">
                            <FiTruck />
                            <span>Tra cứu đơn hàng</span>
                        </Link>

                        {currentUser ? (
                            <div 
                                className="header-item cursor-pointer position-relative" 
                                ref={dropdownRef}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <FiUser className="text-primary" />
                                <span className="text-primary fw-bold">{currentUser.fullName || currentUser.username}</span>
                                {showDropdown && (
                                    <div 
                                        className="dropdown-menu show shadow-lg border-0 rounded-3 p-2" 
                                        style={{ 
                                            position: 'absolute', 
                                            top: '100%', 
                                            right: 0, 
                                            zIndex: 1000, 
                                            minWidth: '180px',
                                            backgroundColor: '#ffffff',
                                            transform: 'translateY(10px)',
                                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
                                        }}
                                        onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện nổi bọt gây đóng menu
                                    >
                                        <div 
                                            className="dropdown-item py-2 px-3 rounded-2 fw-medium text-dark text-start d-flex align-items-center gap-2"
                                            onClick={() => {
                                                alert(`Thông tin tài khoản:\nTên đăng nhập: ${currentUser.username}\nVai trò: ${currentUser.role}`);
                                                setShowDropdown(false);
                                            }}
                                            style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                        >
                                            <FiUser size={16} /> {currentUser.fullName || currentUser.username}
                                        </div>
                                        <div className="dropdown-divider my-1" style={{ opacity: 0.15 }}></div>
                                        <Link 
                                            to="/favorites"
                                            className="dropdown-item py-2 px-3 rounded-2 fw-medium text-dark text-start d-flex align-items-center gap-2 text-decoration-none"
                                            onClick={() => setShowDropdown(false)}
                                            style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                        >
                                            <FiHeart size={16} className="text-danger" fill={favoritesCount > 0 ? "currentColor" : "none"} /> Sách yêu thích ({favoritesCount})
                                        </Link>
                                        <div className="dropdown-divider my-1" style={{ opacity: 0.15 }}></div>
                                        <div 
                                            className="dropdown-item py-2 px-3 rounded-2 fw-medium text-danger text-start d-flex align-items-center gap-2"
                                            onClick={() => {
                                                if (window.confirm("Bạn chắc chắn muốn đăng xuất?")) {
                                                    localStorage.removeItem('currentUser');
                                                    setCurrentUser(null);
                                                    setShowDropdown(false);
                                                }
                                            }}
                                            style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                        >
                                            Đăng xuất
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="header-item cursor-pointer" onClick={() => setShowAuth(true)}>
                                <FiUser />
                                <span>Tài khoản</span>
                            </div>
                        )}

                        <Link to="/favorites" className="header-item">
                            <div className="position-relative">
                                <FiHeart className="text-danger" fill={favoritesCount > 0 ? "currentColor" : "none"} />
                                {favoritesCount > 0 && <span className="cart-badge bg-danger">{favoritesCount}</span>}
                            </div>
                            <span>Yêu thích</span>
                        </Link>

                        <Link to="/cart" className="header-item">
                            <div className="position-relative">
                                <FiShoppingCart />
                                <span className="cart-badge">{cartCount}</span>
                            </div>
                            <span>Giỏ hàng</span>
                        </Link>
                    </div>
                </div>
            </Container>

            {/* Auth Modal */}
            <Modal show={showAuth} onHide={() => {setShowAuth(false); setError('');}} centered className="auth-modal">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="w-100 text-center fw-bold fs-4">
                        {isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    {error && <Alert variant="danger" className="py-2 fs-7">{error}</Alert>}
                    
                    <Form className="mt-3" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3 auth-input-group">
                            <FiUser className="input-icon" />
                            <Form.Control 
                                type="text" 
                                placeholder="Tên đăng nhập" 
                                className="auth-input" 
                                value={loginData.username}
                                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 auth-input-group">
                            <FiLock className="input-icon" />
                            <Form.Control 
                                type="password" 
                                placeholder="Mật khẩu" 
                                className="auth-input" 
                                value={loginData.password}
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                required
                            />
                        </Form.Group>

                        {isLogin ? (
                            <Button variant="primary" type="submit" className="w-100 py-2 fw-bold btn-auth mb-3" disabled={loading}>
                                {loading ? 'Đang kiểm tra...' : 'Đăng Nhập'}
                            </Button>
                        ) : (
                            <Button variant="primary" type="submit" className="w-100 py-2 fw-bold btn-auth mb-3" disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                            </Button>
                        )}

                        <div className="divider"><span>Hoặc</span></div>

                        <Button variant="outline-dark" className="w-100 py-2 d-flex align-items-center justify-content-center gap-2 btn-google mb-3">
                            <FcGoogle size={20} /> Đăng nhập với Google
                        </Button>

                        <div className="text-center mt-3 fs-7">
                            {isLogin ? (
                                <p>Chưa có tài khoản? <span className="auth-toggle" onClick={() => setIsLogin(false)}>Đăng ký ngay</span></p>
                            ) : (
                                <p>Đã có tài khoản? <span className="auth-toggle" onClick={() => setIsLogin(true)}>Đăng nhập</span></p>
                            )}
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </header>
    );
};

export default Header;
