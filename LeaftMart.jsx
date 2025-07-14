// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// App.js
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import Header from './components/Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  );
}

export default App;

// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;

// redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: {},
  totalCount: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      if (!state.items[product.id]) {
        state.items[product.id] = { ...product, quantity: 1 };
      } else {
        state.items[product.id].quantity += 1;
      }
      state.totalCount += 1;
      state.totalPrice += product.price;
    },
    increaseQty: (state, action) => {
      const id = action.payload;
      const item = state.items[id];
      if (item) {
        item.quantity += 1;
        state.totalCount += 1;
        state.totalPrice += item.price;
      }
    },
    decreaseQty: (state, action) => {
      const id = action.payload;
      const item = state.items[id];
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalCount -= 1;
        state.totalPrice -= item.price;
      }
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      const item = state.items[id];
      if (item) {
        state.totalCount -= item.quantity;
        state.totalPrice -= item.price * item.quantity;
        delete state.items[id];
      }
    },
  },
});

export const { addToCart, increaseQty, decreaseQty, deleteItem } = cartSlice.actions;
export default cartSlice.reducer;
