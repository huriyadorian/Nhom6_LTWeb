import React, { useRef, useState } from 'react';
import { FaShoppingCart, FaArrowUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Home.css';

const mockBooks = [
  { id: 1, title: '101 Từ Đầu Tiên Cho Bé - Động Vật', oldPrice: '60,000đ', newPrice: '48,000đ', discount: '-20%' },
  { id: 2, title: 'Tuyển Tập Truyện Cổ Tích Việt Nam', oldPrice: '125,000đ', newPrice: '100,000đ', discount: '-20%' },
  { id: 3, title: 'Thai Giáo Theo Chuyên Gia - 280 ngày', oldPrice: '115,000đ', newPrice: '92,000đ', discount: '-20%' },
  { id: 4, title: 'Combo Tri Thức Cho Một Thai Kì Khỏe Mạnh', oldPrice: '255,000đ', newPrice: '191,250đ', discount: '-25%' },
  { id: 11, title: 'Combo Cẩm Nang Về Tuổi Dậy Thì', oldPrice: '275,000đ', newPrice: '206,250đ', discount: '-25%' },
  { id: 12, title: 'Combo Rèn Luyện Kỹ Năng Sống', oldPrice: '505,000đ', newPrice: '378,750đ', discount: '-25%' }
];

const mockSkillBooks = [
  { id: 5, title: 'Combo 2 Cuốn Làm Chủ Cảm Xúc', oldPrice: '150,000đ', newPrice: '112,500đ', discount: '-25%' },
  { id: 6, title: 'Chuẩn Mực Công Việc Mới', oldPrice: '88,000đ', newPrice: '66,000đ', discount: '-25%' },
  { id: 7, title: 'Công Việc Của Bạn Có Đáng Làm ', oldPrice: '140,000đ', newPrice: '112,000đ', discount: '-20%' },
  { id: 8, title: 'Làm Chủ Cảm Xúc Cuộc Đời', oldPrice: '95,000đ', newPrice: '76,000đ', discount: '-20%' }
];

const mockKidsBooks = [
  { id: 18, title: 'Truyện Cổ Tích Grimm - Trọn Bộ Mới Nhất', oldPrice: '185,000đ', newPrice: '148,000đ', discount: '-20%' },
  { id: 19, title: 'Truyện Cổ Tích Andersen - Bản Gốc', oldPrice: '200,000đ', newPrice: '160,000đ', discount: '-20%' },
  { id: 20, title: 'Nghìn Lẻ Một Đêm - Trọn Bộ Thơ Âu', oldPrice: '320,000đ', newPrice: '256,000đ', discount: '-20%' },
  { id: 21, title: 'Truyện Cổ Tích Việt Nam Chọn Lọc', oldPrice: '100,000đ', newPrice: '80,000đ', discount: '-20%' },
  { id: 22, title: 'Cổ Tích Thế Giới - Những Bà Tiên', oldPrice: '145,000đ', newPrice: '116,000đ', discount: '-20%' }
];

const mockSidebarBooks = [
  { id: 9, title: 'Sách: Công Việc Của Bạn Có Đáng Làm K...', oldPrice: '140,000đ', newPrice: '112,000đ', discount: '-20%' },
  { id: 10, title: 'Sách: Triết Lí To To Cho Đám Trẻ Nhỏ Nhỏ', oldPrice: '195,000đ', newPrice: '156,000đ', discount: '-20%' }
];

const mockComboBooks = [
  { id: 13, title: 'Combo 2 Cuốn Giáo Dục Tiền Tiểu Học', oldPrice: '120,000đ', newPrice: '96,000đ', discount: '-20%' },
  { id: 14, title: 'Combo Trí Tuệ Xúc Cảm Dành Cho... ', oldPrice: '250,000đ', newPrice: '200,000đ', discount: '-20%' },
  { id: 15, title: 'Combo Kỹ Năng Sống Cùng Con', oldPrice: '160,000đ', newPrice: '128,000đ', discount: '-20%' },
  { id: 16, title: 'Combo Bí Quyết Chọn Đồ Chơi Cho Bé', oldPrice: '90,000đ', newPrice: '72,000đ', discount: '-20%' },
  { id: 17, title: 'Combo Quản Lý Sức Khỏe Gia Đình', oldPrice: '210,000đ', newPrice: '168,000đ', discount: '-20%' }
];

const mockHighlightsBooks = [
  { id: 23, title: 'Sách: Nghệ Thuật Sống Khỏe Mỗi Ngày', oldPrice: '110,000đ', newPrice: '88,000đ', discount: '-20%' },
  { id: 24, title: 'Sách: Thói Quen Nhỏ Sức Mạnh Lớn', oldPrice: '135,000đ', newPrice: '108,000đ', discount: '-20%' },
  { id: 25, title: 'Sách: Đi Tìm Lẽ Sống Tương Lai', oldPrice: '180,000đ', newPrice: '144,000đ', discount: '-20%' },
  { id: 26, title: 'Sách: Hành Trình Của Tâm Hồn Bình Yên', oldPrice: '125,000đ', newPrice: '100,000đ', discount: '-20%' },
  { id: 27, title: 'Sách: Dám Bị Ghét, Dám Thành Công', oldPrice: '150,000đ', newPrice: '120,000đ', discount: '-20%' }
];

const mockLiteratureBooks = [
  { id: 28, title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', oldPrice: '150,000đ', newPrice: '120,000đ', discount: '-20%' },
  { id: 29, title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', oldPrice: '125,000đ', newPrice: '100,000đ', discount: '-20%' },
  { id: 30, title: 'Cây Cam Ngọt Của Tôi', oldPrice: '138,000đ', newPrice: '110,400đ', discount: '-20%' },
  { id: 31, title: 'Sự Im Lặng Của Bầy Cừu', oldPrice: '180,000đ', newPrice: '144,000đ', discount: '-20%' },
  { id: 32, title: 'Nhà Giả Kim (Bản Kỷ Niệm)', oldPrice: '110,000đ', newPrice: '88,000đ', discount: '-20%' }
];

const mockReferenceBooks = [
  { id: 33, title: 'Combo Luyện Thi THPT Quốc Gia', oldPrice: '300,000đ', newPrice: '240,000đ', discount: '-20%' },
  { id: 34, title: 'Giải Tích Đại Cương Chuyên Sâu', oldPrice: '120,000đ', newPrice: '96,000đ', discount: '-20%' },
  { id: 35, title: 'Từ Điển Anh-Việt Bỏ Túi', oldPrice: '85,000đ', newPrice: '68,000đ', discount: '-20%' },
  { id: 36, title: 'Luyện Siêu Trí Nhớ Từ Vựng Tiếng Anh', oldPrice: '200,000đ', newPrice: '160,000đ', discount: '-20%' },
  { id: 37, title: 'Hack Não 1500 Từ Vựng Tiếng Anh', oldPrice: '450,000đ', newPrice: '360,000đ', discount: '-20%' }
];

const mockMangaBooks = [
  { id: 38, title: 'Chú Thuật Hồi Chiến (Jujutsu Kaisen)', oldPrice: '45,000đ', newPrice: '36,000đ', discount: '-20%' },
  { id: 39, title: 'Thám Tử Lừng Danh Conan', oldPrice: '25,000đ', newPrice: '20,000đ', discount: '-20%' },
  { id: 40, title: 'Thanh Gươm Diệt Quỷ (Demon Slayer)', oldPrice: '40,000đ', newPrice: '32,000đ', discount: '-20%' },
  { id: 41, title: 'Học Viện Siêu Anh Hùng', oldPrice: '35,000đ', newPrice: '28,000đ', discount: '-20%' },
  { id: 42, title: 'One Piece - Đảo Hải Tặc', oldPrice: '30,000đ', newPrice: '24,000đ', discount: '-20%' }
];

const ProductCard = ({ book }) => (
  <div className="product-card">
    <div className="product-image-wrapper">
      {/* Dynamic image would go here: <img src={book.img} /> */}
    </div>
    <div className="product-title">{book.title}</div>
    <div className="product-price-row">
      <span className="price-original">{book.oldPrice}</span>
      <span className="price-discounted">{book.newPrice}</span>
      <span className="discount-badge">{book.discount}</span>
    </div>
  </div>
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

function Home() {
  const topBooksRef = useRef(null);
  const skillBooksRef = useRef(null);
  const kidsBooksRef = useRef(null);
  const literatureBooksRef = useRef(null);
  const refBooksRef = useRef(null);
  const mangaBooksRef = useRef(null);
  const [showAllCombos, setShowAllCombos] = useState(false);
  const [showAllHighlights, setShowAllHighlights] = useState(false);

  const scrollSlider = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-container">

      {/* Left Sidebar - Hidden on mobile via CSS flex-direction/display none */}
      <div className="home-sidebar">
        {/* Block 1: SÁCH MỚI LÊN KỆ */}
        <div className="section-wrapper" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#e9ecef', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="section-title" style={{ margin: 0, fontSize: '13px' }}>SÁCH MỚI LÊN KỆ</div>
            <div style={{ color: '#888', fontWeight: 'bold' }}>&lt; &gt;</div>
          </div>
          <div style={{ padding: '10px 10px 0 10px' }}>
            {mockSidebarBooks.map(book => (
              <SidebarProductCard key={book.id} book={book} />
            ))}
            <div className="btn-see-more-sidebar">Xem thêm</div>
          </div>
        </div>

        {/* Block 2: COMBO BÁN CHẠY */}
        <div className="section-wrapper" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#e9ecef', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="section-title" style={{ margin: 0, fontSize: '13px' }}>COMBO BÁN CHẠY</div>
            <div style={{ color: '#888', fontWeight: 'bold' }}>&lt; &gt;</div>
          </div>
          <div style={{ padding: '10px 10px 0 10px' }}>
            {mockComboBooks.slice(0, showAllCombos ? mockComboBooks.length : 3).map(book => (
              <SidebarProductCard key={book.id} book={book} />
            ))}
            {mockComboBooks.length > 3 && (
              <div 
                className="btn-see-more-sidebar" 
                onClick={() => setShowAllCombos(!showAllCombos)}
              >
                {showAllCombos ? 'Ẩn bớt' : 'Xem thêm'}
              </div>
            )}
          </div>
        </div>

        {/* Block 3: TIÊU ĐIỂM SÁCH HAY */}
        <div className="section-wrapper" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#e9ecef', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="section-title" style={{ margin: 0, fontSize: '13px' }}>TIÊU ĐIỂM SÁCH HAY</div>
            <div style={{ color: '#888', fontWeight: 'bold' }}>&lt; &gt;</div>
          </div>
          <div style={{ padding: '10px 10px 0 10px' }}>
            {mockHighlightsBooks.slice(0, showAllHighlights ? mockHighlightsBooks.length : 3).map(book => (
              <SidebarProductCard key={book.id} book={book} />
            ))}
            {mockHighlightsBooks.length > 3 && (
              <div 
                className="btn-see-more-sidebar" 
                onClick={() => setShowAllHighlights(!showAllHighlights)}
              >
                {showAllHighlights ? 'Ẩn bớt' : 'Xem thêm'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="home-main">

        {/* Section: Top Sách Bán Chạy */}
        <div className="section-wrapper">
          <div className="section-header">
            <h2 className="section-title">TOP SÁCH BÁN CHẠY</h2>
          </div>
          <div className="slider-wrapper">
            <button className="slider-arrow slider-arrow-left" onClick={() => scrollSlider(topBooksRef, 'left')}>
              <FaChevronLeft />
            </button>
            <div className="slider-container" ref={topBooksRef}>
              {mockBooks.map(book => (
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

        {/* Section: Sách Kĩ Năng Sống */}
        <div className="section-wrapper">
          <div className="section-header">
            <h2 className="section-title">SÁCH KĨ NĂNG SỐNG</h2>
            <div className="section-filters">
              <span className="filter-link">Mới/Nổi bật</span>
              <span className="filter-link" style={{ color: '#333', fontWeight: 600 }}>Bán chạy nhất</span>
              <span className="filter-link">Giá thấp</span>
              <span className="filter-link">Giá cao</span>
            </div>
          </div>
          <div className="slider-wrapper">
            <button className="slider-arrow slider-arrow-left" onClick={() => scrollSlider(skillBooksRef, 'left')}>
              <FaChevronLeft />
            </button>
            <div className="slider-container" ref={skillBooksRef}>
              {mockSkillBooks.map(book => (
                <div key={book.id} className="slider-item">
                  <ProductCard book={book} />
                </div>
              ))}
            </div>
            <button className="slider-arrow slider-arrow-right" onClick={() => scrollSlider(skillBooksRef, 'right')}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Section: Sách Thiếu Nhi */}
        <div className="section-wrapper">
          <div className="section-header">
            <h2 className="section-title">SÁCH THIẾU NHI</h2>
            <div className="section-filters">
              <span className="filter-link">Mới/Nổi bật</span>
              <span className="filter-link" style={{ color: '#333', fontWeight: 600 }}>Bán chạy nhất</span>
              <span className="filter-link">Giá thấp</span>
              <span className="filter-link">Giá cao</span>
            </div>
          </div>
          <div className="slider-wrapper">
            <button className="slider-arrow slider-arrow-left" onClick={() => scrollSlider(kidsBooksRef, 'left')}>
              <FaChevronLeft />
            </button>
            <div className="slider-container" ref={kidsBooksRef}>
              {mockKidsBooks.map(book => (
                <div key={book.id} className="slider-item">
                  <ProductCard book={book} />
                </div>
              ))}
            </div>
            <button className="slider-arrow slider-arrow-right" onClick={() => scrollSlider(kidsBooksRef, 'right')}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Section: Sách Văn Học */}
        <div className="section-wrapper">
          <div className="section-header">
            <h2 className="section-title">SÁCH VĂN HỌC</h2>
            <div className="section-filters">
              <span className="filter-link">Mới/Nổi bật</span>
              <span className="filter-link" style={{ color: '#333', fontWeight: 600 }}>Bán chạy nhất</span>
              <span className="filter-link">Giá thấp</span>
              <span className="filter-link">Giá cao</span>
            </div>
          </div>
          <div className="slider-wrapper">
            <button className="slider-arrow slider-arrow-left" onClick={() => scrollSlider(literatureBooksRef, 'left')}>
              <FaChevronLeft />
            </button>
            <div className="slider-container" ref={literatureBooksRef}>
              {mockLiteratureBooks.map(book => (
                <div key={book.id} className="slider-item">
                  <ProductCard book={book} />
                </div>
              ))}
            </div>
            <button className="slider-arrow slider-arrow-right" onClick={() => scrollSlider(literatureBooksRef, 'right')}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Section: Sách Tham Khảo */}
        <div className="section-wrapper">
          <div className="section-header">
            <h2 className="section-title">SÁCH THAM KHẢO</h2>
            <div className="section-filters">
              <span className="filter-link">Mới/Nổi bật</span>
              <span className="filter-link" style={{ color: '#333', fontWeight: 600 }}>Bán chạy nhất</span>
              <span className="filter-link">Giá thấp</span>
              <span className="filter-link">Giá cao</span>
            </div>
          </div>
          <div className="slider-wrapper">
            <button className="slider-arrow slider-arrow-left" onClick={() => scrollSlider(refBooksRef, 'left')}>
              <FaChevronLeft />
            </button>
            <div className="slider-container" ref={refBooksRef}>
              {mockReferenceBooks.map(book => (
                <div key={book.id} className="slider-item">
                  <ProductCard book={book} />
                </div>
              ))}
            </div>
            <button className="slider-arrow slider-arrow-right" onClick={() => scrollSlider(refBooksRef, 'right')}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Section: Manga */}
        <div className="section-wrapper">
          <div className="section-header">
            <h2 className="section-title">MANGA - COMIC</h2>
            <div className="section-filters">
              <span className="filter-link">Mới/Nổi bật</span>
              <span className="filter-link" style={{ color: '#333', fontWeight: 600 }}>Bán chạy nhất</span>
              <span className="filter-link">Giá thấp</span>
              <span className="filter-link">Giá cao</span>
            </div>
          </div>
          <div className="slider-wrapper">
            <button className="slider-arrow slider-arrow-left" onClick={() => scrollSlider(mangaBooksRef, 'left')}>
              <FaChevronLeft />
            </button>
            <div className="slider-container" ref={mangaBooksRef}>
              {mockMangaBooks.map(book => (
                <div key={book.id} className="slider-item">
                  <ProductCard book={book} />
                </div>
              ))}
            </div>
            <button className="slider-arrow slider-arrow-right" onClick={() => scrollSlider(mangaBooksRef, 'right')}>
              <FaChevronRight />
            </button>
          </div>
        </div>

      </div>

      {/* Floating Action Buttons */}
      <div className="floating-actions">
        <div className="fab fab-cart" title="Giỏ Hàng">
          <FaShoppingCart />
        </div>
        <div className="fab fab-top" title="Lên Đầu Trang" onClick={scrollToTop}>
          <FaArrowUp />
        </div>
        <div className="fab fab-zalo" title="Chat Zalo">
          Zalo
        </div>
      </div>

    </div>
  );
}

export default Home;
