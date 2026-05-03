import React, { use } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './LandingPage.module.css';

function LandingPage() {
    const { loginWithRedirect } = useAuth0();

    return (
        <>  
            <div className={styles.landingWrapper}>
                <section className={styles.heroSplit}>
                    <div className={styles.heroTextSide}>
                        <h1 className={styles.heroTitle}>
                            save food.<br />
                            <span className={styles.highlight}>join the loop.</span>
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
                        <img className={styles.foodImage} src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1000&auto=format&fit=crop" 
    alt="Mâncare proaspătă și sustenabilă" />
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
        </>
    );
}

export default LandingPage;