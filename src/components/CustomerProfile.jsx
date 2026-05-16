import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import toast from 'react-hot-toast';
import styles from "./CustomerProfile.module.css";

function CustomerProfile() {
    const { displayName, profilePicture, user, userId } = useAppAuth();
    const [showForm, setShowForm] = useState(false);
    const [address, setAddress] = useState("");
    const [savedAddress, setSavedAddress] = useState("");

    useEffect(() => {
        if (!userId) return;

        const SavedAddress = localStorage.getItem(`adresa_${userId}`);
        if (SavedAddress) setSavedAddress(SavedAddress);
    }, [userId]);

    const getInitials = (name = "") =>
        name.split(" ").map((w) => w[0]).join("").toLocaleUpperCase().slice(0, 2) || "?";

    const handleSave = () => {
        if (!address.trim()) return;
        localStorage.setItem(`adresa_${userId}`, address);
        setSavedAddress(address);
        setAddress("");
        setShowForm(false);
        toast.success("adresa de livrare a fost salvata");
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
                        {savedAddress ? "schimba adresa" : "adauga adresa de livrare"}
                    </button>

                    {showForm && (
                        <div className={styles.addressForm}>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="te rog introdu adresa ta"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <button className={styles.btnSave} onClick={handleSave} disabled={!address.trim()}>
                                salveaza
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default CustomerProfile;