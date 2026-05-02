import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './Navbar.module.css';

function Navbar() {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <span className={styles.logoText}>FoodLoop</span>
            </div>

            <div className={styles.navLinks}>
                <a href="#oferte" className={styles.link}>Oferte</a>
                <a href="#cum-functioneaza" className={styles.link}>Cum functioneaza</a>
                <a href="#despre_noi" className={styles.link}>Despre noi</a>
            </div>

            <div className={styles.authButtons}>
                {!isAuthenticated ? (
                    <button className={styles.loginBtn} onClick={() => loginWithRedirect()}>Login</button>
                ) : (
                    <button className={styles.logoutBtn} onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>
                )}
            </div>
        </nav>
    )
}

export default Navbar;