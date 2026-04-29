import React, { use } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './LandingPage.module.css';
import heroImage from '../assets/images.jpg';

function LandingPage() {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className={styles.landingWrapper}>
            <section className={styles.heroSplit}>
                <div className={styles.heroTextSide}>
                    <h1 className={styles.heroTitle}>
                        save food mate :P<br />
                        <span className={styles.highlight}>join the loop</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        help us reduce food waste and make a positive impact on the environment. <br />
                        together, we can create a more sustainable future for our planet.
                    </p>
                    <div className={styles.heroButtons}>
                        <button className={styles.btnPrimary}
                            onClick={() => loginWithRedirect()}
                        >enter the app</button>
                        <button className={styles.btnSecondary}
                        >learn more</button>
                    </div>
                </div>

                <div className={styles.heroImageSide}>
                    <img className={styles.foodImage} src={heroImage} alt="Hero" />
                </div>
            </section>

            <section className={styles.categoriesSection}>
                <h2 className={styles.categoriesTitle}>explore our categories</h2>
                <div className={styles.categoriesGrid}>
                    <div className={styles.categoriesCard}>lorem ipsum</div>
                    <div className={styles.categoriesCard}>lorem ipsum</div>
                    <div className={styles.categoriesCard}>lorem ipsum</div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;