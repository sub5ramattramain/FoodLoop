import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import styles from "./CustomerProfile.module.css";

function CustomerProfile() {
    const {displayName, profilePicture, user, userId} = useAppAuth();
    const [showForm, setShowForm]             = useState(false);
    const [address, setAddress]               = useState("");
    const [savedAddress, setSavedAddress]     = useState("");

    useEffect (() => {
        if(!userId) return;
        const SavedAddress = localStorage.getItem(`adresa_${userId}`);
        if(SavedAddress)
            setSavedAddress(SavedAddress);
    }, [userId]);

    const getInitials = (name = "") =>
        name.split(" ").map((w) => w[0]).join("").toLocaleUpperCase().slice(0, 2) || "?";

    const handleSave = () => {
        console.log("address este:", address);
        if(!address)         return  ;
        localStorage.setItem(`adresa_${userId}`, address);
        setSavedAddress     (address);
        setAddress          (""); 
        setShowForm         (false)  ;
    }


    return (
        <div className={styles.page}>

          <div className   = {styles.card}>
            <div className = {styles.profile}>

                 <div className={styles.avatar}>
                    {profilePicture 
                        ? <img src = {profilePicture} alt = "profil" className={styles.avatarImg}/>
                        : getInitials(displayName)
                    }
                </div>

                <div>
                    <p className = {styles.name}> {displayName} </p>
                    <p className = {styles.email}> {user?.email}</p>
                    {savedAddress && (
                        <p className = {styles.savedAddress}> 📍 {savedAddress} </p>
                    )}
                </div>

            </div>
          
            <hr className = {styles.divider}/>

            <div className = {styles.addressSection}>

                <button 
                    className = {styles.btn}
                    onClick={() =>{ setAddress(savedAddress); setShowForm(!showForm);}}
                >
                    {savedAddress ? "Schimbă adresa" : "Adaugă adresă de livrare"}
                </button>

                {showForm && (
                <div className = {styles.addressForm}>
                    <input 
                        className   = {styles.input}
                        type        = "text"
                        placeholder = "Te rog introdu adresa ta"
                        value       = {address}
                        onChange    = {(e) => setAddress(e.target.value)}
                    />
                    <button className = {styles.btnSave}
                            onClick   = {handleSave}
                            disabled  = {!address.trim()}
                    >
                            Salveaza
                    </button>
                </div>
                )}
                </div>

             </div>
        </div>
    );
}

export default CustomerProfile;