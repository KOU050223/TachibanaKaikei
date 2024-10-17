import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

const SalesForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
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
  const handleProductChange = (index, productId) => {
    const selectedProduct = products.find(p => p.id === productId);
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = { product: selectedProduct, quantity: 1 };
    setSelectedProducts(updatedSelectedProducts);
    calculateTotalPrice(updatedSelectedProducts);
  };

  // 数量が変更された時の処理
  const handleQuantityChange = (index, quantity) => {
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index].quantity = quantity;
    setSelectedProducts(updatedSelectedProducts);
    calculateTotalPrice(updatedSelectedProducts);
  };

  // 合計金額の計算
  const calculateTotalPrice = (updatedSelectedProducts) => {
    const total = updatedSelectedProducts.reduce((acc, { product, quantity }) => {
      return acc + product.price * quantity;
    }, 0);
    setTotalPrice(total);
  };

  // 購入を処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const { product, quantity } of selectedProducts) {
        if (quantity <= 0 || quantity > product.stock) {
          alert("在庫が足りません。");
          return;
        }

        // 在庫を減らす
        const productRef = doc(db, 'products', product.id);
        await updateDoc(productRef, {
          stock: product.stock - quantity,
        });

        // 売上を記録
        const salesRef = collection(db, 'sales');
        await addDoc(salesRef, {
          productId: product.id,
          quantity: parseInt(quantity),
          totalPrice: product.price * quantity,
          timestamp: new Date(),
        });
      }

      alert('購入が完了しました！');
      setSelectedProducts([]);
      setTotalPrice(0);
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };

  // 新しい商品選択欄を追加
  const addProductField = () => {
    setSelectedProducts([...selectedProducts, { product: null, quantity: 1 }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>商品を購入する</h2>
      
      {selectedProducts.map((selectedProduct, index) => (
        <div key={index}>
          <label htmlFor={`product-${index}`}>商品を選択:</label>
          <select
            id={`product-${index}`}
            onChange={(e) => handleProductChange(index, e.target.value)}
            value={selectedProduct.product?.id || ''}
          >
            <option value="">商品を選んでください</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.price}円 (在庫: {product.stock})
              </option>
            ))}
          </select>

          {selectedProduct.product && (
            <>
              <label htmlFor={`quantity-${index}`}>数量:</label>
              <input
                type="number"
                id={`quantity-${index}`}
                value={selectedProduct.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                min="1"
                max={selectedProduct.product.stock}
              />
            </>
          )}
        </div>
      ))}

      <button type="button" onClick={addProductField}>商品を追加する</button>

      <p>合計金額: {totalPrice}円</p>

      <button type="submit" disabled={selectedProducts.length === 0}>購入する</button>
    </form>
  );
};

export default SalesForm;
