import Header from './components/Header';
import Contact from './components/Contact';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-color)' }}>
        <Header />
        <Routes>
          <Route path="/" element={<div style={{ padding: '20px' }}></div>} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
