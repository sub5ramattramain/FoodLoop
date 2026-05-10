import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const { loginWithRedirect } = useAuth0();
    const navigate = useNavigate();

    const steps = [
        { id: 1, title: "1. descopera oferte", desc: "gaseste pachete surpriza la magazinele din jurul tau.", icon: "📍" },
        { id: 2, title: "2. rezerva", desc: "asigura-te ca prinzi oferta si platesti in aplicatie.", icon: "📱" },
        { id: 3, title: "3. ridica si bucura-te", desc: "salveaza mancare si ajuta planeta in acelasi timp.", icon: "🛍️" }
    ];

    return (
        <div className={styles.landingWrapper}>
            <section className={styles.heroSplit}>
                <div className={styles.heroTextSide}>
                    <div className={styles.textContent}>
                        <h1 className={styles.heroTitle}>
                            save food.<br />
                            <span className={styles.highlight}>join the loop.</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            help us reduce food waste and make a positive impact on the environment. <br />
                            together, we can create a more sustainable future for our planet.
                        </p>
                        <div className={styles.heroButtons}>
                            <button
                                className={styles.btnPrimary}
                                onClick={() => loginWithRedirect()}
                            >
                                enter the app
                            </button>
                            <button
                                className={styles.btnSecondary}
                                onClick={() => navigate('/about')}
                            >
                                learn more
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.heroImageSide}>
                    <div className={styles.imageOverlay}></div>
                    <img
                        className={styles.foodImage}
                        src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=800&auto=format&fit=crop"
                        alt="mancare proaspata si sustenabila"
                        fetchpriority="high"
                    />
                </div>
            </section>

            <section className={styles.howItWorksSection}>
                <h2 className={styles.sectionTitle}>cum functioneaza</h2>
                <div className={styles.stepsGrid}>
                    {steps.map((step) => (
                        <div key={step.id} className={styles.stepCard}>
                            <div className={styles.stepIcon}>{step.icon}</div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDesc}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default LandingPage;