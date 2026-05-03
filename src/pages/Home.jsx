import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function Home() {
    const {user, isAuthenticated} = useAuth0();

    return (
        <div style={{ padding: '2rem 4rem'}}>
            {isAuthenticated && (
                <div style={{ 
                    padding: '2rem',
                    marginTop: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                    <h2>salut, {user.given_name || user.name}!</h2>
                    <p>bine ai venit in foodloop. de aici vei putea vedea ofertele disponibile sau poti adauga propriile oferte</p>
                </div>
            )}
        </div>
    );
}
export default Home;