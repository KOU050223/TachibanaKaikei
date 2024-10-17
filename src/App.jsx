import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductForm from './components/ProductForm';
import SalesForm from './components/SalesForm';
import './App.css'

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/products">商品登録</Link></li>
          <li><Link to="/sales">売上伝票作成</Link></li>
        </ul>
      </nav>
      
      <Routes>
        <Route path="/products" element={<ProductForm />} />
        <Route path="/sales" element={<SalesForm />} />
      </Routes>
    </Router>
    )
}

export default App
