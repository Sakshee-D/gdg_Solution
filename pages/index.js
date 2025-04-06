'use client';
import { useEffect, useState } from 'react';
import supabase from '../utils/supabase';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const handleGuestLogin = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({
      email: 'guest@carbonapp.com',
      password: 'guest1234',
    });

    if (error) {
      alert('Guest login failed: ' + error.message);
    } else {
      console.log('Guest login success:', user);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div
  style={{
    backgroundImage: 'url("/forest.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '2rem',
    textAlign: 'center',
  }}
>

    
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>🌿 Carbon Tracker</h1>
      <p style={{ maxWidth: '600px', marginTop: '1rem', fontSize: '1.2rem' }}>
        Monitor your carbon footprint and make eco-friendly choices. Sign in to get personalized insights and help our planet thrive.
      </p>

      {user ? (
        <>
          <p style={{ marginTop: '2rem' }}>Logged in as: {user.email}</p>
          <button onClick={signOut} style={buttonStyle}>
            Sign Out
          </button>
        </>
      ) : (
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button onClick={signInWithGoogle} style={buttonStyle}>
            Sign in with Google
          </button>
          <button onClick={handleGuestLogin} style={buttonStyle}>
            Continue as Guest
          </button>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 20px',
  fontSize: '16px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: '0.3s',
};
