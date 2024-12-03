import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProductsData } from '../../routes/Product/fetch';

const server = 'http://localhost:5000/products';

// Fetch all products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const data = await fetchProductsData(server);
        return data;
    }
);

// Fetch product by ID
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

// Create a new product
export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (newProduct, thunkAPI) => {
        try {
            const response = await fetch(server, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            if (!response.ok) {
                throw new Error('Failed to create product');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Update an existing product
export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, updatedProduct }, thunkAPI) => {
        try {
            const response = await fetch(`${server}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id, thunkAPI) => {
        try {
            const response = await fetch(`${server}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
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
        // You can add non-async reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            // Existing cases for fetchProducts and fetchProductById
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
            })
            // Handle createProduct
            .addCase(createProduct.fulfilled, (state, action) => {
                state.items.push(action.payload);
                state.totalPages = Math.ceil(state.items.length / state.limit);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Handle updateProduct
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.productDetails && state.productDetails.id === action.payload.id) {
                    state.productDetails = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Handle deleteProduct
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter((p) => p.id !== action.payload);
                state.totalPages = Math.ceil(state.items.length / state.limit);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default productsSlice.reducer;