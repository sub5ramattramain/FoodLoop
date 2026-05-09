import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { useAppAuth } from '../hooks/useAppAuth';

function Navbar() {
    const { isUserLoggedIn, displayName, profilePicture, loginWithRedirect, handleLogout } = useAppAuth();
    const [imgError, setImgError] = useState(false);

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <Link to="/" className={styles.logoText} style={{ textDecoration: 'none' }}>FoodLoop</Link>
            </div>

            {!isUserLoggedIn && (
                <div className={styles.navLinks}>
                    <Link to="/" className={styles.link}>home</Link>
                    <Link to="/about" className={styles.link}>about us</Link>
                    <Link to="/shop" className={styles.link}>shop</Link>
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

                        {profilePicture && !imgError ? (
                            <img
                                src={profilePicture}
                                alt="Profile"
                                className={styles.profilePic}
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className={styles.profileFallback}>
                                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                            </div>
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