import React from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { useAppAuth } from './hooks/useAppAuth';

function Navbar() {
    const { isUserLoggedIn, profilePicture, loginWithRedirect, handleLogout } = useAppAuth();

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <Link to="/" className={styles.logoText} style={{ textDecoration: 'none' }}>FoodLoop</Link>
            </div>

            {!isUserLoggedIn && (
                <div className={styles.navLinks}>
                    <Link to="/" className={styles.link}>home</Link>
                    <Link to="/about" className={styles.link}>about us</Link>
                    <Link to="/" className={styles.link}>shop</Link>
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
                        {profilePicture && (
                            <img src={profilePicture} alt="Profile" className={styles.profilePic} />
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