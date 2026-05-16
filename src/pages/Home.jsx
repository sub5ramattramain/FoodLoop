import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import MapView from '../components/MapView';

function Home() {
    const { isUserLoggedIn, displayName, userRole } = useAppAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [userLocation, setUserLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('se cauta locatia..');
    const [viewMode, setViewMode] = useState('list');

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
                console.error(error);
                setLocationStatus('nu am putut obtine locatia, astfel, ofertele nu vor fi sortate dupa distanta');
            }
        );
    }, []);

    useEffect(() => {
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
                console.error(error);
                setIsLoading(false);
            });
    }, [filters, userLocation, refreshTrigger]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const formattedProducts = products.map(product => ({
        ...product,
        image: product.image ? `http://localhost:3000${product.image}` : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"
    }));

    const myOffers = formattedProducts.filter(offer => offer.magazin?.toLowerCase() === displayName?.toLowerCase());

    const otherOffers = userRole?.toLowerCase() === 'vanzator'
        ? formattedProducts.filter(offer => offer.magazin?.toLowerCase() !== displayName?.toLowerCase())
        : formattedProducts;

    return (
        <div style={{ padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {isUserLoggedIn && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--color-primary)' }}>salut, {displayName}</h2>
                    <p style={{ color: '#666' }}>uite ce bunatati poti salva astazi in apropierea ta</p>
                    {locationStatus && <p style={{ color: '#ff9f43', fontSize: '0.9rem', marginTop: '0.5rem' }}>{locationStatus}</p>}
                </div>
            )}

            <Filters onFilterChange={handleFilterChange} />

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', marginTop: '1rem' }}>
                <button
                    onClick={() => setViewMode('list')}
                    style={{
                        padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none',
                        backgroundColor: viewMode === 'list' ? 'var(--color-primary)' : '#e5e7eb',
                        color: viewMode === 'list' ? 'white' : '#4b5563',
                        cursor: 'pointer', fontWeight: 'bold', transition: '0.2s'
                    }}
                >
                    vezi lista
                </button>

                <button
                    onClick={() => setViewMode('map')}
                    style={{
                        padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none',
                        backgroundColor: viewMode === 'map' ? 'var(--color-primary)' : '#e5e7eb',
                        color: viewMode === 'map' ? 'white' : '#4b5563',
                        cursor: 'pointer', fontWeight: 'bold', transition: '0.2s'
                    }}
                >
                    vezi harta
                </button>
            </div>

            {isLoading ? (
                <p>se incarca ofertele..</p>
            ) : products.length === 0 ? (
                <p>momentan nu exista oferte disponibile</p>
            ) : viewMode === 'map' ? (
                <MapView products={formattedProducts} userLocation={userLocation} />
            ) : (
                <>
                    {isUserLoggedIn && userRole?.toLowerCase() === 'vanzator' && (
                        <div style={{ marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: '#004734', marginBottom: '1.5rem' }}>ofertele tale active</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                                {myOffers.length > 0 ? (
                                    myOffers.map(offer => (
                                        <ProductCard
                                            key={offer._id}
                                            {...offer}
                                            distance={offer.distance}
                                            isUserLoggedIn={isUserLoggedIn}
                                            userRole={userRole}
                                            onDeleteSuccess={triggerRefresh}
                                        />
                                    ))
                                ) : (
                                    <p style={{ color: '#6b7280', gridColumn: '1 / -1' }}>nu ai postat nicio oferta inca</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#004734', marginBottom: '1.5rem' }}>
                            {userRole?.toLowerCase() === 'vanzator' ? 'alte oferte din zona ta' : 'toate ofertele'}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                            {otherOffers.length > 0 ? (
                                otherOffers.map(offer => (
                                    <ProductCard
                                        key={offer._id}
                                        {...offer}
                                        distance={offer.distance}
                                        isUserLoggedIn={isUserLoggedIn}
                                        userRole={userRole}
                                    />
                                ))
                            ) : (
                                <p style={{ color: '#6b7280', gridColumn: '1 / -1' }}>nu s-au gasit oferte</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;