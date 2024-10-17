// src/components/ProductForm.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        name: productName,
        price: parseInt(price),
        stock: parseInt(stock),
        is_available: isAvailable,
      });
      setProductName('');
      setPrice('');
      setStock('');
      alert('商品が登録されました');
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="商品名"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="値段"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="在庫数"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />
      <label>
        販売可能:
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
      </label>
      <button type="submit">商品登録</button>
    </form>
  );
};

export default ProductForm;