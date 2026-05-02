import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { getBooks } from '../bookStore';
import './Cart.css';

const fmt = (n) => (n ? n.toLocaleString('vi-VN') + 'đ' : '');

// Đọc giỏ hàng từ localStorage
const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
};

// Lưu giỏ hàng vào localStorage
const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(loadCart);

  // Đồng bộ lại thông tin mới nhất từ bookStore (giá, ảnh)
  const books = getBooks();
  const enriched = cartItems.map((item) => {
    const book = books.find((b) => b.id === item.id);
    return book
      ? { ...item, newPrice: book.newPrice, oldPrice: book.oldPrice, image: book.image, title: book.title }
      : item;
  });

  // Lưu mỗi khi giỏ thay đổi
  useEffect(() => {
    saveCart(cartItems);
    // Kích hoạt sự kiện để Header cập nhật badge số lượng
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cartItems]);

  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Tính tổng
  const totalQty = enriched.reduce((s, i) => s + i.qty, 0);
  const totalPrice = enriched.reduce((s, i) => s + (i.newPrice || 0) * i.qty, 0);

  return (
    <div className="cart-page">
      {/* Breadcrumb */}
      <div className="cart-breadcrumb">
        <Link to="/" className="cart-bc-link">Trang chủ</Link>
        {' / '}
        <span>Giỏ hàng</span>
      </div>

      <h1 className="cart-title">
        <FaShoppingCart className="cart-title-icon" />
        Giỏ Hàng Của Bạn
        {totalQty > 0 && <span className="cart-count-badge">{totalQty}</span>}
      </h1>

      {/* Giỏ rỗng */}
      {enriched.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Không có sản phẩm trong giỏ hàng của bạn</h2>
          <p>Hãy thêm sản phẩm vào giỏ hàng để tiến hành mua sắm!</p>
          <Link to="/category" className="cart-btn-shop">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="cart-layout">

          {/* Danh sách sản phẩm */}
          <div className="cart-items-col">
            <div className="cart-items-header">
              <span>Sản phẩm ({totalQty})</span>
              <button className="cart-clear-btn" onClick={clearCart}>
                <FaTrash /> Xóa tất cả
              </button>
            </div>

            {enriched.map((item) => (
              <div key={item.id} className="cart-item">
                {/* Ảnh */}
                <Link to={`/product/${item.id}`} className="cart-item-img-link">
                  <div className="cart-item-img-box">
                    {item.image ? (
                      <img src={item.image} alt={item.title}
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <span className="cart-item-img-placeholder">📚</span>
                    )}
                  </div>
                </Link>

                {/* Thông tin */}
                <div className="cart-item-info">
                  <Link to={`/product/${item.id}`} className="cart-item-title">
                    {item.title}
                  </Link>
                  <div className="cart-item-price">
                    {fmt(item.newPrice)}
                    {item.oldPrice > item.newPrice && (
                      <s className="cart-item-old-price">{fmt(item.oldPrice)}</s>
                    )}
                  </div>
                </div>

                {/* Số lượng */}
                <div className="cart-item-qty-box">
                  <button className="cart-qty-btn" onClick={() => updateQty(item.id, -1)}>
                    <FaMinus />
                  </button>
                  <span className="cart-qty-val">{item.qty}</span>
                  <button className="cart-qty-btn" onClick={() => updateQty(item.id, 1)}>
                    <FaPlus />
                  </button>
                </div>

                {/* Thành tiền */}
                <div className="cart-item-subtotal">
                  {fmt((item.newPrice || 0) * item.qty)}
                </div>

                {/* Nút xóa */}
                <button className="cart-item-remove" onClick={() => removeItem(item.id)} title="Xóa">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="cart-summary-col">
            <div className="cart-summary-box">
              <h3 className="cart-summary-title">Tóm tắt đơn hàng</h3>

              <div className="cart-summary-row">
                <span>Tạm tính ({totalQty} sản phẩm)</span>
                <span>{fmt(totalPrice)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Phí vận chuyển</span>
                <span className="cart-free-ship">Miễn phí</span>
              </div>
              <div className="cart-summary-divider"></div>
              <div className="cart-summary-total">
                <span>Tổng cộng</span>
                <strong>{fmt(totalPrice)}</strong>
              </div>

              <button className="cart-checkout-btn">
                Tiến hành thanh toán →
              </button>

              <button className="cart-continue-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
