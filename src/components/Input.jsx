import React from 'react';

export const Input = ({ label, error, icon, ...props }) => {
  return (
    <div style={{ marginBottom: '1rem', width: '100%' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontSize: '0.875rem', 
          fontWeight: 500,
          color: 'var(--color-text)'
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            {icon}
          </div>
        )}
        <input
          style={{
            width: '100%',
            height: '2.75rem',
            padding: icon ? '0 0.75rem 0 2.5rem' : '0 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            outline: 'none',
            transition: 'all 0.2s',
            fontSize: '0.95rem'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
            e.target.style.boxShadow = '0 0 0 3px var(--color-primary-light)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ 
          display: 'block', 
          marginTop: '0.25rem', 
          fontSize: '0.75rem', 
          color: 'var(--color-danger)' 
        }}>
          {error}
        </span>
      )}
    </div>
  );
};
