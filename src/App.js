import Header from './components/Header';
import Home from './components/Home';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Category from './components/Category';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang Admin (không có Header/Footer chung) */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Trang khách hàng (có Header và Footer) */}
        <Route path="/*" element={
          <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-color)' }}>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/category" element={<Category />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
