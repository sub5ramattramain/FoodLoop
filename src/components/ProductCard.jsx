import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';

function ProductCard({ _id, produs, magazin, pret_lei, reducere, comanda, ridicare, adresa, tag, numar_valabil, image, distance }) {
    const { isUserLoggedIn, userId } = useAppAuth();

    const [isSaved, setIsSaved] = useState(false);
    const [isLoadingHeart, setIsLoadingHeart] = useState(false);

    useEffect(() => {
        if (isUserLoggedIn && userId && magazin) {
            checkIfSaved();
        }
    }, [isUserLoggedIn, userId, magazin]);

    const checkIfSaved = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/favourites/${userId}`);
            if (response.ok) {
                const favoriteProducts = await response.json();
                const isFav = favoriteProducts.some(p => p.magazin === magazin);
                setIsSaved(isFav);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleSave = async (e) => {
        e.stopPropagation();

        if (!isUserLoggedIn || !userId) {
            alert('trebuie sa fii logat pentru a urmari magazine!');
            return;
        }

        setIsLoadingHeart(true);

        try {
            if (isSaved) {
                const response = await fetch(`http://localhost:3000/api/favourites?userId=${userId}&storeName=${magazin}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setIsSaved(false);
                }
            } else {
                const response = await fetch('http://localhost:3000/api/favourites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, storeName: magazin })
                });
                if (response.ok) {
                    setIsSaved(true);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingHeart(false);
        }
    };

    const tagList = tag ? tag.split(',').map(t => t.trim()) : [];

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', position: 'relative' }}>

            <div style={{ height: '200px', position: 'relative' }}>
                <img src={image} alt={produs} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                {numar_valabil && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'white', color: '#004734', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {numar_valabil} buc.
                    </div>
                )}

                {reducere && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#f59e0b', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        -{reducere}%
                    </div>
                )}

                <button
                    onClick={handleToggleSave}
                    disabled={isLoadingHeart}
                    style={{
                        position: 'absolute', bottom: '10px', right: '10px',
                        backgroundColor: 'white', border: 'none', borderRadius: '50%',
                        width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: isLoadingHeart ? 'wait' : 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: '0.2s'
                    }}
                >
                    <span style={{ color: isSaved ? '#ef4444' : '#9ca3af', fontSize: '1.2rem', marginTop: '2px' }}>
                        {isSaved ? '♥' : '♡'}
                    </span>
                </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                <h3 style={{ margin: 0, color: '#004734', fontSize: '1.2rem' }}>{magazin}</h3>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '1rem', fontWeight: '500' }}>{produs}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                    {tagList.map((t, idx) => (
                        <span key={idx} style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            {t}
                        </span>
                    ))}
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem', color: '#6b7280' }}>
                    {comanda && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>🛒</span> comanda: {comanda}</div>}
                    {ridicare && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>🕒</span> ridicare: {ridicare}</div>}
                    {adresa && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📍</span> {adresa}</div>}
                    {distance !== undefined && distance !== Infinity && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#004734', fontWeight: 'bold' }}>
                            <span>🚶‍♂️</span> distanta: {distance.toFixed(1)} km
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {reducere && (
                            <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.9rem' }}>
                                {((pret_lei * 100) / (100 - reducere)).toFixed(2)} lei
                            </span>
                        )}
                        <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#004734' }}>{pret_lei} lei</span>
                    </div>

                    <button style={{ backgroundColor: '#004734', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        rezerva
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;