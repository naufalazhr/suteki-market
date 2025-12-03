import React from 'react';

export const Card = ({ children, title, action, className, style, ...props }) => {
  return (
    <div 
      className={className}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ...style
      }}
      {...props}
    >
      {(title || action) && (
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.5)'
        }}>
          {title && <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)' }}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div style={{ padding: '1.5rem' }}>
        {children}
      </div>
    </div>
  );
};
