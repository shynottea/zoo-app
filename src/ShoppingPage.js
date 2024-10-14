import React from 'react';
import ProductList from './Product/ProductList';

function ShoppingPage({ addToCart }) {
  return (
    <div>
      <h1>Product List</h1>
      <ProductList addToCart={addToCart} />
    </div>
  );
}

export default ShoppingPage;
