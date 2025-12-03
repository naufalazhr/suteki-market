import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  style,
  ...props 
}) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'var(--font-sans)',
    ...style,
  };

  const variantStyles = {
    primary: {
      background: 'var(--gradient-primary)',
      color: 'white',
      boxShadow: 'var(--shadow-md)',
    },
    secondary: {
      backgroundColor: 'white',
      color: 'var(--color-text)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
    },
    danger: {
      backgroundColor: 'var(--color-danger)',
      color: 'white',
      boxShadow: 'var(--shadow-sm)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text)',
    },
  };

  const sizeStyles = {
    sm: { height: '2rem', padding: '0 0.75rem', fontSize: '0.875rem' },
    md: { height: '2.75rem', padding: '0 1.25rem', fontSize: '1rem' },
    lg: { height: '3.5rem', padding: '0 2rem', fontSize: '1.125rem' },
  };

  return (
    <button
      className={className}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...(props.disabled ? { opacity: 0.5, cursor: 'not-allowed', transform: 'none' } : {}),
      }}
      onMouseEnter={(e) => {
        if (!props.disabled && variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        if (!props.disabled && variant === 'primary') {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};
