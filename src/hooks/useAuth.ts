import { useDispatch, useSelector } from "react-redux";
import type { User } from "../redux/slices/authSlice";
import { logout, setUser } from "../redux/slices/authSlice";
import { AppDispatch, RootState } from "../redux/store";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const loginUser = (userData: User) => {
    // Simulate API call
    dispatch(setUser(userData));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    loginUser,
    logoutUser,
  };
};
