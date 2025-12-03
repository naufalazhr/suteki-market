import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Storefront, ShieldCheck, ArrowLeft, User, Lock } from 'phosphor-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const LoginPage = ({ role }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const isSeller = role === 'seller';
  const title = isSeller ? 'Login Penjual' : 'Login Admin';
  const subtitle = isSeller ? 'Kelola toko dan pesananmu' : 'Pusat kontrol sistem';
  const Icon = isSeller ? Storefront : ShieldCheck;
  const themeColor = isSeller ? 'var(--color-primary)' : 'var(--color-secondary)';

  useEffect(() => {
    if (user && user.role === role) {
      navigate(role === 'admin' ? '/admin' : '/seller');
    }
  }, [user, role, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const result = login(username, password);
    
    if (result.success) {
      const currentUser = result.user;
      
      if (currentUser.role !== role) {
        logout();
        setError(`Akun ini bukan akun ${role === 'admin' ? 'Admin' : 'Penjual'}`);
      }
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'var(--gradient-bg)',
      padding: '1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          overflow: 'hidden',
          padding: '2.5rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              style={{
                width: '4rem',
                height: '4rem',
                background: `linear-gradient(135deg, ${themeColor} 0%, ${isSeller ? 'var(--color-primary-light)' : 'var(--color-secondary-hover)'} 100%)`,
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <Icon size={32} weight="fill" />
            </motion.div>
            <h1 style={{ 
              fontSize: '1.75rem', 
              fontWeight: 800, 
              color: 'var(--color-text)',
              marginBottom: '0.5rem',
              letterSpacing: '-0.025em'
            }}>
              {title}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              {subtitle}
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              icon={<User size={20} />}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              icon={<Lock size={20} />}
            />
            
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ 
                  color: 'var(--color-danger)', 
                  fontSize: '0.875rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              size="lg"
              style={{ 
                width: '100%', 
                marginTop: '0.5rem',
                background: isSeller ? 'var(--gradient-primary)' : 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-hover) 100%)'
              }}
            >
              Masuk Sekarang
            </Button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a 
              href="/" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              <ArrowLeft size={16} weight="bold" />
              Kembali ke Halaman Utama
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
