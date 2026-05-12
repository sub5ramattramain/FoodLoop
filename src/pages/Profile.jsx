import React, { useState } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import SellerProfile from '../components/SellerProfile';
import CustomerProfile from '../components/CustomerProfile';

function Profile() {
  const { isUserLoggedIn } = useAppAuth();

  const [isSellerView, setIsSellerView] = useState(false);

  if (!isUserLoggedIn) {
    return (
      <div style={{ padding: '2rem 4rem', textAlign: 'center', marginTop: '5rem' }}>
        <h2>trebuie sa fii logat pentru a accesa profilul.</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh'}}>
      <button
        onClick={() => setIsSellerView(!isSellerView)}
        style={{ marginBottom: '2rem', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '20px', border: '1px solid var(--color-primary)', backgroundColor: 'transparent', color: 'var(--color-primary)', fontWeight: 'bold'}}
      >switch to {isSellerView ? 'customer profile' : 'seller profile'} (test)
      </button>

      {isSellerView ? (
        <SellerProfile />
      ) : (
        <CustomerProfile />
      )}
    </div>
  );
}

export default Profile;