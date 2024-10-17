import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);

  // 購入履歴を取得
  useEffect(() => {
    const fetchPurchases = async () => {
      const purchaseCollection = collection(db, 'sales');
      const purchaseSnapshot = await getDocs(purchaseCollection);
      const purchaseList = purchaseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPurchases(purchaseList);
    };

    const fetchProducts = async () => {
      const productCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };

    fetchPurchases();
    fetchProducts();
  }, []);

  // 商品IDから商品名を取得
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : '不明な商品';
  };

  return (
    <div>
      <h2>購入履歴一覧</h2>
      <ul>
        {purchases.map(purchase => (
          <li key={purchase.id}>
            <p>商品名: {getProductName(purchase.productId)}</p>
            <p>数量: {purchase.quantity}</p>
            <p>合計金額: {purchase.totalPrice}円</p>
            <p>購入日時: {new Date(purchase.timestamp.seconds * 1000).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PurchaseHistory;
