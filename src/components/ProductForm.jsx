// src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [stockUpdate, setStockUpdate] = useState('');

  // Firestoreから商品一覧を取得
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

  // 新規商品登録の処理
  const handleNewProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        name: productName,
        price: parseInt(price),
        stock: parseInt(stock),
      });
      setProductName('');
      setPrice('');
      setStock('');
      alert('新規商品が登録されました');
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };

  // 在庫追加・修正の処理
  const handleStockUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const productRef = doc(db, 'products', selectedProduct);
      const selected = products.find(p => p.id === selectedProduct);
      if (selected) {
        await updateDoc(productRef, {
          stock: parseInt(stockUpdate),
        });
        alert('在庫が更新されました');
        setStockUpdate('');
        setSelectedProduct('');
      }
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };

  return (
    <div>
      <h2>新規商品登録</h2>
      <form onSubmit={handleNewProductSubmit}>
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
          placeholder="初期在庫数"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <button type="submit">新規商品登録</button>
      </form>

      <h2>在庫修正</h2>
      <form onSubmit={handleStockUpdateSubmit}>
        <label htmlFor="productSelect">商品を選択:</label>
        <select
          id="productSelect"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">商品を選んでください</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - 現在の在庫: {product.stock}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="新しい在庫数"
          value={stockUpdate}
          onChange={(e) => setStockUpdate(e.target.value)}
          required
          disabled={!selectedProduct}
        />
        <button type="submit" disabled={!selectedProduct}>在庫を修正する</button>
      </form>
    </div>
  );
};

export default ProductForm;
