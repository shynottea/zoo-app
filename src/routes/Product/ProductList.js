// ProductList.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProductItem from './ProductItem';
import { Row, Col } from 'antd';
import withLoading from './withLoading'; // Import the HOC

const ProductList = ({ searchQuery }) => {  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const fetchProductsData = async () => {
    try {
      const response = await fetch('http://localhost:5000/products');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };
  
  useEffect(() => {
    setLoading(true);
    fetchProductsData().then(data => {
      setProducts(data);
      setLoading(false);
    });
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

  // Search products
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Memoized product list
  const memoizedProductList = useMemo(() => {
    return filteredProducts.map((product) => (
      <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6}>
        <ProductItem product={product} addToCart={addToCart} />
      </Col>
    ));
  }, [filteredProducts, addToCart]);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {memoizedProductList}
      </Row>
    </div>
  );
};

export default withLoading(ProductList); // Wrap ProductList with HOC
