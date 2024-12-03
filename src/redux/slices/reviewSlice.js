
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/reviews';
const ORDER_API_URL = 'http://localhost:5000/orders';

export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async ({ userId, productId, rating, comment }, thunkAPI) => {
    try {
      const ordersResponse = await fetch(
        `${ORDER_API_URL}?userId=${userId}`
      );
      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch user orders');
      }
      const orders = await ordersResponse.json();

      const hasOrdered = orders.some(order =>
        order.items.some(item => String(item.productId) === String(productId))
      );

      if (!hasOrdered) {
        throw new Error('You can only review products you have ordered.');
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId,
          rating,
          comment,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit review: ${errorText}`);
      }

      const review = await response.json();
      return review;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}?productId=${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const reviews = await response.json();
      return { productId, reviews };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchAllReviews = createAsyncThunk(
  'reviews/fetchAllReviews',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch all reviews');
      }
      const reviews = await response.json();
      return reviews;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviewsByProductId: {}, 
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitReview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const review = action.payload;
        if (!state.reviewsByProductId[review.productId]) {
          state.reviewsByProductId[review.productId] = [];
        }
        state.reviewsByProductId[review.productId].push(review);
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProductReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { productId, reviews } = action.payload;
        state.reviewsByProductId[productId] = reviews;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAllReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const reviews = action.payload;
        state.reviewsByProductId = {}; 
        reviews.forEach(review => {
          if (!state.reviewsByProductId[review.productId]) {
            state.reviewsByProductId[review.productId] = [];
          }
          state.reviewsByProductId[review.productId].push(review);
        });
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
