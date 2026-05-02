import React, { useState, useMemo } from 'react';
import { FaChevronRight, FaShoppingCart, FaArrowUp, FaFacebook } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getBooks, categories, publishers } from '../bookStore';
import './Category.css';

// ── Helper ───────────────────────────────────────────────────────────────────
const fmt = (price) => (price ? price.toLocaleString('vi-VN') + 'đ' : '');

// ── ProductCard ───────────────────────────────────────────────────────────────
const ProductCard = ({ book }) => (
  <Link to={`/product/${book.id}`} className="cat-product-card-link">
    <div className="cat-product-card">
      <div className="cat-product-image-wrapper">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="cat-product-img"
            onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.style.display = 'none'; e.target.parentNode.classList.add('cat-img-fallback'); }}
          />
        ) : (
          <div className="cat-img-placeholder">📚</div>
        )}
      </div>
      <div className="cat-product-title">{book.title}</div>
      <div className="cat-product-price-row">
        <span className="cat-price-original">{fmt(book.oldPrice)}</span>
        <span className="cat-price-discounted">{fmt(book.newPrice)}</span>
        <span className="cat-discount-badge">-{book.discount}%</span>
      </div>
    </div>
  </Link>
);

// ── CategoryBlock ─────────────────────────────────────────────────────────────
const CategoryBlock = ({ title, books }) => {
  const [filter, setFilter] = useState('default');

  const sorted = useMemo(() => {
    if (filter === 'bestseller') return books.filter((b) => b.isBestSeller);
    if (filter === 'discount')   return [...books].sort((a, b) => b.discount - a.discount);
    if (filter === 'new')        return books.filter((b) => b.isNew);
    if (filter === 'coming')     return books.filter((b) => b.isComingSoon);
    return books;
  }, [books, filter]);

  const filterBtns = [
    { key: 'new',        label: 'Mới / Nổi bật' },
    { key: 'bestseller', label: 'Bán chạy nhất' },
    { key: 'discount',   label: 'Giảm giá nhiều' },
    { key: 'coming',     label: 'Sắp phát hành' },
  ];

  return (
    <div className="cat-section-wrapper">
      <div className="cat-section-header">
        <h2 className="cat-section-title">{title}</h2>
        <div className="cat-section-filters">
          {filterBtns.map((f) => (
            <span
              key={f.key}
              className={`cat-filter-link ${filter === f.key ? 'active' : ''}`}
              style={filter === f.key ? { color: '#00a650', fontWeight: 'bold' } : {}}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </span>
          ))}
        </div>
      </div>
      <div className="cat-grid">
        {sorted.length > 0
          ? sorted.map((book) => <ProductCard key={book.id} book={book} />)
          : <p style={{ color: '#888', padding: '10px' }}>Không có sách phù hợp.</p>
        }
      </div>
      <div className="cat-see-more">Xem tất cả</div>
    </div>
  );
};

