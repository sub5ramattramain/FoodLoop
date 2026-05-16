import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import toast from 'react-hot-toast';
import styles from "./CustomerProfile.module.css";

function CustomerProfile() {
    const { displayName, profilePicture, user, userId } = useAppAuth();
    const [showForm, setShowForm] = useState(false);
    const [address, setAddress] = useState("");
    const [savedAddress, setSavedAddress] = useState("");
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const SavedAddress = localStorage.getItem(`adresa_${userId}`);
        if (SavedAddress) setSavedAddress(SavedAddress);

        const savedCart = localStorage.getItem(`cart_${userId}`);
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, [userId]);

    const getInitials = (name = "") =>
        name.split(" ").map((w) => w[0]).join("").toLocaleUpperCase().slice(0, 2) || "?";

    const handleSave = () => {
        if (!address.trim()) return;
        localStorage.setItem(`adresa_${userId}`, address);
        setSavedAddress(address);
        setAddress("");
        setShowForm(false);
        toast.success("Adresa de livrare a fost salvata! 📍");
    };

    const handleCancelReservation = (productId) => {
        const updatedCart = cartItems.filter(item => item._id !== productId);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        toast.success("Rezervarea a fost anulata.");
    };

    return (
        <div className={styles.page} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem 4rem' }}>

            <div className={styles.card}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        {profilePicture
                            ? <img src={profilePicture} alt="profil" className={styles.avatarImg} />
                            : getInitials(displayName)
                        }
                    </div>

                    <div>
                        <p className={styles.name}> {displayName} </p>
                        <p className={styles.email}> {user?.email}</p>
                        {savedAddress && (
                            <p className={styles.savedAddress}> 📍 {savedAddress} </p>
                        )}
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.addressSection}>
                    <button
                        className={styles.btn}
                        onClick={() => { setAddress(savedAddress); setShowForm(!showForm); }}
                    >
                        {savedAddress ? "Schimbă adresa" : "Adaugă adresă de livrare"}
                    </button>

                    {showForm && (
                        <div className={styles.addressForm}>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Te rog introdu adresa ta"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <button className={styles.btnSave} onClick={handleSave} disabled={!address.trim()}>
                                Salvează
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={{ color: '#004734', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Coșul tău de rezervări 🛒</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Arată codul din aplicație la magazin pentru a ridica produsele salvate.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cartItems.map((item) => (
                        <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                            <img src={item.image} alt={item.produs} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />

                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, color: '#374151', fontSize: '1rem' }}>{item.produs}</h4>
                                <p style={{ margin: '0.1rem 0 0 0', color: '#6b7280', fontSize: '0.85rem' }}>Magazin: <strong>{item.magazin}</strong></p>
                                <p style={{ margin: '0.1rem 0 0 0', color: '#004734', fontSize: '0.85rem', fontWeight: 'bold' }}>Rezervat pe: {item.dataRezervarii}</p>
                            </div>

                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <span style={{ fontWeight: 'bold', color: '#004734', fontSize: '1.1rem' }}>{item.pret_lei} lei</span>
                                <button
                                    onClick={() => handleCancelReservation(item._id)}
                                    style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500', padding: 0 }}
                                >
                                    Anulează
                                </button>
                            </div>
                        </div>
                    ))}

                    {cartItems.length === 0 && (
                        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem 0', margin: 0 }}>Nu ai nicio rezervare activă în coș.</p>
                    )}
                </div>
            </div>

        </div>
    );
}

export default CustomerProfile;