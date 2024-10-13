import React, { useState, useEffect, useCallback } from 'react';
import ProductItem from '../ProductItem/ProductItem';

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // For product filtering

  // Fetch products from mock API (e.g., json-server)
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:5000/products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  // Handle filtering based on input
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>Product List</h1>
      <input
        type="text"
        placeholder="Filter products"
        value={filter}
        onChange={handleFilterChange} // onChange event handler
      />
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {filteredProducts.map((product) => (
            <ProductItem key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
