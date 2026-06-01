import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    FiHeart, 
    FiShoppingCart, 
    FiTrash2, 
    FiArrowLeft,
    FiCheckCircle,
    FiHome,
    FiCalendar,
    FiStar
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Favorites = () => {
    const { addToCart } = useCart();
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [addedToCart, setAddedToCart] = useState(false);

    // States phục vụ yêu thích và đánh giá bình luận
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [reviewerName, setReviewerName] = useState('');
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [reviewsUpdated, setReviewsUpdated] = useState(0); // Trigger re-render khi gửi review mới

    const [currentUser] = useState(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        const fetchFavoriteBooks = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:9999/category');
                const categories = res.data;
                
                // Gom tất cả sách từ mọi danh mục vào mảng phẳng
                let allBooks = [];
                Object.values(categories).forEach(catBooks => {
                    allBooks = [...allBooks, ...catBooks];
                });

                // Lọc trùng ID
                const uniqueBooks = Array.from(new Map(allBooks.map(item => [item.id, item])).values());

                // Chỉ lấy những sách có ID trong danh sách yêu thích
                const filtered = uniqueBooks.filter(book => favorites.includes(book.id));
                setFavoriteBooks(filtered);
            } catch (error) {
                console.error("Error fetching favorite books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteBooks();
    }, [favorites]);

    const handleRemoveFavorite = (bookId, e) => {
        e.stopPropagation(); // Tránh click mở Modal
        const updated = favorites.filter(id => id !== bookId);
        setFavorites(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
    };

    const handleToggleFavoriteInModal = (bookId) => {
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

    const handleShowDetail = (book) => {
        setSelectedBook(book);
        setShowModal(true);
    };

    return (
        <Container className="py-5">
            {/* Header Trang Yêu thích */}
            <div className="mb-5 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold d-flex align-items-center gap-3">
                        <FiHeart className="text-danger" fill="currentColor" /> 
                        Danh Sách Yêu Thích 
                        {currentUser && <span className="fs-5 text-muted fw-normal">({currentUser.fullName || currentUser.username})</span>}
                    </h2>
                    <p className="text-muted mb-0">Lưu giữ những cuốn sách hay bạn muốn sở hữu.</p>
                </div>
                <Link to="/" className="btn btn-light rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm">
                    <FiArrowLeft /> Tiếp tục chọn sách
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-5">Đang tải danh sách yêu thích...</div>
            ) : favoriteBooks.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-5">
                    <div className="position-relative d-inline-block mb-4">
                        <FiHeart size={80} className="text-danger-light text-muted opacity-25" />
                        <FiHeart size={40} className="text-danger position-absolute top-50 start-50 translate-middle animate-pulse" fill="currentColor" />
                    </div>
                    <h4 className="fw-bold mb-2">Chưa có sản phẩm yêu thích nào</h4>
                    <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '450px' }}>
                        Hãy duyệt qua các danh mục sách của chúng tôi và thả tim vào những cuốn sách bạn yêu thích nhất để lưu lại tại đây!
                    </p>
                    <Link to="/shop" className="btn btn-primary rounded-pill px-5 py-2.5 fw-bold shadow-sm">
                        Khám Phá Cửa Hàng
                    </Link>
                </div>
            ) : (
                <Row className="g-4 row-cols-2 row-cols-md-4 row-cols-lg-5 row-cols-xl-6">
                    {favoriteBooks.map(book => (
                        <Col key={book.id}>
                            <div 
                                className="book-card h-100 shadow-sm border-0 rounded-3 overflow-hidden bg-white cursor-pointer position-relative d-flex flex-column"
                                onClick={() => handleShowDetail(book)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="book-img-wrapper position-relative">
                                    <img src={book.image} alt={book.name} className="book-img w-100" style={{ height: '200px', objectFit: 'cover' }} />
                                    {book.discount > 0 && (
                                        <div className="discount-badge bg-danger text-white position-absolute top-0 end-0 m-2 px-2 py-1 rounded-2 small fw-bold">
                                            -{book.discount}%
                                        </div>
                                    )}
                                    {/* Nút xóa nhanh khỏi danh sách yêu thích */}
                                    <button 
                                        className="btn btn-light rounded-circle shadow-sm position-absolute top-0 start-0 m-2 p-0 d-flex align-items-center justify-content-center border-0 favorite-badge-btn"
                                        style={{ 
                                            width: '32px', 
                                            height: '32px', 
                                            zIndex: 10,
                                            color: '#ef4444',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                                        }}
                                        onClick={(e) => handleRemoveFavorite(book.id, e)}
                                        title="Xóa khỏi yêu thích"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                                <div className="book-info p-3 d-flex flex-column flex-grow-1">
                                    <h3 className="book-title mb-1 text-truncate fw-bold" style={{ fontSize: '0.9rem' }}>{book.name}</h3>
                                    <p className="book-author text-muted small mb-2 text-truncate" style={{ fontSize: '0.75rem' }}>{book.author}</p>
                                    
                                    <div className="price-wrapper d-flex align-items-center gap-2 mb-3">
                                        <span className="current-price fw-bold text-primary" style={{ fontSize: '0.9rem' }}>{Number(book.price).toLocaleString()}đ</span>
                                        {book.original_price > book.price && (
                                            <span className="old-price text-muted text-decoration-line-through smaller" style={{ fontSize: '0.75rem' }}>
                                                {Number(book.original_price).toLocaleString()}đ
                                            </span>
                                        )}
                                    </div>

                                    {/* Nút thêm nhanh vào giỏ hàng ở chân card */}
                                    <Button 
                                        variant="outline-primary"
                                        size="sm"
                                        className="mt-auto rounded-pill fw-bold py-1.5 d-flex align-items-center justify-content-center gap-1.5"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Không click mở Modal
                                            addToCart(book);
                                            alert(`Đã thêm "${book.name}" vào giỏ hàng!`);
                                        }}
                                    >
                                        <FiShoppingCart size={14} /> Mua ngay
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

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
                                    onClick={() => handleToggleFavoriteInModal(selectedBook.id)}
                                    style={{ transition: 'all 0.3s', fontWeight: '600' }}
                                >
                                    <FiHeart fill={favorites.includes(selectedBook.id) ? "currentColor" : "none"} size={18} />
                                    {favorites.includes(selectedBook.id) ? "Đã thích sản phẩm" : "Yêu thích sản phẩm"}
                                </Button>
                            </Col>
                            <Col md={7} className="p-4 p-lg-5 bg-white position-relative">
                                <button className="btn-close position-absolute top-0 end-0 m-3" onClick={() => setShowModal(false)}></button>
                                
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

export default Favorites;
