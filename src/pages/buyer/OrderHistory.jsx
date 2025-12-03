import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { Card } from '../../components/Card';
import { ClockCounterClockwise } from 'phosphor-react';

export const OrderHistory = () => {
  const { user } = useAuth();
  const { orders } = useStore();

  // Filter orders for current buyer
  const myOrders = orders.filter(order => order.buyerId === user.id);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ClockCounterClockwise size={32} weight="duotone" color="var(--color-primary)" />
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Riwayat Pesanan</h1>
      </div>

      {myOrders.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <ClockCounterClockwise size={64} weight="duotone" color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Belum Ada Pesanan</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Pesanan yang kamu buat akan muncul di sini.
            </p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {myOrders.map(order => (
            <Card key={order.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    {new Date(order.timestamp).toLocaleString('id-ID', {
                      dateStyle: 'long',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '0.375rem 0.875rem',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: order.status === 'completed' ? '#dcfce7' : '#fef9c3',
                  color: order.status === 'completed' ? '#166534' : '#854d0e'
                }}>
                  {order.status === 'completed' ? '✓ Selesai' : '⏳ Pending'}
                </span>
              </div>

              <div style={{ 
                borderTop: '1px solid var(--color-border)', 
                borderBottom: '1px solid var(--color-border)',
                padding: '1rem 0',
                marginBottom: '1rem'
              }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: idx < order.items.length - 1 ? '0.75rem' : 0
                  }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        {item.quantity} × Rp {item.price.toLocaleString()}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600 }}>
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Metode Pembayaran: <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>
                    {order.paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank'}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                    Total Pembayaran
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    Rp {order.total.toLocaleString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
