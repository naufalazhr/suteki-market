import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';

export const BuyerEntryPage = () => {
  const [name, setName] = useState('');
  const { loginAsBuyer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      loginAsBuyer(name);
      navigate('/');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="Welcome to Suteki Market" style={{ width: '100%', maxWidth: '400px' }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
          Please enter your name to start shopping.
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            required
          />
          <Button type="submit" style={{ width: '100%' }}>Start Shopping</Button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <a href="/login" style={{ color: 'var(--color-primary)' }}>Seller Login</a>
        </div>
      </Card>
    </div>
  );
};
