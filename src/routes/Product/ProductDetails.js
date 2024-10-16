import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../Cart/CartContext';
import { Card, Alert } from 'antd';
import ProductItem from './ProductItem';
import withLoading from './withLoading'; // Import the HOC

const ProductDetails = ({ isLoading }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }

        const data = await response.json();
        const foundProduct = data.find(product => product.id == parseInt(id, 10));
        if (!foundProduct) {
          throw new Error('Product not found');
        }

        setProduct(foundProduct);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProductById();
  }, [id]);

  const memoizedProduct = useMemo(() => product, [product]);

  if (error) return <Alert message={error} type="error" />;

  return (
    <div style={{ padding: '20px' }}>
      {memoizedProduct ? (
        <>
          <ProductItem product={memoizedProduct} addToCart={addToCart} isDetailView={true} />
          {/* Display product details if available */}
          {memoizedProduct.description && (
            <Card style={{ marginTop: '20px' }}>
              <h3>Product Details</h3>
              <p>{memoizedProduct.description}</p>
            </Card>
          )}
        </>
      ) : (
        <Alert message="Product details are not available." type="warning" />
      )}
    </div>
  );
};

export default withLoading(ProductDetails); // Wrap ProductDetails with the HOC
