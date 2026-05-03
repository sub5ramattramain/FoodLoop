import React from 'react';
import styles from './ProductCard.module.css';

function ProductCard({ image, magazin, produs, adresa, pret_lei, reducere, numar_valabil, tag, ridicare, comanda }) {

    const isFree = pret_lei === 0;
    const oldPrice = reducere > 0 ? (pret_lei / (1 - reducere / 100)).toFixed(2) : null;
    const tagList = tag ? tag.split(',').map(t => t.trim()) : [];

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={produs} className={styles.image} />

                <div className={styles.topBadges}>
                    {numar_valabil > 0 && numar_valabil <= 3 && (
                        <span className={`${styles.badge} ${styles.urgentBadge}`}>
                            ultimele {numar_valabil}!
                        </span>
                    )}
                    {numar_valabil > 3 && (
                        <span className={`${styles.badge} ${styles.stockBadge}`}>
                            {numar_valabil} buc.
                        </span>
                    )}
                </div>

                {reducere > 0 && (
                    <span className={`${styles.badge} ${styles.discountBadge}`}>
                        -{reducere}%
                    </span>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.storeName}>{magazin}</h3>
                    <p className={styles.productName}>{produs}</p>
                </div>

                {tagList.length > 0 && (
                    <div className={styles.tagsContainer}>
                        {tagList.map((t, index) => (
                            <span key={index} className={styles.tag}>{t}</span>
                        ))}
                    </div>
                )}

                <div className={styles.details}>
                    {comanda && (
                        <div className={styles.detailRow}>
                            <span className={styles.icon}>🛒</span>
                            <span className={styles.detailText}>comanda: <strong>{comanda}</strong></span>
                        </div>
                    )}
                    {ridicare && (
                        <div className={styles.detailRow}>
                            <span className={styles.icon}>🕒</span>
                            <span className={styles.detailText}>ridicare: <strong>{ridicare}</strong></span>
                        </div>
                    )}
                    <div className={styles.detailRow}>
                        <span className={styles.icon}>📍</span>
                        <span className={styles.detailText}>{adresa}</span>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.priceBlock}>
                        {isFree ? (
                            <span className={styles.newPrice}>GRATIS!!!!!!!!</span>
                        ) : (
                            <>
                                {oldPrice && <span className={styles.oldPrice}>{oldPrice} lei</span>}
                                <span className={styles.newPrice}>{pret_lei} lei</span>
                            </>
                        )}
                    </div>
                    <button className={styles.reserveBtn}>rezerva</button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;