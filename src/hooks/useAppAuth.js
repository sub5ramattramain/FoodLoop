import { useAuth0 } from '@auth0/auth0-react';

export function useAppAuth() {
    const { user, isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();

    const localSessionString = localStorage.getItem('userSession');
    const localSession = localSessionString ? JSON.parse(localSessionString) : null;
    const isLocalLoggedIn = !!localSession;

    const isUserLoggedIn = isAuthenticated || isLocalLoggedIn;

    const displayName = user?.given_name || user?.name || localSession?.email || 'User';
    const profilePicture = user?.picture || null;
    const userId = user?.sub || localSession?.email;

    const customAuth0Role = user?.['https://food.example/role'];
    const roleFromMetadata = user?.user_metadata?.role || user?.app_metadata?.role;
    
    const userRole = customAuth0Role || roleFromMetadata || user?.role || localSession?.role || 'customer';

    const handleLogout = () => {
        if (isAuthenticated) {
            logout({ logoutParams: { returnTo: window.location.origin } });
        } else if (isLocalLoggedIn) {
            localStorage.removeItem('userSession');
            window.location.href = "/";
        }
    };

    return {
        user,
        isAuthenticated,
        isUserLoggedIn,
        displayName,
        profilePicture,
        userId,
        userRole,
        handleLogout,
        loginWithRedirect,
        isLoading
    };
}