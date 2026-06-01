import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Modal, Button, Form, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { FiArrowLeft, FiLayers, FiBookOpen, FiStar, FiBriefcase, FiHeart, FiEdit3, FiTrendingUp, FiShoppingCart, FiCalendar, FiHome, FiCheckCircle, FiFilter, FiDollarSign } from 'react-icons/fi';

import { useCart } from '../context/CartContext';

const Category = () => {
    const { addToCart } = useCart();
    const { catKey } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [addedToCart, setAddedToCart] = useState(false);

    // States phục vụ cho bộ lọc
    const [selectedPublisher, setSelectedPublisher] = useState('All');
    const [minPrice, setMinPrice] = useState('');
    const [searchAuthor, setSearchAuthor] = useState('');
    const [searchTitle, setSearchTitle] = useState('');
    const [priceSort, setPriceSort] = useState('none'); // 'none', 'asc', 'desc'
    const [priceRange, setPriceRange] = useState('all'); // 'all', 'under_50k', '50k_100k', '100k_200k', 'over_200k'

    // States phục vụ yêu thích và đánh giá bình luận
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [reviewerName, setReviewerName] = useState('');
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [reviewsUpdated, setReviewsUpdated] = useState(0); // Trigger re-render khi gửi review mới

    const handleToggleFavorite = (bookId) => {
        const updated = favorites.includes(bookId)
            ? favorites.filter(id => id !== bookId)
            : [...favorites, bookId];
        setFavorites(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
    };

    const mockReviews = [
        { id: 1, name: "Thế Anh", rating: 5, date: "28/05/2026", content: "Sách giao rất nhanh, bọc đóng cẩn thận. Nội dung cực kỳ bổ ích và hay!" },
        { id: 2, name: "Bảo Ngọc", rating: 4, date: "24/05/2026", content: "Sách in ấn rõ nét, thiết kế bọc bìa đẹp. Rất đáng mua để học hỏi thêm kỹ năng." },
        { id: 3, name: "Trung Kiên", rating: 5, date: "20/05/2026", content: "Cực kỳ hài lòng về cuốn sách này. Mua lúc sale được giá rẻ nữa chứ, vote 5 sao!" }
    ];

    const getBookReviews = (bookId) => {
        if (!bookId) return [];
        const saved = localStorage.getItem(`reviews_${bookId}`);
        return saved ? JSON.parse(saved) : mockReviews;
    };

    const handleAddReview = (e, bookId) => {
        e.preventDefault();
        if (!reviewerName.trim() || !newComment.trim()) return;

        const newReviewObj = {
            id: Date.now(),
            name: reviewerName,
            rating: newRating,
            date: new Date().toLocaleDateString('vi-VN'),
            content: newComment
        };

        const currentReviews = getBookReviews(bookId);
        const updated = [newReviewObj, ...currentReviews];
        localStorage.setItem(`reviews_${bookId}`, JSON.stringify(updated));

        // Reset
        setReviewerName('');
        setNewComment('');
        setNewRating(5);
        setReviewsUpdated(prev => prev + 1); // trigger state update
    };

    const categoryMap = {
        sach_mam_non: { title: "Sách Mầm Non", icon: <FiLayers className="text-primary" /> },
        sach_thieu_nhi: { title: "Sách Thiếu Nhi", icon: <FiBookOpen className="text-success" /> },
        sach_ki_nang: { title: "Sách Kĩ Năng", icon: <FiStar className="text-warning" /> },
        sach_kinh_doanh: { title: "Sách Kinh Doanh", icon: <FiBriefcase className="text-info" /> },
        sach_me_va_be: { title: "Sách Mẹ và Bé", icon: <FiHeart className="text-danger" /> },
        sach_van_hoc: { title: "Sách Văn Học", icon: <FiEdit3 className="text-secondary" /> },
        sach_tham_khao: { title: "Sách Tham Khảo", icon: <FiLayers className="text-dark" /> },
        notebook: { title: "Note Book", icon: <FiEdit3 className="text-primary" /> },
        top_best_seller: { title: "Bán Chạy Nhất", icon: <FiTrendingUp className="text-danger" /> },
        sach_moi: { title: "Sách Mới Phát Hành", icon: <FiStar className="text-primary" /> },
        sach_sap_phat_hanh: { title: "Sắp Phát Hành", icon: <FiStar className="text-muted" /> }
    };

    useEffect(() => {
        const fetchCategoryData = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:9999/category');
                setBooks(res.data[catKey] || []);
                // Reset bộ lọc mỗi khi đổi danh mục
                setSelectedPublisher('All');
                setMinPrice('');
                setSearchAuthor('');
                setSearchTitle('');
                setPriceSort('none');
                setPriceRange('all');
            } catch (error) {
                console.error("Error fetching category books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryData();
    }, [catKey]);

    const handleShowDetail = (book) => {
        setSelectedBook(book);
        setShowModal(true);
    };

    const catInfo = categoryMap[catKey] || { title: "Danh Mục", icon: <FiLayers /> };

    // 1. Lấy danh sách tất cả nhà xuất bản duy nhất có trong danh mục hiện tại (Dành cho việc render menu lọc)
    const publishers = ['All', ...new Set(books.map(book => book.publisher || 'N/A'))];

    // 2. Logic lọc sản phẩm
    let filteredBooks = books.filter(book => {
        // Lọc theo Tác giả
        const matchesAuthor = searchAuthor.trim() === '' || 
            (book.author || '').toLowerCase().includes(searchAuthor.toLowerCase());

        // Lọc theo Tên sách
        const matchesTitle = searchTitle.trim() === '' || 
            (book.name || '').toLowerCase().includes(searchTitle.toLowerCase());

        // Lọc theo Nhà xuất bản
        const matchesPublisher = selectedPublisher === 'All' || (book.publisher || 'N/A') === selectedPublisher;
        
        // Lọc theo giá tối thiểu (Giá hiện tại của sách >= Giá nhập vào)
        const matchesMinPrice = minPrice === '' || Number(book.price) >= Number(minPrice);

        // Lọc theo khoảng giá
        let matchesPriceRange = true;
        const price = Number(book.price);
        if (priceRange === 'under_50k') {
            matchesPriceRange = price < 50000;
        } else if (priceRange === '50k_100k') {
            matchesPriceRange = price >= 50000 && price <= 100000;
        } else if (priceRange === '100k_200k') {
            matchesPriceRange = price >= 100000 && price <= 200000;
        } else if (priceRange === 'over_200k') {
            matchesPriceRange = price > 200000;
        }

        return matchesAuthor && matchesTitle && matchesPublisher && matchesMinPrice && matchesPriceRange;
    });

    // 3. Sắp xếp theo giá và chữ cái (A-Z, Z-A)
    if (priceSort === 'asc') {
        filteredBooks = [...filteredBooks].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (priceSort === 'desc') {
        filteredBooks = [...filteredBooks].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (priceSort === 'name_asc') {
        filteredBooks = [...filteredBooks].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'vi'));
    } else if (priceSort === 'name_desc') {
        filteredBooks = [...filteredBooks].sort((a, b) => (b.name || '').localeCompare(a.name || '', 'vi'));
    }

    if (loading) return <Container className="py-5 text-center">Đang tải...</Container>;

    return (
        <Container className="py-4">
            {/* Header */}
            <div className="d-flex align-items-center gap-3 mb-5">
                <Link to="/" className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px', padding: 0 }}>
                    <FiArrowLeft size={20} />
                </Link>
                <h2 className="fw-bold m-0 d-flex align-items-center">
                    <span className="me-2">{catInfo.icon}</span>
                    {catInfo.title}
                </h2>
                <span className="badge bg-primary-light text-primary rounded-pill px-3 py-2" style={{ fontSize: '0.9rem' }}>
                    {filteredBooks.length} / {books.length} sản phẩm
                </span>
            </div>

            <Row>
                {/* THANH BỘ LỌC BÊN TRÁI */}
                <Col lg={3} md={4} className="mb-4">
                    <div className="bg-white p-4 rounded-4 shadow-sm border border-light" style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.015) !important' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold m-0 d-flex align-items-center text-dark" style={{ fontSize: '1.25rem', letterSpacing: '0.1px' }}>
                                <FiFilter className="me-2 text-primary" size={20} /> Bộ lọc tìm kiếm
                            </h5>
                            {(searchAuthor || searchTitle || selectedPublisher !== 'All' || priceSort !== 'none' || priceRange !== 'all' || minPrice) && (
                                <Button 
                                    variant="link" 
                                    className="p-0 text-decoration-none text-danger fw-bold d-flex align-items-center gap-1"
                                    onClick={() => {
                                        setSearchAuthor('');
                                        setSearchTitle('');
                                        setSelectedPublisher('All');
                                        setPriceSort('none');
                                        setPriceRange('all');
                                        setMinPrice('');
                                    }}
                                    style={{ fontSize: '0.95rem', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.target.style.color = '#b91c1c'}
                                    onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                                >
                                    Xóa lọc
                                </Button>
                            )}
                        </div>
                        <hr className="my-3 text-muted" style={{ opacity: 0.15 }} />

                        {/* Lọc theo Tên sách */}
                        <div className="mb-4">
                            <label className="fw-bold text-secondary uppercase mb-2 d-block" style={{ fontSize: '0.85rem', letterSpacing: '0.8px' }}>
                                <FiBookOpen className="me-1 text-primary" /> TÊN SÁCH
                            </label>
                            <div className="position-relative">
                                <Form.Control 
                                    type="text" 
                                    placeholder="Tìm tên sách..." 
                                    value={searchTitle}
                                    onChange={(e) => setSearchTitle(e.target.value)}
                                    className="border-0 bg-light rounded-3 px-3 py-2.5 text-dark"
                                    style={{ 
                                        fontSize: '0.95rem', 
                                        transition: 'all 0.3s ease',
                                        boxShadow: 'none',
                                        border: '1px solid #f1f5f9'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.border = '1px solid #2563eb';
                                        e.target.style.backgroundColor = 'white';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.border = '1px solid #f1f5f9';
                                        e.target.style.backgroundColor = '#f8fafc';
                                    }}
                                />
                                {searchTitle && (
                                    <button 
                                        className="btn-close position-absolute end-0 top-50 translate-middle-y me-3" 
                                        style={{ fontSize: '0.75rem', opacity: 0.7 }}
                                        onClick={() => setSearchTitle('')}
                                    ></button>
                                )}
                            </div>
                        </div>

                        {/* Lọc theo Tác giả */}
                        <div className="mb-4">
                            <label className="fw-bold text-secondary uppercase mb-2 d-block" style={{ fontSize: '0.85rem', letterSpacing: '0.8px' }}>
                                <FiEdit3 className="me-1 text-primary" /> TÊN TÁC GIẢ
                            </label>
                            <div className="position-relative">
                                <Form.Control 
                                    type="text" 
                                    placeholder="Tìm tên tác giả..." 
                                    value={searchAuthor}
                                    onChange={(e) => setSearchAuthor(e.target.value)}
                                    className="border-0 bg-light rounded-3 px-3 py-2.5 text-dark"
                                    style={{ 
                                        fontSize: '0.95rem', 
                                        transition: 'all 0.3s ease',
                                        boxShadow: 'none',
                                        border: '1px solid #f1f5f9'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.border = '1px solid #2563eb';
                                        e.target.style.backgroundColor = 'white';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.border = '1px solid #f1f5f9';
                                        e.target.style.backgroundColor = '#f8fafc';
                                    }}
                                />
                                {searchAuthor && (
                                    <button 
                                        className="btn-close position-absolute end-0 top-50 translate-middle-y me-3" 
                                        style={{ fontSize: '0.75rem', opacity: 0.7 }}
                                        onClick={() => setSearchAuthor('')}
                                    ></button>
                                )}
                            </div>
                        </div>

                        {/* Lọc theo Nhà xuất bản */}
                        <div className="mb-4">
                            <label className="fw-bold text-secondary uppercase mb-2 d-block" style={{ fontSize: '0.85rem', letterSpacing: '0.8px' }}>
                                <FiHome className="me-1 text-primary" /> NHÀ XUẤT BẢN
                            </label>
                            <div className="d-flex flex-column gap-1" style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                                {publishers.map((pub, idx) => {
                                    const isSelected = selectedPublisher === pub;
                                    return (
                                        <div 
                                            key={idx}
                                            onClick={() => setSelectedPublisher(pub)}
                                            className="d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 select-none"
                                            style={{
                                                fontSize: '0.95rem',
                                                backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                                                color: isSelected ? '#1e40af' : '#475569',
                                                border: isSelected ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                                                    e.currentTarget.style.color = '#0f172a';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.backgroundColor = '#f8fafc';
                                                    e.currentTarget.style.color = '#475569';
                                                }
                                            }}
                                        >
                                            <span className="text-truncate fw-medium">
                                                {pub === 'All' ? 'Tất cả NXB' : pub}
                                            </span>
                                            {isSelected && (
                                                <span className="badge bg-primary rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '16px', height: '16px' }}>
                                                    <FiCheckCircle size={10} className="text-white" />
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sắp xếp Sản phẩm */}
                        <div className="mb-4">
                            <label className="fw-bold text-secondary uppercase mb-2 d-block" style={{ fontSize: '0.85rem', letterSpacing: '0.8px' }}>
                                <FiTrendingUp className="me-1 text-primary" /> SẮP XẾP SẢN PHẨM
                            </label>
                            <div className="d-flex flex-column gap-1">
                                {[
                                    { value: 'none', label: 'Mặc định' },
                                    { value: 'asc', label: 'Giá: Thấp đến Cao' },
                                    { value: 'desc', label: 'Giá: Cao đến Thấp' },
                                    { value: 'name_asc', label: 'Tên sách: A đến Z' },
                                    { value: 'name_desc', label: 'Tên sách: Z đến A' }
                                ].map((option) => {
                                    const isSelected = priceSort === option.value;
                                    return (
                                        <div 
                                            key={option.value}
                                            onClick={() => setPriceSort(option.value)}
                                            className="d-flex align-items-center gap-2 px-3 py-2.5 rounded-3 select-none"
                                            style={{
                                                fontSize: '0.95rem',
                                                backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                                                color: isSelected ? '#1e40af' : '#475569',
                                                border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                                                    e.currentTarget.style.color = '#0f172a';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = '#475569';
                                                }
                                            }}
                                        >
                                            <div 
                                                style={{
                                                    width: '14px',
                                                    height: '14px',
                                                    borderRadius: '50%',
                                                    border: isSelected ? '4px solid #2563eb' : '1px solid #cbd5e1',
                                                    backgroundColor: 'white',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            />
                                            <span className={isSelected ? 'fw-semibold' : ''} style={{ fontSize: '0.95rem' }}>{option.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Lọc theo Khoảng giá */}
                        <div className="mb-4">
                            <label className="fw-bold text-secondary uppercase mb-2 d-block" style={{ fontSize: '0.85rem', letterSpacing: '0.8px' }}>
                                <FiDollarSign className="me-1 text-primary" /> KHOẢNG GIÁ
                            </label>
                            <div className="d-flex flex-wrap gap-2">
                                {[
                                    { value: 'all', label: 'Tất cả' },
                                    { value: 'under_50k', label: 'Dưới 50k' },
                                    { value: '50k_100k', label: '50k - 100k' },
                                    { value: '100k_200k', label: '100k - 200k' },
                                    { value: 'over_200k', label: 'Trên 200k' }
                                ].map((option) => {
                                    const isSelected = priceRange === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setPriceRange(option.value)}
                                            className="btn px-3 py-2 rounded-pill"
                                            style={{
                                                fontSize: '0.9rem',
                                                backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
                                                color: isSelected ? 'white' : '#475569',
                                                border: 'none',
                                                fontWeight: isSelected ? '600' : '500',
                                                transition: 'all 0.2s ease',
                                                boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.backgroundColor = '#e2e8f0';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                                                }
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Lọc theo Giá tối thiểu */}
                        <div className="mb-2">
                            <label className="fw-bold text-secondary uppercase mb-2 d-block" style={{ fontSize: '0.85rem', letterSpacing: '0.8px' }}>
                                <FiDollarSign className="me-1 text-primary" /> GIÁ TỐI THIỂU (>=)
                            </label>
                            <div className="position-relative">
                                <Form.Control 
                                    type="number" 
                                    placeholder="Nhập giá..." 
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="border-0 bg-light rounded-3 px-3 py-2.5 text-dark"
                                    min="0"
                                    style={{ 
                                        fontSize: '0.95rem', 
                                        transition: 'all 0.3s ease',
                                        boxShadow: 'none',
                                        border: '1px solid #f1f5f9'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.border = '1px solid #2563eb';
                                        e.target.style.backgroundColor = 'white';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.border = '1px solid #f1f5f9';
                                        e.target.style.backgroundColor = '#f8fafc';
                                    }}
                                />
                                {minPrice && (
                                    <button 
                                        className="btn-close position-absolute end-0 top-50 translate-middle-y me-3" 
                                        style={{ fontSize: '0.75rem', opacity: 0.7 }}
                                        onClick={() => setMinPrice('')}
                                    ></button>
                                )}
                            </div>
                            <Form.Text className="text-muted small px-1 d-block mt-2" style={{ fontSize: '0.82rem' }}>
                                {minPrice ? `Hiển thị từ ${Number(minPrice).toLocaleString()}đ trở lên` : 'Nhập mức giá để lọc'}
                            </Form.Text>
                        </div>
                    </div>
                </Col>

                {/* DANH SÁCH SẢN PHẨM BÊN PHẢI */}
                <Col lg={9} md={8}>
                    {filteredBooks.length === 0 ? (
                        <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                            <p className="text-muted mb-3" style={{ fontSize: '0.95rem' }}>Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
                            <Button 
                                variant="outline-primary" 
                                className="rounded-pill px-4 btn-sm fw-bold"
                                onClick={() => {
                                    setSearchAuthor('');
                                    setSearchTitle('');
                                    setSelectedPublisher('All');
                                    setPriceSort('none');
                                    setPriceRange('all');
                                    setMinPrice('');
                                }}
                            >
                                Xóa tất cả bộ lọc
                            </Button>
                        </div>
                    ) : (
                        <Row className="g-3 row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-xl-4">
                            {filteredBooks.map(book => (
                                <Col key={book.id}>
                                    <div 
                                        className="book-card h-100 shadow-sm border-0 rounded-3 overflow-hidden bg-white"
                                        onClick={() => handleShowDetail(book)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="book-img-wrapper position-relative">
                                            <img src={book.image} alt={book.name} className="book-img w-100" style={{ height: '180px', objectFit: 'cover' }} />
                                            {book.discount > 0 && (
                                                <div className="discount-badge bg-danger text-white position-absolute top-0 end-0 m-1 px-1 rounded-1 fw-bold" style={{ fontSize: '0.65rem' }}>
                                                    -{book.discount}%
                                                </div>
                                            )}
                                            {/* Nút trái tim yêu thích ở góc trên sản phẩm */}
                                            <button 
                                                className="btn btn-light rounded-circle shadow-sm position-absolute top-0 start-0 m-2 p-0 d-flex align-items-center justify-content-center border-0 favorite-badge-btn"
                                                style={{ 
                                                    width: '32px', 
                                                    height: '32px', 
                                                    zIndex: 10,
                                                    color: favorites.includes(book.id) ? '#ef4444' : '#94a3b8',
                                                    transition: 'all 0.2s ease',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Ngăn chặn sự kiện click mở Modal chi tiết
                                                    handleToggleFavorite(book.id);
                                                }}
                                            >
                                                <FiHeart fill={favorites.includes(book.id) ? "#ef4444" : "none"} size={16} />
                                            </button>
                                        </div>
                                        <div className="book-info p-2">
                                            <h3 className="book-title mb-1 text-truncate fw-bold" style={{ fontSize: '0.85rem' }}>{book.name}</h3>
                                            <p className="book-author text-muted small mb-1 text-truncate" style={{ fontSize: '0.75rem' }}>{book.author}</p>
                                            <div className="price-wrapper d-flex align-items-center gap-1 flex-wrap">
                                                <span className="current-price fw-bold text-primary" style={{ fontSize: '0.85rem' }}>{Number(book.price).toLocaleString()}đ</span>
                                                {book.original_price > book.price && (
                                                    <span className="old-price text-muted text-decoration-line-through" style={{ fontSize: '0.65rem' }}>
                                                        {Number(book.original_price).toLocaleString()}đ
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>

            {/* Product Detail Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered className="product-detail-modal">
                {selectedBook && (
                    <Modal.Body className="p-0 overflow-hidden rounded-4">
                        <Row className="g-0">
                            <Col md={5} className="bg-light d-flex flex-column align-items-center justify-content-center p-4 gap-3 border-end">
                                <img 
                                    src={selectedBook.image} 
                                    alt={selectedBook.name} 
                                    className="img-fluid rounded-3 shadow-lg" 
                                    style={{ maxHeight: '340px', width: 'auto', objectFit: 'contain' }}
                                />
                                <Button 
                                    variant={favorites.includes(selectedBook.id) ? "danger" : "outline-danger"} 
                                    className="rounded-pill px-4 py-2 d-flex align-items-center gap-2 mt-2"
                                    onClick={() => handleToggleFavorite(selectedBook.id)}
                                    style={{ transition: 'all 0.3s', fontWeight: '600' }}
                                >
                                    <FiHeart fill={favorites.includes(selectedBook.id) ? "currentColor" : "none"} size={18} />
                                    {favorites.includes(selectedBook.id) ? "Đã thích sản phẩm" : "Yêu thích sản phẩm"}
                                </Button>
                            </Col>
                            <Col md={7} className="p-4 p-lg-5 bg-white position-relative">
                                <button 
                                    className="btn-close position-absolute top-0 end-0 m-3" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                                
                                <div className="mb-4">
                                    <span className="badge bg-primary-subtle text-primary mb-2 rounded-pill">Thông tin sản phẩm</span>
                                    <h2 className="fw-bold mb-1 text-dark">{selectedBook.name}</h2>
                                    <p className="text-muted lead mb-0">{selectedBook.author}</p>
                                </div>

                                <div className="info-grid mb-4 bg-light p-3 rounded-4">
                                    <Row className="gy-3">
                                        <Col xs={6}>
                                            <div className="small text-muted d-flex align-items-center gap-2">
                                                <FiHome /> Nhà xuất bản
                                            </div>
                                            <div className="fw-bold">{selectedBook.publisher || 'N/A'}</div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="small text-muted d-flex align-items-center gap-2">
                                                <FiCalendar /> Năm xuất bản
                                            </div>
                                            <div className="fw-bold">{selectedBook.year || 'N/A'}</div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="small text-muted d-flex align-items-center gap-2">
                                                <FiCheckCircle /> Tình trạng
                                            </div>
                                            <div className={`fw-bold ${selectedBook.quantity > 0 ? 'text-success' : 'text-danger'}`}>
                                                {selectedBook.quantity > 0 ? `Còn hàng (${selectedBook.quantity})` : 'Hết hàng'}
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="small text-muted d-flex align-items-center gap-2">
                                                <FiStar /> Đánh giá
                                            </div>
                                            <div className="fw-bold text-warning d-flex align-items-center gap-1">
                                                <FiStar fill="currentColor" /> 
                                                {(() => {
                                                    const currentReviews = getBookReviews(selectedBook.id);
                                                    if (currentReviews.length === 0) return "5.0/5";
                                                    const sum = currentReviews.reduce((acc, r) => acc + r.rating, 0);
                                                    return `${(sum / currentReviews.length).toFixed(1)}/5`;
                                                })()}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex align-items-end gap-3 mb-2">
                                        <span className="h2 fw-bold text-primary mb-0">{Number(selectedBook.price).toLocaleString()}đ</span>
                                        {selectedBook.discount > 0 && (
                                            <span className="h5 text-muted text-decoration-line-through mb-1">
                                                {Number(selectedBook.original_price).toLocaleString()}đ
                                            </span>
                                        )}
                                    </div>
                                    {selectedBook.discount > 0 && (
                                        <div className="d-inline-block bg-danger text-white px-3 py-1 rounded-pill fw-bold small">
                                            Giảm giá cực sốc: {selectedBook.discount}%
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4 bg-light-subtle p-3 rounded-4 border">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <span className="fw-bold small text-uppercase letter-spacing-1">Giới thiệu sách</span>
                                    </div>
                                    <div 
                                        className="text-muted" 
                                        style={{ 
                                            lineHeight: '1.7', 
                                            fontSize: '0.9rem',
                                            maxHeight: '180px', 
                                            overflowY: 'auto',
                                            whiteSpace: 'pre-line' 
                                        }}
                                    >
                                        {selectedBook.description || 'Nội dung đang được cập nhật. Cuốn sách này hứa hẹn sẽ mang đến cho bạn những trải nghiệm tuyệt vời và kiến thức bổ ích...'}
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <Button 
                                        variant={addedToCart ? "success" : "primary"} 
                                        size="lg" 
                                        className="rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => {
                                            addToCart(selectedBook);
                                            setAddedToCart(true);
                                            setTimeout(() => setAddedToCart(false), 2000);
                                        }}
                                    >
                                        {addedToCart ? (
                                            <> <FiCheckCircle /> Đã thêm vào giỏ </>
                                        ) : (
                                            <> <FiShoppingCart /> Thêm vào giỏ hàng </>
                                        )}
                                    </Button>
                                    <Button variant="outline-dark" onClick={() => setShowModal(false)} className="rounded-pill py-2">
                                        Tiếp tục mua sắm
                                    </Button>
                                </div>
                            </Col>
                        </Row>

                        {/* PHẦN ĐÁNH GIÁ VÀ BÌNH LUẬN Ở DƯỚI CÙNG MODAL */}
                        <div className="bg-light p-4 p-lg-5 border-top">
                            <h4 className="fw-bold mb-4 d-flex align-items-center text-dark" style={{ fontSize: '1.25rem' }}>
                                <FiStar className="me-2 text-warning" fill="currentColor" /> Đánh giá & Bình luận khách hàng
                            </h4>
                            
                            <Row className="gy-4">
                                {/* Tổng quan đánh giá */}
                                <Col lg={4} className="pe-lg-4 border-end-lg">
                                    <div className="bg-white p-4 rounded-4 shadow-sm border text-center">
                                        <h1 className="fw-bold text-primary mb-1" style={{ fontSize: '3.5rem' }}>
                                            {(() => {
                                                const currentReviews = getBookReviews(selectedBook.id);
                                                if (currentReviews.length === 0) return "5.0";
                                                const sum = currentReviews.reduce((acc, r) => acc + r.rating, 0);
                                                return (sum / currentReviews.length).toFixed(1);
                                            })()}
                                        </h1>
                                        <div className="text-warning mb-2" style={{ fontSize: '1.25rem' }}>
                                            <FiStar fill="currentColor" />
                                            <FiStar fill="currentColor" className="ms-1" />
                                            <FiStar fill="currentColor" className="ms-1" />
                                            <FiStar fill="currentColor" className="ms-1" />
                                            <FiStar fill="currentColor" className="ms-1" style={{ opacity: 0.8 }} />
                                        </div>
                                        <p className="text-muted small mb-3">Dựa trên {getBookReviews(selectedBook.id).length} đánh giá thực tế</p>
                                        
                                        <div className="d-flex flex-column gap-2 mt-4 text-start">
                                            {[
                                                { stars: 5, pct: 80 },
                                                { stars: 4, pct: 15 },
                                                { stars: 3, pct: 5 },
                                                { stars: 2, pct: 0 },
                                                { stars: 1, pct: 0 }
                                            ].map((row) => (
                                                <div key={row.stars} className="d-flex align-items-center gap-2">
                                                    <span className="small text-muted fw-bold" style={{ width: '45px', fontSize: '0.8rem' }}>{row.stars} sao</span>
                                                    <div className="progress flex-grow-1" style={{ height: '8px', borderRadius: '4px' }}>
                                                        <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${row.pct}%`, borderRadius: '4px' }} aria-valuenow={row.pct} aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                    <span className="small text-muted" style={{ width: '30px', textAlign: 'right', fontSize: '0.8rem' }}>{row.pct}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Col>

                                {/* Danh sách bình luận & Form viết đánh giá */}
                                <Col lg={8}>
                                    <Row className="gy-4">
                                        {/* Form gửi đánh giá mới */}
                                        <Col md={12}>
                                            <div className="bg-white p-4 rounded-4 shadow-sm border">
                                                <h5 className="fw-bold mb-3 text-dark" style={{ fontSize: '1.05rem' }}>Viết đánh giá của bạn</h5>
                                                <Form onSubmit={(e) => handleAddReview(e, selectedBook.id)}>
                                                    <Row className="g-3">
                                                        <Col md={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="small fw-bold text-secondary">Tên của bạn</Form.Label>
                                                                <Form.Control 
                                                                    type="text" 
                                                                    placeholder="Nhập tên..." 
                                                                    value={reviewerName}
                                                                    onChange={(e) => setReviewerName(e.target.value)}
                                                                    required
                                                                    className="rounded-3 border-light bg-light py-2"
                                                                    style={{ fontSize: '0.9rem' }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="small fw-bold text-secondary d-block">Đánh giá sao</Form.Label>
                                                                <div className="d-flex gap-2 align-items-center mt-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <FiStar 
                                                                            key={star} 
                                                                            size={24} 
                                                                            style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                                                                            className={star <= newRating ? 'text-warning' : 'text-muted'}
                                                                            fill={star <= newRating ? 'currentColor' : 'none'}
                                                                            onClick={() => setNewRating(star)}
                                                                        />
                                                                    ))}
                                                                    <span className="small text-muted ms-2 fw-medium">({newRating}/5 sao)</span>
                                                                </div>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={12}>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label className="small fw-bold text-secondary">Nội dung bình luận</Form.Label>
                                                                <Form.Control 
                                                                    as="textarea" 
                                                                    rows={3} 
                                                                    placeholder="Chia sẻ nhận xét của bạn về cuốn sách..." 
                                                                    value={newComment}
                                                                    onChange={(e) => setNewComment(e.target.value)}
                                                                    required
                                                                    className="rounded-3 border-light bg-light"
                                                                    style={{ fontSize: '0.9rem' }}
                                                                />
                                                            </Form.Group>
                                                            <Button type="submit" variant="primary" className="rounded-pill px-4 py-2 fw-bold shadow-sm" style={{ fontSize: '0.9rem' }}>
                                                                Gửi đánh giá
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </div>
                                        </Col>

                                        {/* Danh sách các bình luận hiện tại */}
                                        <Col md={12}>
                                            <div className="d-flex flex-column gap-3" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '6px' }}>
                                                {getBookReviews(selectedBook.id).map((rev) => (
                                                    <div key={rev.id} className="bg-white p-3 rounded-4 shadow-sm border border-light">
                                                        <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-1">
                                                            <div>
                                                                <span className="fw-bold text-dark me-2" style={{ fontSize: '0.95rem' }}>{rev.name}</span>
                                                                <span className="text-warning small">
                                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                                        <FiStar 
                                                                            key={i} 
                                                                            fill={i < rev.rating ? "currentColor" : "none"} 
                                                                            className={i < rev.rating ? "text-warning me-0.5" : "text-muted me-0.5"} 
                                                                            size={12}
                                                                        />
                                                                    ))}
                                                                </span>
                                                            </div>
                                                            <span className="text-muted small italic">{rev.date}</span>
                                                        </div>
                                                        <p className="text-secondary mb-0 small" style={{ lineHeight: '1.6', fontSize: '0.85rem' }}>{rev.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Modal.Body>
                )}
            </Modal>
        </Container>
    );
};

export default Category;