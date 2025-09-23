import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth.service';
import { container } from '@/lib/di-container';
import { TYPES } from '@/lib/di-types';

export const useAuthState = (
    authService: AuthService = container.get(TYPES.AuthService)
) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const authenticated = await authService.isAuthenticated();
                setIsAuthenticated(authenticated);
            } catch (error) {
                console.error('Error checking auth state:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthState();

        // Listen for storage changes (e.g., when tokens are updated in another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'accessToken') {
                setIsAuthenticated(!!e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [authService]);

    

    return {
        isAuthenticated,
        isLoading,
    };
}; 