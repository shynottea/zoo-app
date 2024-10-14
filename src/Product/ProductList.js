import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Filter products"
        value={filter}
        onChange={handleFilterChange}
      />
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {filteredProducts.map((product) => (
            <li key={product.id} style={{ marginBottom: '20px' }}>
              <ProductItem product={product} addToCart={addToCart} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductList;
