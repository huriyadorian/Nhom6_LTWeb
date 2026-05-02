import React, { useRef, useState, useMemo } from 'react';
import { FaShoppingCart, FaArrowUp, FaChevronLeft, FaChevronRight, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getBooks, getBooksByCategory } from '../bookStore';
import './Home.css';

// ── Helper ──────────────────────────────────────────────────────────────────
const fmt = (price) =>
  price ? price.toLocaleString('vi-VN') + 'đ' : '';

const dbBook = (b) => ({
  ...b,
  oldPrice: fmt(b.oldPrice),
  newPrice: fmt(b.newPrice),
  discount: `-${b.discount}%`,
});

// ── Helper lấy sách theo category (luôn gọi để lấy data mới nhất) ────────────
const byCategory = (catId) =>
  getBooksByCategory(catId).map(dbBook);

// ── Components ───────────────────────────────────────────────────────────────
const ProductCard = ({ book }) => (
  <Link to={`/product/${book.id}`} className="home-product-card-link">
    <div className="product-card">
      <div className="product-image-wrapper">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="product-img"
            onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.style.display = 'none'; e.target.parentNode.classList.add('img-fallback'); }}
          />
        ) : (
          <div className="img-placeholder">📚</div>
        )}
      </div>
      <div className="product-title">{book.title}</div>
      <div className="product-price-row">
        <span className="price-original">{book.oldPrice}</span>
        <span className="price-discounted">{book.newPrice}</span>
        <span className="discount-badge">{book.discount}</span>
      </div>
    </div>
  </Link>
);

const SidebarProductCard = ({ book }) => (
  <div className="sidebar-product product-card">
    <div className="product-image-placeholder"></div>
    <div className="product-title" style={{ textAlign: 'left', marginTop: 15 }}>{book.title}</div>
    <div className="product-price-row" style={{ justifyContent: 'center' }}>
      <span className="price-original">{book.oldPrice}</span>
      <span className="price-discounted">{book.newPrice}</span>
      <span className="discount-badge">{book.discount}</span>
    </div>
  </div>
);

