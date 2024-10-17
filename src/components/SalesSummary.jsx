import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const SalesSummary = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [productSales, setProductSales] = useState({});

  // Firestoreから売上データと商品データを取得
  useEffect(() => {
    const fetchSales = async () => {
      const salesCollection = collection(db, 'sales');
      const salesSnapshot = await getDocs(salesCollection);
      const salesList = salesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSales(salesList);
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

    fetchSales();
    fetchProducts();
  }, []);

  // 売上合計と各商品の売上を計算
  useEffect(() => {
    const calculateSales = () => {
      let total = 0;
      let productSalesMap = {};

      sales.forEach(sale => {
        total += sale.totalPrice;
        
        if (!productSalesMap[sale.productId]) {
          productSalesMap[sale.productId] = 0;
        }
        productSalesMap[sale.productId] += sale.totalPrice;
      });

      setTotalSales(total);
      setProductSales(productSalesMap);
    };

    calculateSales();
  }, [sales]);

  // 商品IDから商品名を取得
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : '不明な商品';
  };

  return (
    <div>
      <h2>売上データ一覧</h2>
      <p>売上合計: {totalSales}円</p>

      <h3>各商品の売上</h3>
      <ul>
        {Object.keys(productSales).map(productId => (
          <li key={productId}>
            <p>{getProductName(productId)} の売上: {productSales[productId]}円</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesSummary;
