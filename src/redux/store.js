// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import orderReducer from './slices/orderSlice';
import reviewReducer from './slices/reviewSlice';
import userReducer from './slices/userSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'products','users'],
  whitelist: ['auth', 'cart', 'products'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productsReducer,
  orders: orderReducer,
  reviews: reviewReducer,
  users: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
});

export const persistor = persistStore(store);

export default store;