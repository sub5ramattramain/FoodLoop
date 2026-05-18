import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppAuth } from '../hooks/useAppAuth';
import ProductCard from '../components/ProductCard';
import { useParams, useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function ShopPage() {
    const { shopName } = useParams();
    const navigate = useNavigate();

    const { isUserLoggedIn, displayName } = useAppAuth();

    const [product, setProduct] = useState([]);
    const [shopInfo, setShopInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const averageRating = reviews.length > 0 ? (reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length).toFixed(1) : 0;
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [revName, setRevName] = useState("");

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                }, (error) => console.error("locatie eroare", error)
            );
        }
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${encodeURIComponent(shopName)}/reviews`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reverse());
            }
        } catch (error) {
            console.error("eroare incarcare recenzii", error);
        }
    };

    useEffect(() => {
        const fetchShopData = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('magazin', shopName);

                if (userLocation) {
                    params.append('lat', userLocation.lat);
                    params.append('lng', userLocation.lng);
                }

                const [shopRes, productRes] = await Promise.all([
                    fetch(`http://localhost:3000/api/shop/${encodeURIComponent(shopName)}`),
                    fetch(`http://localhost:3000/api/products?${params.toString()}`)
                ]);

                if (shopRes.ok && productRes.ok) {
                    const shopData = await shopRes.json();
                    const allData = await productRes.json();

                    const filteredProducts = allData.filter(
                        item => item.magazin?.toLowerCase() === shopName?.toLowerCase()
                    );

                    setProduct(filteredProducts);

                    setShopInfo({
                        nume: shopData.shop.numeMagazin,
                        adresa: shopData.shop.adresa,
                        image: shopData.shop.image,
                        distance: filteredProducts.length > 0 ? filteredProducts[0].distance : undefined,
                        lat: filteredProducts.length > 0 ? filteredProducts[0].lat : 44.4268,
                        lng: filteredProducts.length > 0 ? filteredProducts[0].lng : 26.0125
                    });
                } else {
                    toast.error("datele magazinului nu s-au incarcat");
                }
            } catch (error) {
                console.error(error);
                toast.error("eroare conectare server");
            } finally {
                setIsLoading(false);
            }
        };

        if (shopName) {
            fetchShopData();
            fetchReviews();
        }
    }, [shopName, userLocation]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!isUserLoggedIn) {
            toast.error("trebuie sa te conectezi pentru a lasa o recenzie");
            return;
        }
        if (rating === 0) {
            toast.error("alege cel putin o stea");
            return;
        }

        const payload = {
            id_produs: shopName,
            nume: revName.trim() || displayName || "anonim",
            rating: rating,
            text: comment.trim() || "fara comentariu"
        };

        const loadingToast = toast.loading("se posteaza recenzia..");

        try {
            const response = await fetch(`http://localhost:3000/api/products/${encodeURIComponent(shopName)}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("recenzie adaugata cu succes", { id: loadingToast });
                setRating(0);
                setComment("");
                setRevName("");
                fetchReviews();
            } else {
                toast.error("eroare la adaugarea recenziei", { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error("eroare de conexiune la server", { id: loadingToast });
        }
    };

    const formattedProducts = product.map(p => ({
        ...p,
        image: p.image ? `http://localhost:3000${p.image}` : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"
    }));

    if (isLoading) {
        return (
            <div style={{ padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ color: '#6b7280', fontWeight: 'bold' }}>pagina magazinului se incarca..</p>
            </div>
        );
    }

    const centerLat = shopInfo?.lat ? parseFloat(shopInfo.lat) : 44.4268;
    const centerLng = shopInfo?.lng ? parseFloat(shopInfo.lng) : 26.1025;

    return (
        <div style={{ padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            {/* Buton Intorcere la oferta */}
            <button
                onClick={() => navigate(-1)}
                style={{ marginBottom: '2rem', backgroundColor: 'white', border: '1px solid #d1d5db', color: '#374151', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: '0.2s', fontSize: '0.9rem' }}
            >
                inapoi la oferte
            </button>

            {/* zona cu magazinul si harta*/}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                {/*detalii magazin-partea stanga */}
                <div style={{ flex: '2 1 550px', backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>profil magazin</span>
                    {shopInfo?.image && (
                        <img
                            src={`http://localhost:3000${shopInfo.image}`}
                            alt={`logo ${shopInfo.nume}`}
                            style={{ width: '240px', height: '240px', borderRadius: '50%', objectFit: 'cover', marginTop: '1rem', border: '2px solid var(--color-primary)' }}
                        />
                    )}
                    <h1 style={{ margin: '0.3rem 0 1rem 0', color: '#004734', fontSize: '2.5rem', fontWeight: 'bold', textTransform: 'lowercase' }}>
                        {shopInfo?.nume || shopName}
                    </h1>

                    {reviews.length > 0 ? (
                        <p style={{ margin: '0.5rem 0 1rem 0', color: '#f59e0b', fontSize: '1.1rem', fontWeight: 'bold' }}>
                            ⭐ {averageRating} / 5 <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 'normal' }}>({reviews.length} recenzii)</span>
                        </p>
                    ) : (
                        <p style={{ margin: '0.5rem 0 1rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
                            fara recenzii inca
                        </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#555', fontSize: '1rem', marginTop: '1rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem' }}>
                        {shopInfo?.adresa && <div> <strong>adresa:</strong> {shopInfo.adresa} </div>}
                        {shopInfo?.distance !== undefined && shopInfo?.distance !== Infinity && (
                            <div> <strong>distanta: </strong> {shopInfo.distance.toFixed(1)} km </div>
                        )}
                    </div>
                </div>

                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/*harta - dreapta */}
                    <div style={{ flex: '1 1 300px', height: '220px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                        {shopInfo ? (
                            <MapContainer
                                center={[centerLat, centerLng]}
                                zoom={15}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[centerLat, centerLng]}>
                                    <Popup>
                                        <strong>{shopInfo.nume}</strong> <br /> {shopInfo.adresa}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <p>harta se incarca..</p>
                        )}
                    </div>

                    {/* reviews*/}
                    <div>
                        <h3 style={{ color: '#374151' }}>recenzii</h3>

                        {isUserLoggedIn ? (
                            <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            style={{ fontSize: '1.4rem', cursor: 'pointer', color: star <= (hoverRating || rating) ? '#f2ec3c' : '#d1d5db' }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <input type="text" placeholder="nume (optional)" value={revName}
                                    onChange={(e) => setRevName(e.target.value)}
                                    style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                    maxLength="30"
                                />

                                <textarea placeholder="cum ti s-au parut produsele?" value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="2"
                                    style={{ padding: '0.5rem', resize: 'vertical', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                    maxLength="300"
                                    required
                                />

                                <button type="submit" style={{ padding: '0.5rem', cursor: 'pointer', backgroundColor: '#004734', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                                    trimite
                                </button>
                            </form>
                        ) : (
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>conecteaza-te pentru a lasa o recenzie</p>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {reviews.length === 0 ? (
                                <p style={{ color: '#9ca3af' }}>nu exista recenzii inca. fii primul!</p>
                            ) : (
                                reviews.map((rev) => (
                                    <div key={rev._id} style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <strong style={{ color: '#374151', wordBreak: 'break-word', paddingRight: '10px' }}>{rev.nume}</strong>
                                            <div style={{ color: '#f59e0b', fontSize: '0.9rem', minWidth: '70px', textAlign: 'right' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                                        </div>
                                        <p style={{ margin: '0.4rem 0 0 0', color: '#4b5563', fontSize: '0.95rem', wordBreak: 'break-word' }}>{rev.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ color: '#004734', margin: '0 0 0.5rem 0' }}>ofertele magazinului</h2>
                <p style={{ margin: 0, color: '#6b7280' }}>vezi ce produse mai are disponibile {shopInfo?.nume || shopName}</p>
            </div>

            {formattedProducts.length === 0 ? (
                <p style={{ color: '#6b7280' }}>{shopInfo?.nume || shopName} nu mai are oferte active</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {formattedProducts.map(offer => (
                        <ProductCard
                            key={offer._id}
                            {...offer}
                            image={offer.image}
                            distance={offer.distance}
                            isUserLoggedIn={isUserLoggedIn}
                            onDeleteSuccess={() => setProduct(prev => prev.filter(p => p._id !== offer._id))}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ShopPage;