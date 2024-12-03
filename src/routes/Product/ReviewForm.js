// src/routes/Product/ReviewForm.js

import React, { useState } from 'react';
import { Form, Input, Button, Rate, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { submitReview, fetchProductReviews } from '../../redux/slices/reviewSlice';

const { TextArea } = Input;

const ReviewForm = ({ productId }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.reviews);
  const userId = useSelector((state) => state.auth.id);
  const [success, setSuccess] = useState(false);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    dispatch(
      submitReview({
        userId,
        productId: String(productId), // Ensure productId is string
        rating: values.rating,
        comment: values.comment,
      })
    )
      .unwrap()
      .then(() => {
        setSuccess(true);
        form.resetFields();
        dispatch(fetchProductReviews(productId)); // Refresh reviews
      })
      .catch(() => {
        setSuccess(false);
      });
  };

  return (
    <div>
      <h3>Leave a Review</h3>
      {success && (
        <Alert
          message="Review submitted successfully!"
          type="success"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="rating"
          label="Rating"
          rules={[{ required: true, message: 'Please provide a rating!' }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          name="comment"
          label="Comment"
          rules={[{ required: true, message: 'Please enter your review!' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={status === 'loading'}>
            Submit Review
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ReviewForm;
