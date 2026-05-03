import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import ProductCard from '../components/ProductCard';

function Home() {
    const { isUserLoggedIn, displayName } = useAppAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(!isUserLoggedIn) return;
        fetch('http://localhost:3000/api/products')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setIsLoading(false);
            });
    }, [isUserLoggedIn]);

    return (
        <div style={{ padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {isUserLoggedIn && (
                <>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: 'var(--color-primary)' }}>salut, {displayName}.</h2>
                        <p style={{ color: '#666' }}>uite ce bunatati poti salva astazi in apropierea ta:</p>
                    </div>

                    {isLoading ? (
                        <p>se incarca ofertele..</p>
                    ) : products.length === 0 ? (
                        <p>momentan nu exista oferte disponibile. incarca tu una.</p>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                            gap: '2rem' 
                        }}>
                            {products.map((product) => {
                                const fullImageUrl = product.image 
                                    ? `http://localhost:3000${product.image}` 
                                    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop";

                                return (
                                    <ProductCard 
                                        key={product._id} 
                                        title={product.produs} 
                                        image={fullImageUrl}
                                        distance={product.adresa} 
                                        price={product.pret_lei}
                                        discount={product.reducere} 
                                        tags={product.tag} 
                                        pickup={product.ridicare} 
                                        orderWindow={product.comanda} 
                                        isFree={product.pret_lei === 0}
                                    />
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;