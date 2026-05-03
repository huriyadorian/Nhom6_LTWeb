import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaMinus, FaPlus, FaArrowLeft, FaStar, FaStarHalfAlt, FaRegStar, FaFacebook, FaArrowUp } from 'react-icons/fa';
import { getBooks, categories, publishers } from '../bookStore';
import './ProductDetail.css';

// ── Format giá tiền ──
const fmt = (n) => (n ? n.toLocaleString('vi-VN') + 'đ' : '');

// ── Hiển thị sao đánh giá ──
const StarRating = ({ rating = 0 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="pd-star filled" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="pd-star filled" />);
    else stars.push(<FaRegStar key={i} className="pd-star" />);
  }
  return <div className="pd-stars">{stars}</div>;
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Lấy sách từ bookStore (localStorage hoặc database.json)
  const book = getBooks().find((b) => b.id === Number(id));

  const [qty, setQty] = useState(1);
  const [cartMsg, setCartMsg] = useState('');
  const [activeTab, setActiveTab] = useState('desc');

  // Kéo lên đầu trang khi mở sản phẩm mới
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!book) {
    return (
      <div className="pd-not-found">
        <div className="pd-not-found-icon">📚</div>
        <h2>Không tìm thấy sản phẩm</h2>
        <p>Sản phẩm bạn tìm có thể đã bị xóa hoặc chưa được thêm vào hệ thống.</p>
        <button className="pd-btn-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Quay lại
        </button>
      </div>
    );
  }

  // Lấy tên nhà xuất bản và danh mục
  const publisher = publishers.find((p) => p.id === book.publisher_id);
  const category  = categories.find((c) => c.id === book.category_id);

  // Thêm vào giỏ hàng (lưu localStorage)
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item.id === book.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: book.id, title: book.title, image: book.image, newPrice: book.newPrice, qty });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated')); // Báo cho Header cập nhật số lượng
    setCartMsg(`✅ Đã thêm ${qty} cuốn vào giỏ hàng!`);
    setTimeout(() => setCartMsg(''), 3000);
  };

  // Thông tin kỹ thuật sản phẩm
  const specs = [
    { label: 'Tác giả',         value: book.author || '—' },
    { label: 'Nhà xuất bản',    value: publisher?.name || '—' },
    { label: 'Năm xuất bản',    value: book.year || '—' },
    { label: 'Số trang',        value: book.pages ? `${book.pages} trang` : '—' },
    { label: 'Kích thước',      value: book.size || '13 × 20.5 cm' },
    { label: 'Khối lượng',      value: book.weight || '200 g' },
    { label: 'Loại bìa',        value: book.cover || 'Bìa mềm' },
    { label: 'Danh mục',        value: category?.name || '—' },
  ];

  return (
    <div className="pd-page">
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <Link to="/" className="pd-bc-link">Trang chủ</Link>
        {' / '}
        <Link to="/category" className="pd-bc-link">Danh mục</Link>
        {category && <>{' / '}<Link to={`/category/${category.slug || ''}`} className="pd-bc-link">{category.name}</Link></>}
        {' / '}
        <span className="pd-bc-current">{book.title}</span>
      </div>

      {/* Layout chính */}
      <div className="pd-layout">

        {/* ── Cột trái: Ảnh ── */}
        <div className="pd-image-col">
          <div className="pd-image-box">
            {book.image ? (
              <img src={book.image} alt={book.title} className="pd-main-img"
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
            ) : (
              <div className="pd-img-placeholder">📚</div>
            )}
          </div>

          {/* Badge */}
          <div className="pd-badge-row">
            {book.isBestSeller && <span className="pd-badge pd-badge-hot">🔥 Bán chạy</span>}
            {book.isNew && <span className="pd-badge pd-badge-new">✨ Mới về</span>}
            {book.isComingSoon && <span className="pd-badge pd-badge-soon">🕐 Sắp ra mắt</span>}
          </div>
        </div>

        {/* ── Cột phải: Thông tin ── */}
        <div className="pd-info-col">

          {/* Tên sách */}
          <h1 className="pd-title">{book.title}</h1>

          {/* Tác giả + Rating */}
          <div className="pd-meta-row">
            {book.author && (
              <span className="pd-author">Tác giả: <strong>{book.author}</strong></span>
            )}
            <div className="pd-rating-row">
              <StarRating rating={book.rating} />
              <span className="pd-rating-text">{book.rating?.toFixed(1)} ({book.sold?.toLocaleString()} đã bán)</span>
            </div>
          </div>

          {/* Giá */}
          <div className="pd-price-box">
            <span className="pd-price-new">{fmt(book.newPrice)}</span>
            {book.oldPrice > book.newPrice && (
              <>
                <span className="pd-price-old">{fmt(book.oldPrice)}</span>
                <span className="pd-discount-badge">-{book.discount}%</span>
              </>
            )}
          </div>

          {/* Tình trạng */}
          <div className={`pd-stock-status ${book.stock === 0 ? 'out' : ''}`}>
            {book.stock === 0
              ? '❌ Hết hàng'
              : book.stock <= 10
                ? `⚠️ Chỉ còn ${book.stock} sản phẩm`
                : `✅ Còn hàng (${book.stock} sản phẩm)`}
          </div>

          {/* Số lượng + Nút thêm giỏ */}
          <div className="pd-action-row">
            <div className="pd-qty-box">
              <button className="pd-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={book.stock === 0}>
                <FaMinus />
              </button>
              <span className="pd-qty-value">{qty}</span>
              <button className="pd-qty-btn" onClick={() => setQty(q => Math.min(book.stock || 99, q + 1))} disabled={book.stock === 0}>
                <FaPlus />
              </button>
            </div>

            <button
              className="pd-add-cart-btn"
              onClick={handleAddToCart}
              disabled={book.stock === 0}
            >
              <FaShoppingCart /> Thêm vào giỏ hàng
            </button>
          </div>

          {/* Thông báo thêm giỏ */}
          {cartMsg && <div className="pd-cart-msg">{cartMsg}</div>}

          {/* Tổng tiền ước tính */}
          {book.stock > 0 && (
            <div className="pd-total-row">
              <span>Tổng tiền:</span>
              <strong className="pd-total-price">{fmt(book.newPrice * qty)}</strong>
            </div>
          )}

          {/* Bảng thông tin kỹ thuật */}
          <div className="pd-specs-table">
            <div className="pd-specs-title">Thông tin sản phẩm</div>
            {specs.map((s) => (
              <div key={s.label} className="pd-spec-row">
                <span className="pd-spec-label">{s.label}</span>
                <span className="pd-spec-value">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs: Mô tả / Chi tiết ── */}
      <div className="pd-tabs-section">
        <div className="pd-tabs-header">
          <button
            className={`pd-tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
            onClick={() => setActiveTab('desc')}
          >
            Mô tả sản phẩm
          </button>
          <button
            className={`pd-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Thông tin chi tiết
          </button>
        </div>

        <div className="pd-tab-content">
          {activeTab === 'desc' ? (
            <div className="pd-description">
              {book.description
                ? <p>{book.description}</p>
                : <p className="pd-desc-empty">Chưa có mô tả cho sản phẩm này.</p>}
            </div>
          ) : (
            <div className="pd-specs-full">
              {specs.map((s) => (
                <div key={s.label} className="pd-spec-row">
                  <span className="pd-spec-label">{s.label}</span>
                  <span className="pd-spec-value">{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nút quay lại */}
      <div className="pd-back-row">
        <button className="pd-btn-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Quay lại
        </button>
      </div>

      {/* FAB */}
      <div className="floating-actions">
        <Link to="/cart" className="fab fab-cart" title="Giỏ Hàng"><FaShoppingCart /></Link>
        <div className="fab fab-top" title="Lên Đầu Trang" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><FaArrowUp /></div>
        <a href="[Điền link Facebook sau]" target="_blank" rel="noopener noreferrer" className="fab fab-facebook" title="Facebook">
          <FaFacebook />
        </a>
      </div>
    </div>
  );
}

export default ProductDetail;
