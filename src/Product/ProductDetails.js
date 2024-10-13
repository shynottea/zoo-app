import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`http://localhost:5000/products/${id}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Mock fetching comments for the product
    async function fetchComments() {
      const response = await fetch(`http://localhost:5000/products/${id}/comments`);
      const data = await response.json();
      setComments(data);
    }

    fetchComments();
  }, [id]);

  const handleQuantityChange = useCallback((e) => {
    setQuantity(Number(e.target.value));
  }, []);

  const handleAddToCart = useCallback(() => {
    if (product) {
      addToCart({ ...product, quantity });
    }
  }, [addToCart, product, quantity]);
  

  if (loading) {
    return <p>Loading product details...</p>;
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} style={{ width: '300px' }} />
      <p>{product.description}</p>
      <input
        type="number"
        value={quantity}
        min="1"
        onChange={handleQuantityChange}
      />
      <button onClick={handleAddToCart}>
        Add to Cart
      </button>

      <h3>Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductDetails;
