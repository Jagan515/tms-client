import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});
