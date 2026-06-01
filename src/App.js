import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Admin from './components/Admin';
import Category from './components/Category';
import Cart from './components/Cart';
import Shop from './components/Shop';
import OrderTracking from './components/OrderTracking';
import SearchResults from './components/SearchResults';
import Favorites from './components/Favorites';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import './index.css';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
      <Header />
      <Container className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:catKey" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Container>
      <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
