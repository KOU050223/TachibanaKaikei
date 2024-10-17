// src/components/SalesForm.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc,addDoc } from 'firebase/firestore';

const SalesForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Firestoreから商品を取得
  useEffect(() => {
    const fetchProducts = async () => {
      const productCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  // 商品が選択された時の処理
  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setTotalPrice(product ? product.price * quantity : 0);
  };

  // 数量が変更された時の処理
  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
    if (selectedProduct) {
      setTotalPrice(selectedProduct.price * qty);
    }
  };

  // 購入を処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || quantity <= 0 || quantity > selectedProduct.stock) {
      alert("正しい商品と数量を選択してください。");
      return;
    }

    try {
      // 在庫を減らす
      const productRef = doc(db, 'products', selectedProduct.id);
      await updateDoc(productRef, {
        stock: selectedProduct.stock - quantity,
      });

      // 売上を記録
      const salesRef = collection(db, 'sales');
      await addDoc(salesRef, {
        productId: selectedProduct.id,
        quantity: parseInt(quantity),
        totalPrice: totalPrice,
        timestamp: new Date(),
      });

      alert('購入が完了しました！');
      setQuantity(0);
      setTotalPrice(0);
      setSelectedProduct(null);
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>商品を購入する</h2>
      <label htmlFor="product">商品を選択:</label>
      <select id="product" onChange={handleProductChange} value={selectedProduct?.id || ''}>
        <option value="">商品を選んでください</option>
        {products.map(product => (
          <option key={product.id} value={product.id}>
            {product.name} - {product.price}円 (在庫: {product.stock})
          </option>
        ))}
      </select>

      {selectedProduct && (
        <>
          <label htmlFor="quantity">数量:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={selectedProduct.stock}
          />
        </>
      )}

      <p>合計金額: {totalPrice}円</p>

      <button type="submit" disabled={!selectedProduct || quantity <= 0}>購入する</button>
    </form>
  );
};

export default SalesForm;
