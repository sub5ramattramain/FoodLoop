import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import ProductCard from '../components/ProductCard';

function Saved() {
    const { isUserLoggedIn, userId } = useAppAuth();

    const [savedProducts, setSavedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isUserLoggedIn && userId) {
            fetchFavorites(userId);
        } else {
            setIsLoading(false);
        }
    }, [isUserLoggedIn, userId]);

    const fetchFavorites = async (uId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/favourites/${uId}`);
            if (response.ok) {
                const data = await response.json();
                setSavedProducts(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isUserLoggedIn) {
        return (
            <div style={{ padding: '2rem 4rem', textAlign: 'center', marginTop: '5rem' }}>
                <h2>trebuie sa fii logat pentru a vedea magazinele salvate.</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>magazinele tale favorite</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>aici apar automat toate ofertele active de la magazinele pe care le urmaresti.</p>

            {isLoading ? (
                <p>se incarca ofertele...</p>
            ) : savedProducts.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: '#6b7280' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>nu ai nicio oferta salvata momentan.</h3>
                    <p>da click pe inima de pe cardurile din feed pentru a adauga oferte aici.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {savedProducts.map((product) => {
                        const fullImageUrl = product.image
                            ? `http://localhost:3000${product.image}`
                            : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop";

                        return (
                            <ProductCard
                                key={product._id}
                                {...product}
                                image={fullImageUrl}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Saved;