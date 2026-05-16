import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ProductCard({ _id, produs, magazin, pret_lei, reducere, comanda, ridicare, adresa, descriere, ingrediente, tag, numar_valabil, image, distance, onDeleteSuccess }) {
    const { isUserLoggedIn, userId, userRole, displayName } = useAppAuth();
    const navigate = useNavigate();

    const [isSaved, setIsSaved] = useState(false);
    const [isLoadingHeart, setIsLoadingHeart] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (isUserLoggedIn && userId && magazin) {
            checkIfSaved();
        }
    }, [isUserLoggedIn, userId, magazin]);

    useEffect(() => {
        if (isModalOpen || isDeleteModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, isDeleteModalOpen]);

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
            toast.error('trebuie sa fii logat pentru a putea salva oferte');
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
                    toast.success('oferta eliminata din favorite');
                }
            } else {
                const response = await fetch('http://localhost:3000/api/favourites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, storeName: magazin })
                });
                if (response.ok) {
                    setIsSaved(true);
                    toast.success('oferta adaugata la favorite');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('a aparut o eroare de conexiune');
        } finally {
            setIsLoadingHeart(false);
        }
    };

    const handleReserveClick = async (e) => {
        e.stopPropagation();
        if (!isUserLoggedIn || !userId) {
            toast.error('trebuie sa fii logat pentru a putea rezerva produse');
            return;
        }

        if (numar_valabil <= 0) {
            toast.error('ne pare rau, dar stocul a fost epuizat intre timp');
            return;
        }

        const currentCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        const isAlreadyReserved = currentCart.some(item => item._id === _id);

        if (isAlreadyReserved) {
            toast.error('ai rezervat deja acest produs. il gasesti in profil');
            return;
        }

        const loadingToast = toast.loading('se proceseaza rezervarea..');

        try {
            const response = await fetch(`http://localhost:3000/api/products/${_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    numar_valabil: Number(numar_valabil) - 1,
                })
            });

            if (response.ok) {
                const newReservation = {
                    _id,
                    produs,
                    magazin,
                    pret_lei,
                    image,
                    adresa,
                    data_rezervarii: new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })
                };

                localStorage.setItem(`cart_${userId}`, JSON.stringify([...currentCart, newReservation]));
                toast.success('produs salvat cu succes. pachetul te asteapta in profil', { id: loadingToast });

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error('eroare la actualizarea stocului pe server', { id: loadingToast });
            }
        } catch (error) {
            toast.error('eroare de retea. nu am putut contacta serverul', { id: loadingToast });
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        setIsDeleteModalOpen(false);
        const loadingToast = toast.loading('se sterge oferta..');

        try {
            const response = await fetch(`http://localhost:3000/api/products/${_id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('oferta a fost stearsa', { id: loadingToast });
                if (onDeleteSuccess) onDeleteSuccess();
            } else {
                toast.error('eroare la stergere', { id: loadingToast });
            }
        } catch (error) {
            toast.error('a aparut o eroare de retea', { id: loadingToast });
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        navigate('/profile', {
            state: {
                editOffer: { _id, produs, magazin, pret_lei, reducere, comanda, ridicare, adresa, descriere, ingrediente, tag, numar_valabil }
            }
        });
    };

    const tagList = tag ? tag.split(',').map(t => t.trim()).slice(0, 3) : [];
    const isMyOwnOffer = userRole?.toLowerCase() === 'vanzator' && magazin?.toLowerCase() === displayName?.toLowerCase();

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-4px)' } }}
            >
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
                            {reducere && Number(reducere) < 100 && (
                                <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.9rem' }}>
                                    {((pret_lei * 100) / (100 - reducere)).toFixed(2)} lei
                                </span>
                            )}
                            {reducere && Number(reducere) === 100 && (
                                <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.9rem' }}>
                                    gratis!!!!!!!!!!!!!!!!
                                </span>
                            )}
                            <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#004734' }}>{pret_lei} lei</span>
                        </div>

                        {isMyOwnOffer ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={handleEditClick}
                                    style={{ backgroundColor: '#e5e7eb', color: '#374151', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    editeaza
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    sterge
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleReserveClick}
                                style={{ backgroundColor: '#004734', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                rezerva
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div
                    onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9998, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                            style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            ×
                        </button>

                        <div style={{ height: '250px', width: '100%' }}>
                            <img src={image} alt={produs} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <h2 style={{ margin: 0, color: '#004734', fontSize: '1.8rem' }}>{produs}</h2>
                                <p style={{ margin: '0.2rem 0 0 0', color: '#4b5563', fontSize: '1.1rem', fontWeight: '500' }}>de la {magazin}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
                                <div style={{ flex: 1, backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>pret</p>
                                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#004734' }}>{pret_lei} lei</p>
                                </div>
                                <div style={{ flex: 1, backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>disponibile</p>
                                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#004734' }}>{numar_valabil} buc</p>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>descriere pachet</h4>
                                <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.6' }}>
                                    {descriere || 'magazinul nu a inclus o descriere :/'}
                                </p>
                            </div>

                            {ingrediente && (
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>ingrediente / alergeni</h4>
                                    <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.6', backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '8px' }}>
                                        {ingrediente}
                                    </p>
                                </div>
                            )}

                            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#4b5563' }}>
                                {comanda && <div style={{ display: 'flex', gap: '0.8rem' }}><span style={{ width: '25px' }}>🛒</span> <span><strong>comanda:</strong> {comanda}</span></div>}
                                {ridicare && <div style={{ display: 'flex', gap: '0.8rem' }}><span style={{ width: '25px' }}>🕒</span> <span><strong>ridicare:</strong> {ridicare}</span></div>}
                                {adresa && <div style={{ display: 'flex', gap: '0.8rem' }}><span style={{ width: '25px' }}>📍</span> <span><strong>adresa:</strong> {adresa}</span></div>}
                            </div>

                            {isMyOwnOffer ? (
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={handleEditClick}
                                        style={{ flex: 1, backgroundColor: '#e5e7eb', color: '#374151', border: 'none', padding: '1.2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: '0.2s' }}
                                    >
                                        editeaza
                                    </button>
                                    <button
                                        onClick={handleDeleteClick}
                                        style={{ flex: 1, backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '1.2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: '0.2s' }}
                                    >
                                        sterge
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleReserveClick}
                                    style={{ marginTop: '1rem', width: '100%', backgroundColor: '#004734', color: 'white', border: 'none', padding: '1.2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: '0.2s' }}
                                >
                                    rezerva acum
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div
                    onClick={(e) => { e.stopPropagation(); setIsDeleteModalOpen(false); }}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                    >
                        <h3 style={{ margin: 0, color: '#374151', fontSize: '1.2rem' }}>esti sigur ca vrei sa stergi aceasta oferta?</h3>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>actiunea este permanenta si nu poate fi anulata.</p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                style={{ flex: 1, padding: '0.8rem', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                            >
                                anuleaza
                            </button>
                            <button
                                onClick={executeDelete}
                                style={{ flex: 1, padding: '0.8rem', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                            >
                                sterge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductCard;