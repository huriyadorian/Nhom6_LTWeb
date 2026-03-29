import React from 'react';
import './list.css';

function List() {
  return (
    <div className="filter-container">
      <div className="search-bar">
        <input type="text" placeholder="Nhập từ khóa" className="search-input" />
        <button className="search-button">Tìm Kiếm</button>
      </div>

      <div className="filter-section">
        <div className="filter-title">Trạng Thái <span className="arrow">▼</span></div>
        <div className="filter-options">
          <label><input type="checkbox" /> Chưa bắt đầu</label>
          <label><input type="checkbox" /> Đã dừng</label>
          <label><input type="checkbox" /> Hoãn lại</label>
          <label><input type="checkbox" /> Đang thực hiện</label>
          <label><input type="checkbox" /> Hoàn thành</label>
          <label><input type="checkbox" /> Có Truyện Chữ</label>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-title">Thể Loại <span className="arrow">▼</span></div>
        <div className="filter-options">
          <label><input type="checkbox" /> Anime</label>
          <label><input type="checkbox" /> Drama</label>
          <label><input type="checkbox" /> Josei</label>
          <label><input type="checkbox" /> Manhwa</label>
          <label><input type="checkbox" /> One Shot</label>
          <label><input type="checkbox" /> Shounen</label>
          <label><input type="checkbox" /> Webtoons</label>
          <label><input type="checkbox" /> Slice of life</label>
          <label><input type="checkbox" /> Isekai</label>
          <label><input type="checkbox" /> Manga</label>
          <label><input type="checkbox" /> Hành Động</label>
          <label><input type="checkbox" /> Phiêu Lưu</label>
          <label><input type="checkbox" /> Hài Hước</label>
          <label><input type="checkbox" /> Lãng Mạn</label>
          <label><input type="checkbox" /> Thể Thao</label>
          <label><input type="checkbox" /> Học Đường</label>
          <label><input type="checkbox" /> Lịch Sử</label>
          <label><input type="checkbox" /> Siêu Nhiên</label>
          <label><input type="checkbox" /> Bi Kịch</label>
          <label><input type="checkbox" /> Trùng Sinh</label>
          <label><input type="checkbox" /> Khoa Học</label>
          <label><input type="checkbox" /> Truyện Màu</label>
          <label><input type="checkbox" /> Người Lớn</label>
          <label><input type="checkbox" /> Ngôn Tình</label>
          <label><input type="checkbox" /> Nữ Cường</label>
          <label><input type="checkbox" /> Gender Bender</label>
          <label><input type="checkbox" /> Murim</label>
          <label><input type="checkbox" /> Leo Tháp</label>
          <label><input type="checkbox" /> Nấu Ăn</label>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-title">Sắp Xếp <span className="arrow">▼</span></div>
        <div className="filter-options">
          <label><input type="checkbox" /> Lượt xem</label>
          <label><input type="checkbox" /> Lượt đánh giá</label>
          <label><input type="checkbox" /> Lượt theo dõi</label>
          <label><input type="checkbox" /> Ngày Cập Nhật</label>
          <label><input type="checkbox" /> Truyện Mới</label>
        </div>
      </div>

      <div className="content-section">
        <div className="filter-title">Nội Dung</div>
        <div className="content-area">Khu Vực Hiển Thị Kết Quả Tìm Kiếm...</div>
      </div>
    </div>
  );
}

export default List;