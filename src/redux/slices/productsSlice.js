import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProductsData } from '../../routes/Product/fetch';

const server = 'http://localhost:5000/products';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const data = await fetchProductsData(server);
    return data;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await fetch(`http://localhost:5000/products/${id}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    const data = await response.json();
    return data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    productDetails: null,
    status: 'idle',
    error: null,
    currentPage: 1,
    totalPages: 1,
    limit: 6,
  },
  reducers: {
    // CRUD
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalPages = Math.ceil(action.payload.length / state.limit);
        state.status = 'succeeded';
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = 'Failed to fetch products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
        state.productDetails = null;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetails = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch product details';
      });
  },
});

export default productsSlice.reducer;