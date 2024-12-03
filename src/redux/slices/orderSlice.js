// src/redux/slices/orderSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/orders';
const PRODUCT_API_URL = 'http://localhost:5000/products';

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async ({ userId, items }, thunkAPI) => {
    try {
      const productResponses = await Promise.all(
        items.map((item) =>
          fetch(`${PRODUCT_API_URL}/${item.id}`)
        )
      );

      for (let res of productResponses) {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error fetching product: ${errorText}`);
        }
      }

      const products = await Promise.all(
        productResponses.map((res) => res.json())
      );

      for (let i = 0; i < items.length; i++) {
        if (products[i].stock < items[i].quantity) {
          throw new Error(
            `Insufficient stock for product "${products[i].title}". Available: ${products[i].stock}, Requested: ${items[i].quantity}`
          );
        }
      }

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

      for (let res of updateResponses) {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error updating stock: ${errorText}`);
        }
      }

      const total = items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.id);
        return sum + (product?.price || 0) * item.quantity; 
      }, 0);

      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

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
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async ({ userId, page, pageSize }, thunkAPI) => {
    try {
      const response = await fetch(
        `${API_URL}?userId=${userId}&_page=${page}&_limit=${pageSize}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch orders: ${errorText}`);
      }

      const orders = await response.json();
      const totalCountHeader = response.headers.get('X-Total-Count');

      const totalCount = totalCountHeader
        ? parseInt(totalCountHeader, 10)
        : orders.length;

      const validatedTotalCount = isNaN(totalCount) ? orders.length : totalCount;

      return { orders, totalCount: validatedTotalCount };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const initialState = {
  orders: [],
  totalOrders: 0, 
  currentPage: 1, 
  pageSize: 5, 
  status: 'idle', 
  error: null, 
};


const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
   
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
       
        state.orders.unshift(action.payload);
        state.totalOrders += 1; 
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

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

export const { setPage } = orderSlice.actions;
export default orderSlice.reducer;
