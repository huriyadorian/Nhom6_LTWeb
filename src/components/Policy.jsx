import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function Policy() {
  const { type } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const policies = {
    'huong-dan-mua-hang': {
      title: 'Hướng dẫn mua hàng',
      content: (
        <>
          <h4>Bước 1: Tìm kiếm sản phẩm</h4>
          <p>Bạn có thể sử dụng thanh tìm kiếm hoặc duyệt qua các danh mục sách trên thanh menu để tìm sản phẩm mong muốn.</p>
          <h4>Bước 2: Thêm vào giỏ hàng</h4>
          <p>Bấm vào sản phẩm để xem chi tiết và ấn nút "Thêm vào giỏ hàng".</p>
          <h4>Bước 3: Đặt hàng và thanh toán</h4>
          <p>Vào biểu tượng giỏ hàng ở góc phải trên cùng để kiểm tra lại sản phẩm, sau đó tiến hành nhập thông tin nhận hàng và chọn phương thức thanh toán.</p>
        </>
      )
    },
    'chinh-sach-doi-tra': {
      title: 'Chính sách đổi trả',
      content: (
        <>
          <h4>Điều kiện đổi trả</h4>
          <p>Sản phẩm bị lỗi kỹ thuật (thiếu trang, bung keo, in mờ,...) hoặc hư hỏng trong quá trình vận chuyển.</p>
          <p>Sản phẩm phải còn nguyên vẹn, không có dấu hiệu đã qua sử dụng và còn đầy đủ phụ kiện (nếu có).</p>
          <h4>Thời gian áp dụng</h4>
          <p>Hỗ trợ đổi trả trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng.</p>
          <h4>Quy trình đổi trả</h4>
          <p>Vui lòng liên hệ với chúng tôi qua số điện thoại hoặc email ở phần chân trang để được hướng dẫn chi tiết về việc gửi trả sản phẩm.</p>
        </>
      )
    }
  };

  const policy = policies[type] || {
    title: 'Thông tin không tồn tại',
    content: <p>Chính sách bạn đang tìm không tồn tại hoặc đã bị xóa. Vui lòng quay lại <Link to="/" style={{color: '#00a650', textDecoration: 'none'}}>Trang chủ</Link>.</p>
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: 'var(--header-bg, #fff)', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#00a650', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
        {policy.title.toUpperCase()}
      </h2>
      <div style={{ lineHeight: '1.6', color: 'var(--text-color, #333)', fontSize: '15px' }}>
        {policy.content}
      </div>
    </div>
  );
}

export default Policy;
