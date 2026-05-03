import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
    const navigate = useNavigate();

    const localSessionString = localStorage.getItem('userSession');
    const isLocalLoggedIn = !!localSessionString;
    const isUserLoggedIn = isAuthenticated || isLocalLoggedIn;

    const handleLogout = () => {
        if (isAuthenticated) {
            logout({ logoutParams: { returnTo: window.location.origin } });
        } else if (isLocalLoggedIn) {
            localStorage.removeItem('userSession');
            navigate('/');
            window.location.reload();
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <Link to="/" className={styles.logoText} style={{ textDecoration: 'none' }}>FoodLoop</Link>
            </div>

            {!isUserLoggedIn && (
                <div className={styles.navLinks}>
                    <Link to="/" className={styles.link}>acasa</Link>
                    <Link to="/about" className={styles.link}>cum funcționează</Link>
                    <Link to="/" className={styles.link}>oferte</Link>
                </div>
            )}

            {isUserLoggedIn && (
                <div className={styles.navLinks}>
                    <Link to="/" className={styles.link}>feed oferte</Link>
                    <Link to="/saved" className={styles.link}>salvate</Link>
                </div>
            )}

            <div className={styles.authButtons}>
                {!isUserLoggedIn ? (
                    <button className={styles.loginBtn} onClick={() => loginWithRedirect()}>Login</button>
                ) : (
                    <div className={styles.userMenu}>
                        <Link to="/profile" className={styles.link}>Profil</Link>
                        {user?.picture && (
                            <img src={user.picture} alt="Profile" className={styles.profilePic} />
                        )}
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;