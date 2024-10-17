// src/components/SalesForm.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const SalesForm = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalPrice, setTotalPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'sales'), {
        productId,
        quantity: parseInt(quantity),
        totalPrice: parseInt(totalPrice),
        timestamp: new Date(),
      });
      setProductId('');
      setQuantity('');
      setTotalPrice('');
      alert('売上が記録されました');
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="商品ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="数量"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="合計金額"
        value={totalPrice}
        onChange={(e) => setTotalPrice(e.target.value)}
        required
      />
      <button type="submit">売上記録</button>
    </form>
  );
};

export default SalesForm;
