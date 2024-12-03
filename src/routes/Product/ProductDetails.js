// src/routes/Product/ProductDetails.js

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Alert, Spin, Typography, Divider, List, Rate } from 'antd';
import ProductItem from './ProductItem';
import ReviewForm from './ReviewForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../redux/slices/productsSlice';
import { fetchProductReviews } from '../../redux/slices/reviewSlice';
import { fetchUserOrders } from '../../redux/slices/orderSlice';
import { fetchUsers } from '../../redux/slices/userSlice';

const { Title, Paragraph } = Typography;

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails: product, status, error } = useSelector((state) => state.products);
  const { reviewsByProductId, status: reviewStatus, error: reviewError } = useSelector((state) => state.reviews);
  const { users, status: usersStatus } = useSelector((state) => state.users);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const userId = useSelector((state) => state.auth.id);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProductReviews(id));
    if (isAuth) {
      dispatch(fetchUserOrders(userId)).then((action) => {
        if (action.payload) {
          const ordered = action.payload.some(order =>
            order.items.some(item => String(item.productId) === String(id))
          );
          setHasOrdered(ordered);
        }
      });
    }

    // Ensure users are fetched
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, id, isAuth, userId, usersStatus]);

  // Memoize user mapping for performance
  const userMap = useMemo(() => {
    const map = {};
    users.forEach(user => {
      map[user.id] = user.name;
    });
    return map;
  }, [users]);

  // Check if the current user has already reviewed the product
  useEffect(() => {
    if (isAuth && reviewsByProductId[id]) {
      const reviewed = reviewsByProductId[id].some(review => review.userId === userId);
      setHasReviewed(reviewed);
    }
  }, [isAuth, reviewsByProductId, id, userId]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    const productReviews = reviewsByProductId[id] || [];
    if (productReviews.length === 0) return null;
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / productReviews.length).toFixed(2);
  }, [reviewsByProductId, id]);

  if (status === 'loading' || usersStatus === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }

  if (status === 'failed') {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '20px' }}>
      {product ? (
        <>
          <ProductItem product={{ ...product, rating: averageRating }} isDetailView={true} />
          {product.description && (
            <Card style={{ marginTop: '20px' }}>
              <Title level={3}>Product Details</Title>
              <Paragraph>{product.description}</Paragraph>
            </Card>
          )}
          <Divider />
          <Title level={3}>Reviews</Title>
          {reviewStatus === 'loading' ? (
            <Spin tip="Loading reviews..." />
          ) : reviewStatus === 'failed' ? (
            <Alert message="Error" description={reviewError} type="error" showIcon />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={reviewsByProductId[id] || []}
              renderItem={(review) => {
                const username = userMap[review.userId] || `User ${review.userId}`;
                return (
                  <List.Item>
                    <List.Item.Meta
                      title={username}
                      description={
                        <>
                          <Paragraph>
                            <strong>Rating:</strong> <Rate disabled value={review.rating} />
                          </Paragraph>
                          <Paragraph>{review.comment}</Paragraph>
                        </>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          )}
          {isAuth && hasOrdered && (
            <>
              <Divider />
              {!hasReviewed ? (
                <ReviewForm productId={id} />
              ) : (
                <Alert
                  message="You have already reviewed this product."
                  type="info"
                  showIcon
                />
              )}
            </>
          )}
          {isAuth && !hasOrdered && (
            <Alert
              message="You can only review products you have ordered."
              type="info"
              showIcon
            />
          )}
        </>
      ) : (
        <Alert message="Product details are not available." type="warning" showIcon />
      )}
    </div>
  );
};

export default ProductDetails;
