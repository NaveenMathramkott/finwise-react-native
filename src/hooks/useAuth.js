import { useDispatch, useSelector } from 'react-redux';
import { logout, setAuth } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const loginUser = (userData) => {
    // Simulate API call
    dispatch(setAuth({ user: userData, token: 'fake-jwt-token' }));
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
