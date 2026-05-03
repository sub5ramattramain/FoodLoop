import { useAuth0 } from '@auth0/auth0-react';

export function useAppAuth() {
    const { user, isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();

    const localSessionString = localStorage.getItem('userSession');
    const localSession = localSessionString ? JSON.parse(localSessionString) : null;
    const isLocalLoggedIn = !!localSession;

    const isUserLoggedIn = isAuthenticated || isLocalLoggedIn;

    const displayName = user?.given_name || user?.name || localSession?.email || 'User';
    const profilePicture = user?.picture || null;

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
        handleLogout,
        loginWithRedirect,
        isLoading
    };
}