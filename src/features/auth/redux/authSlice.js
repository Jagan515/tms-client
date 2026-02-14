import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverEndpoint } from '../../../config/appConfig';

function getErrorMessage(error) {
    if (!error?.response?.data) {
        return error?.message === 'Network Error' ? 'Cannot reach server. Check backend is running and URL.' : 'Request failed';
    }
    const data = error.response.data;
    if (data.message) return data.message;
    if (Array.isArray(data.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        return typeof first === 'string' ? first : first?.msg || first?.message || 'Validation failed';
    }
    return 'Login failed';
}

// Async Thunks - use server-returned user.role for state/redirect (single source of truth)
export const login = createAsyncThunk('auth/login', async ({ role, credentials }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${serverEndpoint}/auth/${role}/login`, credentials, {
            withCredentials: true
        });

        // Response format: { success: true, data: { user }, message: "..." }
        const user = response.data?.data?.user;
        if (user) {
            // Use server-returned role so redirect and permissions match actual account
            return { user, role: user.role };
        }
        return rejectWithValue('Invalid login response format');
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await axios.post(`${serverEndpoint}/auth/logout`, {}, { withCredentials: true });
        return null;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${serverEndpoint}/auth/me`, { withCredentials: true });
        if (response.data && response.data.data && response.data.data.user) {
            return response.data.data.user;
        }
        return rejectWithValue('Invalid response format');
    } catch {
        return rejectWithValue('Not authenticated');
    }
});


const initialState = {
    user: null, // User object
    role: null, // "student", "teacher", "parent", "developer"
    isAuthenticated: false,
    loading: true, // Initial loading state for auth check
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload?.user;
                state.user = action.payload?.user || null;
                state.role = action.payload?.role ?? null; // server-returned role
            })

            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.role = null;
                state.isAuthenticated = false;
            })
            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload;
                state.user = action.payload || null;
                state.role = action.payload?.role || null;
            })

            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.role = null;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
