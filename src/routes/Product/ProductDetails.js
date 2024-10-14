import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../CartContext';
import ProductItem from './ProductItem';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
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
        console.log(id)
        const foundProduct = data.find(product => product.id == id); 
        console.log(foundProduct)
        if (!foundProduct) {
          throw new Error('Product not found');
        }

        setProduct(foundProduct);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [id]);

  const memoizedProduct = useMemo(() => product, [product]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      {memoizedProduct ? (
        <ProductItem
          product={memoizedProduct}
          addToCart={addToCart}
        />
      ) : (
        <p>Product details are not available.</p>
      )}
    </div>
  );
};

export default ProductDetails;
