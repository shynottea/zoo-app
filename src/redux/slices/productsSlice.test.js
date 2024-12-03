import { configureStore } from '@reduxjs/toolkit';
import productsReducer, {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from './productsSlice'; // adjust the import according to your file structure

// Create a mock store to use in tests
const store = configureStore({
    reducer: {
        products: productsReducer,
    },
});

describe('productSlice', () => {
    it('should handle fetchProducts.pending', () => {
        const initialState = { status: 'idle', error: null };
        const action = { type: fetchProducts.pending.type };

        const state = productsReducer(initialState, action);
        expect(state.status).toBe('loading');
    });

    it('should handle fetchProducts.fulfilled', () => {
        const initialState = { items: [], status: 'loading', error: null };
        const action = {
            type: fetchProducts.fulfilled.type,
            payload: [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }],
        };

        const state = productsReducer(initialState, action);
        expect(state.status).toBe('succeeded');
        expect(state.items).toEqual(action.payload);
    });

    it('should handle fetchProducts.rejected', () => {
        const initialState = { status: 'loading', error: null };
        const action = { type: fetchProducts.rejected.type, error: { message: 'Error' } };

        const state = productsReducer(initialState, action);
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Failed to fetch products');
    });

    it('should handle fetchProductById.pending', () => {
        const initialState = { status: 'idle', productDetails: null, error: null };
        const action = { type: fetchProductById.pending.type };

        const state = productsReducer(initialState, action);
        expect(state.status).toBe('loading');
        expect(state.productDetails).toBeNull();
    });

    it('should handle fetchProductById.fulfilled', () => {
        const initialState = { productDetails: null, status: 'loading', error: null };
        const action = {
            type: fetchProductById.fulfilled.type,
            payload: { id: 1, name: 'Product 1' },
        };

        const state = productsReducer(initialState, action);
        expect(state.status).toBe('succeeded');
        expect(state.productDetails).toEqual(action.payload);
    });

    it('should handle createProduct.rejected', () => {
        const initialState = { items: [], error: null };
        const action = { type: createProduct.rejected.type, payload: 'Failed to create product' };

        const state = productsReducer(initialState, action);
        expect(state.error).toBe(action.payload);
    });

    it('should handle updateProduct.fulfilled', () => {
        const initialState = {
            items: [{ id: 1, name: 'Product 1' }],
            productDetails: { id: 1, name: 'Product 1' },
        };
        const action = {
            type: updateProduct.fulfilled.type,
            payload: { id: 1, name: 'Updated Product 1' },
        };

        const state = productsReducer(initialState, action);
        expect(state.items[0].name).toBe('Updated Product 1');
        expect(state.productDetails.name).toBe('Updated Product 1');
    });

});
