
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook that automatically dismisses any active toasts
 * when the user navigates to a different route.
 * This prevents toasts from persisting across page navigation.
 */
export const useHideToasterOnPathChange = () => {
  const location = useLocation();
  const { dismiss } = useToast();

  useEffect(() => {
    // Dismiss all toasts when the path changes
    dismiss();
  }, [location.pathname, dismiss]);

  return null;
};
