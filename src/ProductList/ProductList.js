import React from 'react';
import ProductItem from './ProductItem';

const products = [
  { id: 1, title: 'Ergonomic Chair', image: '/placeholder.svg?height=200&width=200' },
  { id: 2, title: 'Wireless Headphones', image: '/placeholder.svg?height=200&width=200' },
  { id: 3, title: 'Smart Watch', image: '/placeholder.svg?height=200&width=200' },
  { id: 4, title: 'Laptop Stand', image: '/placeholder.svg?height=200&width=200' },
  { id: 5, title: 'Mechanical Keyboard', image: '/placeholder.svg?height=200&width=200' },
  { id: 6, title: 'Wireless Mouse', image: '/placeholder.svg?height=200&width=200' },
];

function ProductList({ addToCart }) {
  return (
    <div style={{ width: '70%', padding: '20px' }}>
      <h1>Product List</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {products.map((product) => (
          <ProductItem key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
