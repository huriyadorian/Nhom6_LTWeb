import Header from './components/Header';
import List from './components/list';
import Contact from './components/Contact';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: 'rgba(35,35,41,0.95)', minHeight: '100vh' }}>  
        <Header />
        <Routes>
          <Route path="/" element={<div style={{ padding: '20px', color: 'white' }}><h1>Trang Chủ</h1><p>Chào mừng đến với trang web!</p></div>} />
          <Route path="/list" element={<List />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
