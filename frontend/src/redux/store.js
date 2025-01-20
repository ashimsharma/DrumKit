import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';

const store = configureStore({
    reducer: {
        userType: userReducer,
    },
});

export default store;