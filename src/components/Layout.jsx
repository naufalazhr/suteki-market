import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { SignOut, Storefront, UserCircle, ShoppingBag, ClockCounterClockwise } from 'phosphor-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 2rem',
        height: '4.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'var(--gradient-primary)', 
            padding: '0.4rem', 
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Storefront size={24} weight="fill" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Suteki Market
          </span>
        </div>

        {/* Buyer Navigation */}
        {user && user.role === 'buyer' && (
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant={location.pathname === '/store' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => navigate('/store')}
              style={{ borderRadius: '999px' }}
            >
              <ShoppingBag size={18} style={{ marginRight: '0.5rem' }} />
              Belanja
            </Button>
            <Button
              variant={location.pathname === '/orders' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => navigate('/orders')}
              style={{ borderRadius: '999px' }}
            >
              <ClockCounterClockwise size={18} style={{ marginRight: '0.5rem' }} />
              Riwayat Pesanan
            </Button>
          </nav>
        )}

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.role}</div>
              </div>
              <div style={{ 
                width: '2.5rem', 
                height: '2.5rem', 
                background: 'var(--color-primary-light)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}>
                <UserCircle size={24} weight="fill" />
              </div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'var(--color-border)' }}></div>
            <Button variant="ghost" size="sm" onClick={handleLogout} title="Keluar">
              <SignOut size={20} />
            </Button>
          </div>
        )}
      </header>

      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
};
