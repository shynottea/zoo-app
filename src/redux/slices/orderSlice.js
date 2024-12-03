// src/redux/slices/orderSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API Endpoints
const API_URL = 'http://localhost:5000/orders';
const PRODUCT_API_URL = 'http://localhost:5000/products';

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async ({ userId, items }, thunkAPI) => {
    try {
      // Step 1: Fetch current stock for each product
      const productResponses = await Promise.all(
        items.map((item) =>
          fetch(`${PRODUCT_API_URL}/${item.id}`)
        )
      );

      // Step 2: Check if all product fetches were successful
      for (let res of productResponses) {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error fetching product: ${errorText}`);
        }
      }

      const products = await Promise.all(
        productResponses.map((res) => res.json())
      );

      // Step 3: Check stock availability
      for (let i = 0; i < items.length; i++) {
        if (products[i].stock < items[i].quantity) {
          throw new Error(
            `Insufficient stock for product "${products[i].title}". Available: ${products[i].stock}, Requested: ${items[i].quantity}`
          );
        }
      }

      // Step 4: Update stock for each product
      const updateResponses = await Promise.all(
        items.map((item, index) =>
          fetch(`${PRODUCT_API_URL}/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              stock: products[index].stock - item.quantity,
            }),
          })
        )
      );

      // Check if all stock updates were successful
      for (let res of updateResponses) {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error updating stock: ${errorText}`);
        }
      }

      // Step 5: Calculate total price
      const total = items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.id);
        return sum + (product?.price || 0) * item.quantity; // Ensure price is valid
      }, 0);

      // Map items to have productId instead of id for order consistency
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      // Step 6: Create the order
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          items: orderItems,
          date: new Date().toISOString(),
          total,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to place order: ${errorText}`);
      }

      const order = await response.json();
      return order;
    } catch (error) {
      // Return a rejected action containing the error message
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Async Thunk to Fetch User Orders with Pagination
 * This thunk fetches orders based on userId, page, and pageSize.
 * It ensures that the total count of orders is correctly parsed.
 */
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async ({ userId, page, pageSize }, thunkAPI) => {
    try {
      const response = await fetch(
        `${API_URL}?userId=${userId}&_page=${page}&_limit=${pageSize}`
      );

      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch orders: ${errorText}`);
      }

      const orders = await response.json();
      const totalCountHeader = response.headers.get('X-Total-Count');

      // Parse totalCount safely
      const totalCount = totalCountHeader
        ? parseInt(totalCountHeader, 10)
        : orders.length;

      // Validate totalCount to prevent NaN
      const validatedTotalCount = isNaN(totalCount) ? orders.length : totalCount;

      return { orders, totalCount: validatedTotalCount };
    } catch (error) {
      // Return a rejected action containing the error message
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Initial State for the Orders Slice
 */
const initialState = {
  orders: [],
  totalOrders: 0, // Total number of orders across all pages
  currentPage: 1, // Current active page
  pageSize: 5, // Number of orders per page
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if any
};

/**
 * Orders Slice
 */
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    /**
     * Action to Set the Current Page
     * @param {Object} state - Current state
     * @param {Object} action - Action containing the new page number
     */
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Place Order Thunk
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Optionally, you can decide where to add the new order
        // For example, add to the beginning of the orders array
        state.orders.unshift(action.payload);
        state.totalOrders += 1; // Increment totalOrders as a new order is added
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handle Fetch User Orders Thunk
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalCount;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

/**
 * Export Actions and Reducer
 */
export const { setPage } = orderSlice.actions;
export default orderSlice.reducer;
