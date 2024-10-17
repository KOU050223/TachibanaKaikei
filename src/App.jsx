import { useState } from 'react'
import ProductForm from './components/ProductForm';
import SalesForm from './components/SalesForm';
import './App.css'

function App() {
  return (
    <div>
      <h1>文化祭 屋台販売会計アプリ</h1>
      <h2>商品登録</h2>
      <ProductForm />
      <h2>売上伝票</h2>
      <SalesForm />
    </div>
  )
}

export default App
