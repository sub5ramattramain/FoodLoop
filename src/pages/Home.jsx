import React from 'react';
import { useAppAuth } from '../hooks/useAppAuth';

function Home() {
    const { isUserLoggedIn, displayName } = useAppAuth();

    return (
        <div style={{ padding: '2rem 4rem'}}>
            {isUserLoggedIn && (
                <div style={{ 
                    padding: '2rem',
                    marginTop: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                    <h2>salut, {displayName}!</h2>
                    <p>bine ai venit in foodloop. de aici vei putea vedea ofertele disponibile sau poti adauga propriile oferte</p>
                </div>
            )}
        </div>
    );
}
export default Home;