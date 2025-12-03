import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ShoppingBag, Storefront, User, GoogleLogo, SignIn } from 'phosphor-react';
import { useGoogleLogin } from '@react-oauth/google';

export const LandingPage = () => {
  const [buyerName, setBuyerName] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { loginAsBuyer, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleBuyerEnter = (e) => {
    e.preventDefault();
    if (buyerName.trim()) {
      loginAsBuyer(buyerName);
      navigate('/store');
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      await loginWithGoogle(tokenResponse.access_token);
      setIsGoogleLoading(false);
      navigate('/store');
    },
    onError: () => {
      console.error('Google Login Failed');
      setIsGoogleLoading(false);
    }
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header with Seller & Admin Login */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        zIndex: 10
      }}>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/seller/login')}
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.6)', 
            backdropFilter: 'blur(4px)',
            borderRadius: '999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)'
          }}
        >
          <User size={18} style={{ marginRight: '0.5rem' }} />
          Masuk Penjual
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/login')}
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.6)', 
            backdropFilter: 'blur(4px)',
            borderRadius: '999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-primary)'
          }}
        >
          <SignIn size={18} style={{ marginRight: '0.5rem' }} />
          Masuk Admin
        </Button>
      </header>



      {/* Main Content */}
      <div style={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '1rem', 
            background: 'white', 
            borderRadius: '2rem', 
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '1.5rem'
          }}>
            <Storefront size={56} weight="duotone" color="var(--color-primary)" />
          </div>
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: 800, 
            lineHeight: 1.1, 
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <span className="text-gradient">Suteki Market</span>
          </h1>

        </div>

        {/* Buyer Card - Centered & Prominent */}
        <div className="glass-panel" style={{ 
          padding: '3rem', 
          borderRadius: '2.5rem', 
          boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.15)',
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: '3px solid rgba(255, 255, 255, 0.8)',
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}>


          <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              Mau Jajan Apa?
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.125rem' }}>
              Masuk buat pesen makanan & minuman favoritmu.
            </p>
            
            <Button 
              variant="secondary"
              onClick={() => login()}
              disabled={isGoogleLoading}
              style={{ 
                width: '100%', 
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '1rem',
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#3c4043',
                backgroundColor: 'white',
                border: '1px solid #dadce0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                marginBottom: '1.5rem'
              }}
            >
              {isGoogleLoading ? (
                'Masuk...'
              ) : (
                <>
                  <GoogleLogo size={24} weight="bold" color="#4285F4" />
                  Masuk dengan Google
                </>
              )}
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
              <span style={{ padding: '0 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>atau pakai nama aja</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
            </div>

            <form onSubmit={handleBuyerEnter} style={{ width: '100%' }}>
              <Input 
                placeholder="Tulis namamu disini..." 
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                style={{ 
                  textAlign: 'center', 
                  fontSize: '1.125rem', 
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-full)',
                  border: '2px solid var(--color-border)',
                  marginBottom: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.8)'
                }}
              />
              <Button 
                type="submit" 
                style={{ 
                  width: '100%', 
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--gradient-primary)',
                  fontSize: '1.125rem',
                  padding: '1rem',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                Mulai Belanja 🛍️
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      <div style={{ 
        position: 'absolute', 
        bottom: '1rem', 
        width: '100%', 
        textAlign: 'center', 
        color: 'var(--color-text-muted)', 
        fontSize: '0.875rem',
        zIndex: 1
      }}>
        © 2025 Suteki Market • Aplikasi Internal Kantor
      </div>
    </div>
  );
};