// ── Category Page ─────────────────────────────────────────────────────────────
function Category() {
  const { slug } = useParams(); // undefined nếu ở /category, có giá trị nếu ở /category/:slug
  const navigate = useNavigate();

  // Slug đặc biệt không phải danh mục thông thường
  const SPECIAL_SLUGS = {
    'top-best-seller': { label: 'Top Best Seller', filter: (b) => b.isBestSeller },
    'sach-moi':        { label: 'Sách Mới',         filter: (b) => b.isNew },
    'sach-sap-phat-hanh': { label: 'Sách Sắp Phát Hành', filter: (b) => b.isComingSoon },
  };

  const specialSlug = slug && SPECIAL_SLUGS[slug] ? SPECIAL_SLUGS[slug] : null;

  // Tìm danh mục hiện tại theo slug (chỉ khi không phải slug đặc biệt)
  const activeCat = !specialSlug && slug
    ? categories.find((c) => c.slug === slug) || null
    : null;

  // Filter: nhà xuất bản & giá
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  const priceRanges = [
    { label: 'Dưới 100,000đ',       min: 0,      max: 100000 },
    { label: '100,000đ - 200,000đ', min: 100000, max: 200000 },
    { label: '200,000đ - 300,000đ', min: 200000, max: 300000 },
    { label: 'Trên 400,000đ',       min: 400000, max: Infinity },
  ];

  const togglePublisher = (id) =>
    setSelectedPublishers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  // Reset filter khi đổi danh mục
  const handleCatChange = (catSlug) => {
    setSelectedPublishers([]);
    setSelectedPriceRange(null);
    if (catSlug) {
      navigate(`/category/${catSlug}`);
    } else {
      navigate('/category');
    }
  };

  // Sách đã lọc — đọc từ bookStore (luôn lấy dữ liệu mới nhất từ localStorage)
  const filteredBooks = useMemo(() => {
    return getBooks().filter((b) => {
      const specialOk = !specialSlug || specialSlug.filter(b);
      const catOk     = specialSlug ? true : (!activeCat || b.category_id === activeCat.id);
      const pubOk     = selectedPublishers.length === 0 || selectedPublishers.includes(b.publisher_id);
      const range     = priceRanges[selectedPriceRange];
      const priceOk   = !range || (b.newPrice >= range.min && b.newPrice < range.max);
      return specialOk && catOk && pubOk && priceOk;
    });
  }, [activeCat, specialSlug, selectedPublishers, selectedPriceRange]);

  // Danh mục sẽ render trong main
  const categoriesToShow = activeCat
    ? categories.filter((c) => c.id === activeCat.id)
    : specialSlug
      ? []
      : categories;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="category-page">
      {/* Breadcrumb */}
      <div className="cat-breadcrumb">
        <Link to="/" className="cat-breadcrumb-link">Trang chủ</Link>
        {' / '}
        <Link to="/category" className="cat-breadcrumb-link" style={{ color: '#00a650' }}
          onClick={() => handleCatChange(null)}>
          Danh mục
        </Link>
        {activeCat && <> {' / '} <span>{activeCat.name}</span></>}
        {specialSlug && <> {' / '} <span>{specialSlug.label}</span></>}
        {!activeCat && !specialSlug && <> {' / '} <span>Tất cả sản phẩm</span></>}
      </div>

      <div className="cat-container">
        {/* ── Sidebar ── */}
        <div className="cat-sidebar-wrapper">

          {/* Danh mục sản phẩm */}
          <aside className="cat-sidebar">
            <div className="cat-sidebar-header">DANH MỤC SẢN PHẨM</div>
            <ul className="cat-sidebar-menu">
              {/* Tất cả */}
              <li
                className={`cat-sidebar-item ${!activeCat ? 'active' : ''}`}
                onClick={() => handleCatChange(null)}
              >
                <FaChevronRight className="cat-menu-icon" />
                <span>Tất cả</span>
              </li>

              {/* Từng danh mục */}
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className={`cat-sidebar-item ${activeCat?.id === cat.id ? 'active' : ''}`}
                >
                  <Link
                    to={`/category/${cat.slug}`}
                    className="cat-sidebar-link"
                    onClick={() => { setSelectedPublishers([]); setSelectedPriceRange(null); }}
                  >
                    <FaChevronRight className="cat-menu-icon" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Lọc sản phẩm */}
          <aside className="cat-sidebar" style={{ marginTop: '20px' }}>
            <div className="cat-sidebar-header">LỌC SẢN PHẨM</div>

            <div className="cat-filter-group">
              <h3 className="cat-filter-title">NHÀ XUẤT BẢN</h3>
              <div className="cat-sidebar-filter-content">
                {publishers.map((pub) => (
                  <label key={pub.id} className="cat-filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPublishers.includes(pub.id)}
                      onChange={() => togglePublisher(pub.id)}
                    />
                    {' '}{pub.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="cat-filter-divider"></div>

            <div className="cat-filter-group">
              <h3 className="cat-filter-title">GIÁ</h3>
              <div className="cat-sidebar-filter-content">
                {priceRanges.map((r, i) => (
                  <label key={i} className="cat-filter-checkbox">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedPriceRange === i}
                      onChange={() =>
                        setSelectedPriceRange(selectedPriceRange === i ? null : i)
                      }
                    />
                    {' '}{r.label}
                  </label>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* ── Main Content ── */}
        <main className="cat-main">
          <div className="cat-main-header">
            {specialSlug
              ? specialSlug.label.toUpperCase()
              : activeCat
                ? activeCat.name.toUpperCase()
                : 'TẤT CẢ SẢN PHẨM'}
            <span style={{ fontSize: '13px', fontWeight: 400, marginLeft: '10px', color: '#888' }}>
              ({filteredBooks.length} sản phẩm)
            </span>
          </div>

          {/* Slug đặc biệt: hiển thị tất cả sách trong 1 block */}
          {specialSlug && filteredBooks.length > 0 && (
            <CategoryBlock
              key="special"
              title={specialSlug.label.toUpperCase()}
              books={filteredBooks}
            />
          )}

          {/* Danh mục thông thường */}
          {categoriesToShow.map((cat) => {
            const booksInCat = filteredBooks.filter((b) => b.category_id === cat.id);
            if (booksInCat.length === 0) return null;
            return (
              <CategoryBlock
                key={cat.id}
                title={cat.name.toUpperCase()}
                books={booksInCat}
              />
            );
          })}

          {filteredBooks.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              Không tìm thấy sản phẩm phù hợp với bộ lọc đã chọn.
            </div>
          )}
        </main>
      </div>

      {/* FAB */}
      <div className="floating-actions">
        <Link to="/cart" className="fab fab-cart" title="Giỏ Hàng"><FaShoppingCart /></Link>
        <div className="fab fab-top" title="Lên Đầu Trang" onClick={scrollToTop}><FaArrowUp /></div>
        <a href="[Điền link Facebook sau]" target="_blank" rel="noopener noreferrer"
          className="fab fab-facebook" title="Tới Trang Facebook">
          <FaFacebook />
        </a>
      </div>
    </div>
  );
}

export default Category;
