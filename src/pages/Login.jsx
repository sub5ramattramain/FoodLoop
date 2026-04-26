import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [isSignup, setIsSignup] = useState(false);
    const [userType, setUserType] = useState('individual');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(function() {
        const saved = localStorage.getItem('userSession');

        if(saved){
            const session = JSON.parse(saved);
            const currentTime = Date.now();
            const fifteenMinutes = 15*60*1000;

            if(currentTime - session.loginTime < fifteenMinutes) {
                setIsLoggedIn(true);
                setEmail(session.email);
            }
            else{
                setEmail(session.email);
                setIsLoggedIn(false);
                localStorage.removeItem('userSession');
                setError('Session expired. Please enter your password again');
            }
        }
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        setError('');

        const emailLower = email.toLowerCase();
        const isGmail = emailLower.toLowerCase().includes('@gmail.');
        const isYahoo = emailLower.toLowerCase().includes('@yahoo.');

        if (!isGmail && !isYahoo) {
        setError('Only @gmail. and @yahoo. addresses are accepted.');
        return;
        }

        if(isSignup) {
            if(password !== confirmPassword){
                setError('Passwords do not match');
                return;
            }

            if(password.length < 12){
                setError('Password must be at least 12 characters long');
                    return;
            }
        }
        if (isSignup) {
            alert("Account created! Please log in.");
            setIsSignup(false); 
            setEmail(email);    
            setPassword('');   
            setConfirmPassword('');
           
        } 
        else {
            const sessionData = {
                email: email,
                loginTime: Date.now()
            };
            localStorage.setItem('userSession', JSON.stringify(sessionData));
            setIsLoggedIn(true);
            
            alert("Logged in successfully!");
            navigate('/'); 
        }
    }

    function handleLogout() {
        localStorage.removeItem('userSession');
        setIsLoggedIn(false);
        setPassword('');
    }

    if(isLoggedIn){
        return(
            <div className="auth-container">
                <div className="auth-form">
                    <h2 style={{ color: 'white' }}>Welcome to FoodLoop</h2>
                    <p style={{ color: '#8a8aff' }}>Logged in as: {email}</p>
                    <p style={{ color: '#bdbdbd', fontSize: '0.8rem' }}>Session expires in 15 minutes.</p>
                    <button onClick={handleLogout} className="submit-btn">
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return(
        <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>

        {error && <p className="error-message">{error}</p>}

        {isSignup && (
          <div className="user-type-selector">
            <button 
              type="button"
              className={userType === 'individual' ? 'active' : ''} 
              onClick={function() { setUserType('individual'); }}
            >
              Individual
            </button>
            <button 
              type="button"
              className={userType === 'business' ? 'active' : ''} 
              onClick={function() { setUserType('business'); }}
            >
              Business
            </button>
          </div>
        )}

        <div className="input-group">
          <input 
            type="email" 
            placeholder="Email (@gmail or @yahoo)" 
            value={email}
            onChange={function(e) { setEmail(e.target.value); }}
            required 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={function(e) { setPassword(e.target.value); }}
            required 
          />

          {isSignup && (
            <input 
              type="password" 
              placeholder="Verify Password" 
              value={confirmPassword}
              onChange={function(e) { setConfirmPassword(e.target.value); }}
              required 
            />
          )}
        </div>

        <button type="submit" className="submit-btn">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>

        <p 
          onClick={function() { setIsSignup(!isSignup); setError(''); }} 
          className="toggle-text"
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </p>
      </form>
    </div>

    );
}

export default Login;