import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUser } from '@/store/slice/userSlice';
import { getUserIdFromToken } from '@/utils/jwtUtils';
import { useEffect } from 'react';

export const useUserData = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.user);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && !user) {
        try {
          const userId = await getUserIdFromToken();
          if (userId) {
            const result = dispatch(getUser(userId));
            console.log(result, 'getUserIdFromToken');
            
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, user, dispatch]);

  return {
    user,
    isLoading,
    error,
    refetch: async () => {
      const userId = await getUserIdFromToken();
      if (userId) {
        dispatch(getUser(userId));
      }
    },
  };
};