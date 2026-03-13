import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as authService from "../../api/authService";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  designation?: string;
  phone?: string;
  bio?: string;
  accountId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email, password, name }: any, { rejectWithValue }) => {
    try {
      const user = await authService.signUp(email, password, name);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: any, { rejectWithValue }) => {
    try {
      const user = await authService.signIn(email, password);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
export const updateUser = createAsyncThunk(
  "auth/update",
  async (
    { name, email, designation, phone, bio, accountId }: any,
    { rejectWithValue },
  ) => {
    try {
      const user = await authService.updateProfile(accountId, {
        name,
        email,
        designation,
        phone,
        bio,
      });
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.signOut();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      const userProfile = await authService.getCurrentUserProfile(user?.$id);
      return userProfile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload) {
          state.user = {
            id: action.payload.$id,
            name: action.payload.name,
            email: action.payload.email,
          };
          state.isAuthenticated = true;
        }
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload) {
          state.user = {
            id: action.payload.$id,
            name: action.payload.name,
            email: action.payload.email,
            designation: action.payload.designation,
            phone: action.payload.phone,
            bio: action.payload.bio,
            accountId: action.payload.accountId,
          };
          state.isAuthenticated = true;
        }
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload) {
          state.user = {
            id: action.payload.$id,
            name: action.payload.name,
            email: action.payload.email,
            accountId: action.payload.accountId,
          };
          state.isAuthenticated = true;
        }
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action: PayloadAction<any>) => {
        // Even if the server-side logout fails, we usually want to clear the local state
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        checkAuthStatus.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          if (action.payload) {
            state.user = {
              id: action.payload.$id,
              name: action.payload.name,
              email: action.payload.email,
              designation: action.payload.designation,
              phone: action.payload.phone,
              bio: action.payload.bio,
              accountId: action.payload.accountId,
            };
            state.isAuthenticated = true;
          } else {
            state.user = null;
            state.isAuthenticated = false;
          }
        },
      )
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setLoading, setUser, logout, setError } = authSlice.actions;
export default authSlice.reducer;
export type { AuthState, User };

