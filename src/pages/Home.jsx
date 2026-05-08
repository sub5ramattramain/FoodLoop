import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';

function Home() {
    const { isUserLoggedIn, displayName } = useAppAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({});

    const [userLocation, setUserLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('se cauta locatia...');

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus('geolocatia nu este suportata de acest browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationStatus(null);
            },
            (error) => {
                console.error("eroare la obtinerea locatiei:", error);
                setLocationStatus('nu am putut obtine locatia, astfel, ofertele nu vor fi sortate dupa distanta');
            }
        );
    }, []);

    useEffect(() => {
        if (!isUserLoggedIn) return;

        setIsLoading(true);

        const queryParams = new URLSearchParams();
        if (filters.nume) queryParams.append('nume', filters.nume);
        if (filters.minim_reducere) queryParams.append('minim_reducere', filters.minim_reducere);
        if (filters.ridicare) queryParams.append('ridicare', filters.ridicare);
        if (filters.tags) queryParams.append('tags', filters.tags); 
        
        if (userLocation) {
            queryParams.append('lat', userLocation.lat);
            queryParams.append('lng', userLocation.lng);
        }

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

        fetch(`http://localhost:3000/api/products${queryString}`)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setIsLoading(false);
            });
    }, [isUserLoggedIn, filters, userLocation]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div style={{ padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {isUserLoggedIn && (
                <>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: 'var(--color-primary)' }}>salut, {displayName}.</h2>
                        <p style={{ color: '#666' }}>uite ce bunatati poti salva astazi in apropierea ta:</p>
                        {locationStatus && <p style={{ color: '#ff9f43', fontSize: '0.9rem', marginTop: '0.5rem' }}>{locationStatus}</p>}
                    </div>

                    <Filters onFilterChange={handleFilterChange} />

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
                                        {...product}
                                        image={fullImageUrl}
                                        distance={product.distance}
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