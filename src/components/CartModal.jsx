import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import toast from 'react-hot-toast';

function CartModal() {
    const { isUserLoggedIn, userId } = useAppAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (isOpen && userId) {
            const savedCart = localStorage.getItem(`cart_${userId}`);
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            } else {
                setCartItems([]);
            }
        }
    }, [isOpen, userId]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleCancelReservation = async (productId) => {
        const loadingToast = toast.loading('se anuleaza rezervarea..');

        try {
            const getRes = await fetch(`http://localhost:3000/api/products/${productId}`);
            if (!getRes.ok) throw new Error('oferta nu a fost gasita');
            const productData = await getRes.json();

            const putRes = await fetch(`http://localhost:3000/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numar_valabil: Number(productData.numar_valabil) + 1 })
            });

            if (putRes.ok) {
                const updatedCart = cartItems.filter(item => item._id !== productId);
                localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
                setCartItems(updatedCart);
                
                toast.success('rezervare anulata. stocul a fost refacut', { id: loadingToast });

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error('eroare la refacerea stocului', { id: loadingToast });
            }
        } catch (error) {
            toast.error('eroare de retea. incearca din nou', { id: loadingToast });
        }
    };

    if (!isUserLoggedIn) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{ position: 'fixed', bottom: '30px', left: '30px', backgroundColor: '#004734', color: 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.05)' } }}
            >
                🛒
            </button>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9990, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column', padding: '2rem' }}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            ×
                        </button>

                        <h2 style={{ color: '#004734', margin: '0 0 0.5rem 0' }}>cosul tau de rezervari 🛒</h2>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem', marginTop: 0 }}>arata codul din aplicatie la magazin pentru a ridica produsele salvate</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cartItems.map((item) => (
                                <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                                    <img src={item.image} alt={item.produs} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                                    
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, color: '#374151', fontSize: '1rem' }}>{item.produs}</h4>
                                        <p style={{ margin: '0.1rem 0 0 0', color: '#6b7280', fontSize: '0.85rem' }}>magazin: <strong>{item.magazin}</strong></p>
                                        
                                        {item.adresa && (
                                            <p style={{ margin: '0.1rem 0 0 0', color: '#6b7280', fontSize: '0.85rem' }}>📍 {item.adresa}</p>
                                        )}
                                        
                                        <p style={{ margin: '0.2rem 0 0 0', color: '#004734', fontSize: '0.85rem', fontWeight: 'bold' }}>rezervat: {item.data_rezervarii || item.dataRezervarii}</p>
                                    </div>

                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.4rem', justifyContent: 'center' }}>
                                        <span style={{ fontWeight: 'bold', color: '#004734', fontSize: '1.1rem' }}>{item.pret_lei} lei</span>
                                        <button 
                                            onClick={() => handleCancelReservation(item._id)}
                                            style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500', padding: 0 }}
                                        >
                                            anuleaza
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {cartItems.length === 0 && (
                                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0', margin: 0 }}>nu ai nicio rezervare activa</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CartModal;