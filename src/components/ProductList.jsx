// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const ProductList = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <div>
      <h2>商品一覧</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <p>商品名: {product.name}</p>
            <p>値段: {product.price}円</p>
            <p>在庫数: {product.stock}</p>
            <p>販売可能: {product.is_available ? 'はい' : 'いいえ'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
