import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapView({ products, userLocation }) {
    const [radius, setRadius] = useState(500);
    const filteredGroupProducts = useMemo(() => {
        if (!userLocation)
            return {};
        const groupedProducts = {};
        const userLatLng = L.latLng(userLocation.lat, userLocation.lng);
        products.forEach(p => {
            if (p.lat && p.lng && p.lat !== 0 && p.lng !== 0) {
                const productLatLng = L.latLng(p.lat, p.lng);
                const distance = userLatLng.distanceTo(productLatLng);
                if (distance <= radius) {
                    const key = `${p.lat},${p.lng}`;
                    if (!groupedProducts[key]) {
                        groupedProducts[key] = {
                            lat: p.lat,
                            lng: p.lng,
                            magazin: p.magazin,
                            oferte: []
                        };
                    }
                    groupedProducts[key].oferte.push(p);
                }
            }
        });
        return groupedProducts;
    }, [products, userLocation, radius]);



    const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : [45.6427, 25.5887]; ///centrul hartii va fi brasov

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, background: 'white' }}>
                <label>Raza: {radius / 1000} km</label>
                <input type="range" min="500" max="20000" step="500"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                />
            </div>
            <div style={{ height: '600px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd', marginTop: '1rem', zIndex: 0 }}>
                <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />

                    {/*cercul utilizatorului*/}
                    {userLocation && (
                        <>
                            <Circle

                                center={[userLocation.lat, userLocation.lng]}
                                radius={radius}
                                pathOptions={{ color: '#004734', fillColor: '#004734', fillOpacity: 0.1 }}
                            />
                            <Marker position={[userLocation.lat, userLocation.lng]}>
                                <Popup>locatia ta curenta</Popup>
                            </Marker>
                        </>
                    )}

                    {/*pinurile magazinelor*/}
                    {Object.values(filteredGroupProducts).map((g, idx) => (
                        <Marker key={idx} position={[g.lat, g.lng]}>
                            <Popup>
                                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                                    <h3 style={{ margin: '0 0 5px 0', color: '#004734', fontSize: '1.1rem' }}>{g.magazin}</h3>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#666' }}>
                                        {g.oferte.length} oferte disponibile
                                    </p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
                                        {g.oferte.map(o => (
                                            <li key={o._id} style={{ borderTop: '1px solid #eee', padding: '5px 0', fontSize: '0.9rem' }}>
                                                <strong>{o.produs}</strong> <br />
                                                <span style={{ color: '#004734', fontWeight: 'bold' }}>{o.pret_lei} lei</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${g.lat},${g.lng}`}
                                        target="_blank"
                                        rel=" noopener noreferrer"
                                        style={{ textAlign: 'center', color: '#004734', fontSize: '1rem' }}
                                    >
                                        <p>Vezi pe Maps</p>
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapView;