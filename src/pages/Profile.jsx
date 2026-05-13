import React, { useState } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import SellerProfile from '../components/SellerProfile';
import CustomerProfile from '../components/CustomerProfile';

function Profile() {
  const { isUserLoggedIn, userRole, isLoading } = useAppAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <h2 style={{ color: 'var(--color-primary)' }}>se incarca profilul...</h2>
      </div>
    )
  }

  if (!isUserLoggedIn) {
    return (
      <div style={{ padding: '2rem 4rem', textAlign: 'center', marginTop: '5rem' }}>
        <h2>trebuie sa fii logat pentru a accesa profilul.</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '0', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {userRole?.toLowerCase() === 'vanzator' ? (
        <SellerProfile />
      ) : (
        <CustomerProfile />
      )}
    </div>
  );
}

export default Profile;