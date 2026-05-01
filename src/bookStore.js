/**
 * bookStore.js — Nguồn dữ liệu chung cho toàn bộ ứng dụng.
 *
 * Admin lưu sản phẩm vào localStorage với key 'adminBooks'.
 * Các trang Home / Category đọc từ đây để luôn hiển thị dữ liệu mới nhất.
 */
import dbData from './database.json';

/** Lấy danh sách sách hiện tại (ưu tiên localStorage, fallback sang JSON gốc) */
export const getBooks = () => {
  try {
    const stored = localStorage.getItem('adminBooks');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn('bookStore: không đọc được localStorage, dùng dữ liệu gốc.', e);
  }
  return dbData.books;
};

/** Lấy sách theo category_id */
export const getBooksByCategory = (catId) =>
  getBooks().filter((b) => b.category_id === catId);

/** Danh mục & NXB (luôn dùng từ JSON vì admin chưa sửa phần này) */
export const categories = dbData.categories;
export const publishers  = dbData.publishers;
