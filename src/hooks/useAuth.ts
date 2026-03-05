import { useDispatch, useSelector } from "react-redux";
import { logout, setAuth, User } from "../redux/slices/authSlice";
import { AppDispatch, RootState } from "../redux/store";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const loginUser = (userData: User) => {
    // Simulate API call
    dispatch(setAuth({ user: userData, token: "fake-jwt-token" }));
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
