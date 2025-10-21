import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUser } from '@/store/slice/userSlice';
import { useEffect } from 'react';

export const useUserData = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.user);
  const { isAuthenticated, id: userId } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && userId && !user) {
        try {
          // console.log(userId, 'userId from auth state');
          dispatch(getUser(userId));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, userId, user, dispatch]);

  return {
    user,
    isLoading,
    error,
    refetch: () => {
      if (userId) {
        dispatch(getUser(userId));
      }
    },
  };
};