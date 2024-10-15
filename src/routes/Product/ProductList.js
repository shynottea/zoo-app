import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProductItem from './ProductItem';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = useCallback((productToAdd) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(item => item.id === productToAdd.id);

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += productToAdd.quantity;
        return updatedCart;
      } else {
        return [...prevCart, productToAdd];
      }
    });
  }, []);

  // Memoize the product list so it's only recalculated when 'products' change
  const memoizedProductList = useMemo(() => {
    return products.map((product) => (
      <li key={product.id}>
        <ProductItem product={product} addToCart={addToCart} />
      </li>
    ));
  }, [products, addToCart]);  // Dependencies are products and addToCart

  return (
    <div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {memoizedProductList}
        </div>
      )}
    </div>
  );
};

export default ProductList;
