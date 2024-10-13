import React, { useState, useEffect } from 'react';
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

  const addToCart = (productToAdd) => {
    // Debugging: Log current cart and the product being added
    console.log('Current Cart:', cart);
    console.log('Product to add:', productToAdd);

    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(item => item.id === productToAdd.id);

      if (existingProductIndex !== -1) {
        // If product already exists, update its quantity
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += productToAdd.quantity;
        console.log('Updated Cart:', updatedCart);
        return updatedCart;
      } else {
        // Otherwise, add it to the cart
        console.log('Adding new product to cart:', [...prevCart, productToAdd]);
        return [...prevCart, productToAdd];
      }
    });
  };

  return (
    <div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {products.map((product) => (
            
            <li key={product.id}>
              <ProductItem product={product} addToCart={addToCart} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