const BookSliderSection = ({ title, books }) => {
  const sliderRef = useRef(null);
  const [filter, setFilter] = useState('default');

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const sortedBooks = useMemo(() => {
    if (filter === 'default') return books;
    return [...books].sort((a, b) => {
      const pa = parseInt(a.newPrice.replace(/[^0-9]/g, ''), 10);
      const pb = parseInt(b.newPrice.replace(/[^0-9]/g, ''), 10);
      return filter === 'low' ? pa - pb : pb - pa;
    });
  }, [books, filter]);

  const filters = [
    { key: 'default', label: 'Mới/Nổi bật' },
    { key: 'bestseller', label: 'Bán chạy nhất' },
    { key: 'low', label: 'Giá thấp' },
    { key: 'high', label: 'Giá cao' },
  ];

  return (
    <div className="section-wrapper">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="section-filters">
          {filters.map((f) => (
            <span
              key={f.key}
              className={`filter-link ${filter === f.key ? 'active' : ''}`}
              style={filter === f.key ? { color: '#00a650', fontWeight: 'bold' } : {}}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </span>
          ))}
        </div>
      </div>
      <div className="slider-wrapper">
        <button className="slider-arrow slider-arrow-left" onClick={() => scrollSlider('left')}>
          <FaChevronLeft />
        </button>
        <div className="slider-container" ref={sliderRef}>
          {sortedBooks.map((book) => (
            <div key={book.id} className="slider-item">
              <ProductCard book={book} />
            </div>
          ))}
        </div>
        <button className="slider-arrow slider-arrow-right" onClick={() => scrollSlider('right')}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

// ── SidebarPaginatedBlock: nút < > chuyển trang ──────────────────────────────
const PAGE_SIZE = 3;

const SidebarPaginatedBlock = ({ title, books, style }) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(books.length / PAGE_SIZE);
  const visibleBooks = books.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="section-wrapper" style={{ padding: '0', overflow: 'hidden', ...style }}>
      <div style={{
        backgroundColor: '#e9ecef',
        padding: '12px 15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="section-title" style={{ margin: 0, fontSize: '13px' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={prev}
            disabled={page === 0}
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '3px',
              width: '24px',
              height: '24px',
              cursor: page === 0 ? 'not-allowed' : 'pointer',
              color: page === 0 ? '#ccc' : '#555',
              fontWeight: 'bold',
              fontSize: '13px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            title="Trang trước"
          >
            ‹
          </button>
          <span style={{ fontSize: '11px', color: '#999', minWidth: '30px', textAlign: 'center' }}>
            {page + 1}/{totalPages}
          </span>
          <button
            onClick={next}
            disabled={page >= totalPages - 1}
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '3px',
              width: '24px',
              height: '24px',
              cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
              color: page >= totalPages - 1 ? '#ccc' : '#555',
              fontWeight: 'bold',
              fontSize: '13px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            title="Trang sau"
          >
            ›
          </button>
        </div>
      </div>
      <div style={{ padding: '10px 10px 0 10px' }}>
        {visibleBooks.map((book) => (
          <SidebarProductCard key={book.id} book={book} />
        ))}
        <div className="btn-see-more-sidebar">Xem tất cả</div>
      </div>
    </div>
  );
};

// ── Home ─────────────────────────────────────────────────────────────────────
function Home() {
  const topBooksRef = useRef(null);

  // Lấy dữ liệu từ bookStore (luôn đọc mới nhất từ localStorage)
  const topSellerBooks   = useMemo(() => getBooks().filter((b) => b.isBestSeller).map(dbBook), []);
  const sidebarNewBooks  = useMemo(() => getBooks().filter((b) => b.isNew).slice(0, 4).map(dbBook), []);
  const comboBooks       = useMemo(() => byCategory(4), []);
  const highlightBooks   = useMemo(() => byCategory(3), []);
  const skillBooks       = useMemo(() => byCategory(3), []);
  const kidsBooks        = useMemo(() => byCategory(2), []);
  const literatureBooks  = useMemo(() => byCategory(6), []);
  const referenceBooks   = useMemo(() => byCategory(7), []);
  const mangaBooks       = useMemo(() => byCategory(10), []);

  const scrollSlider = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="home-container">

      {/* Cột Sidebar Trái */}
      <div className="home-sidebar">
        <SidebarPaginatedBlock
          title="SÁCH MỚI LÊN KỆ"
          books={sidebarNewBooks}
          style={{ marginBottom: '20px' }}
        />
        <SidebarPaginatedBlock
          title="SÁCH KINH DOANH"
          books={comboBooks}
          style={{ marginBottom: '20px' }}
        />
        <SidebarPaginatedBlock
          title="TIÊU ĐIỂM SÁCH HAY"
          books={highlightBooks}
        />
      </div>

      {/* Nội Dung Chính */}
      <div className="home-main">

        {/* Top Sách Bán Chạy */}
        <div className="section-wrapper">
          <div className="section-header">
            <h2 className="section-title">TOP SÁCH BÁN CHẠY</h2>
          </div>
          <div className="slider-wrapper">
            <button className="slider-arrow slider-arrow-left" onClick={() => scrollSlider(topBooksRef, 'left')}>
              <FaChevronLeft />
            </button>
            <div className="slider-container" ref={topBooksRef}>
              {topSellerBooks.map((book) => (
                <div key={book.id} className="slider-item">
                  <ProductCard book={book} />
                </div>
              ))}
            </div>
            <button className="slider-arrow slider-arrow-right" onClick={() => scrollSlider(topBooksRef, 'right')}>
              <FaChevronRight />
            </button>
          </div>
          <div className="see-more-link">Xem tất cả</div>
        </div>

        <BookSliderSection title="SÁCH KĨ NĂNG SỐNG"  books={skillBooks} />
        <BookSliderSection title="SÁCH THIẾU NHI"      books={kidsBooks} />
        <BookSliderSection title="SÁCH VĂN HỌC"        books={literatureBooks} />
        <BookSliderSection title="SÁCH THAM KHẢO"      books={referenceBooks} />
        <BookSliderSection title="MANGA - COMIC"        books={mangaBooks} />

      </div>

      {/* FAB */}
      <div className="floating-actions">
        <Link to="/cart" className="fab fab-cart" title="Giỏ Hàng"><FaShoppingCart /></Link>
        <div className="fab fab-top" title="Lên Đầu Trang" onClick={scrollToTop}><FaArrowUp /></div>
        <a href="[Điền link Facebook sau]" target="_blank" rel="noopener noreferrer" className="fab fab-facebook" title="Tới Trang Facebook">
          <FaFacebook />
        </a>
      </div>

    </div>
  );
}

export default Home;
