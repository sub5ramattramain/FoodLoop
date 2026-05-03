import React from 'react';
import styles from './ProductCard.module.css';

function ProductCard({ image, title, distance, price, discount, isFree, tags, pickup, orderWindow }) {

    const tagList=tags ? tags.split(',').map(tag => tag.trim()) : [];

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={image} alt={title} className={styles.image} />

                {isFree && <span className={styles.badge} style={{ backgroundColor: '#ff4757'}}>GRATUIT</span>}
                {!isFree && discount > 0 && (<span className={styles.badge} style={{ backgroundColor: '#ff9f43'}}>-{discount}%</span>)}
            </div>

            <div className={styles.details}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.distance}>{distance} km</p>
                
                {(pickup || orderWindow) && (
                    <div className={styles.extraInfo}>
                        {pickup && <p>Ridicare: <strong>{pickup}</strong></p>}
                        {orderWindow && <p>Comanda intre: <strong>{orderWindow}</strong></p>}
                    </div>
                )}

                {tagList.length > 0 && (
                    <div className={styles.tagsContainer}>
                        {tagList.map((tag, index) => (
                            <span key={index} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className={styles.bottomRow}>
                    <div className={styles.priceContainer}>
                        {isFree ? (
                            <span className={styles.currentPrice}>0 lei</span>
                        ):(
                            <span className={styles.currentPrice}>{price} lei</span>
                        )}
                    </div>
                    <button className={styles.saveBtn}>♡</button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;