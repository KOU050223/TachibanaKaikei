import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductForm from './components/ProductForm';
import SalesForm from './components/SalesForm';
import ProductList from './components/ProductList';
import PurchaseHistory from './components/PurchaseHistory';

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/products">商品登録</Link></li>
          <li><Link to="/sales">売上伝票作成</Link></li>
          <li><Link to="/product-list">商品一覧</Link></li>
          <li><Link to="/purchase-history">購入履歴</Link></li>
        </ul>
      </nav>
      
      <Routes>
        <Route path="/products" element={<ProductForm />} />
        <Route path="/sales" element={<SalesForm />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/purchase-history" element={<PurchaseHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
