import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Trash, User, ShoppingBag, Money, Package, Pencil, Warning } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminDashboard = () => {
  const { users, addUser, updateUser, removeUser, orders, products } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'seller' });
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Calculate Stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users.length;

  const resetForm = () => {
    setFormData({ name: '', username: '', password: '', role: 'seller' });
    setEditingUser(null);
    setIsFormOpen(false);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ ...user });
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUser({
        ...editingUser,
        ...formData
      });
    } else {
      addUser({
        id: `${formData.role}-${Date.now()}`,
        ...formData
      });
    }
    resetForm();
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      removeUser(userToDelete.id);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Dashboard Admin</h1>
        <Button onClick={() => {
          if (isFormOpen) resetForm();
          else setIsFormOpen(true);
        }}>
          {isFormOpen ? 'Batal' : 'Tambah Pengguna Baru'}
        </Button>
      </div>

      {/* Statistics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--color-primary-light)', borderRadius: '0.5rem', color: 'var(--color-primary)' }}>
              <Money size={32} weight="duotone" />
            </div>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total Pendapatan</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Rp {totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#e0f2fe', borderRadius: '0.5rem', color: '#0284c7' }}>
              <ShoppingBag size={32} weight="duotone" />
            </div>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total Pesanan</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalOrders}</h3>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#fef9c3', borderRadius: '0.5rem', color: '#ca8a04' }}>
              <Package size={32} weight="duotone" />
            </div>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total Produk</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalProducts}</h3>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#f3e8ff', borderRadius: '0.5rem', color: '#9333ea' }}>
              <User size={32} weight="duotone" />
            </div>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total Pengguna</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalUsers}</h3>
            </div>
          </div>
        </Card>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <Card title={editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"} style={{ marginBottom: '2rem' }}>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <Input
                  label="Nama Lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <Input
                  label="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Peran</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="seller">Penjual</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                  <Button type="submit" style={{ width: '100%' }}>
                    {editingUser ? 'Simpan Perubahan' : 'Buat Akun'}
                  </Button>
                  {editingUser && (
                    <Button type="button" variant="secondary" onClick={resetForm}>
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Manajemen Pengguna</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {users.map(user => (
          <Card key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                borderRadius: '50%', 
                background: user.role === 'admin' ? '#f3e8ff' : '#e0f2fe',
                color: user.role === 'admin' ? '#9333ea' : '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={24} weight="fill" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{user.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  @{user.username} • <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
                </p>
              </div>
            </div>
            {user.username !== 'masteradmin' && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" size="sm" onClick={() => handleEditClick(user)}>
                  <Pencil size={20} />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(user)}>
                  <Trash size={20} />
                </Button>
              </div>
            )}
          </Card>
        ))}
        {users.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
            Belum ada pengguna.
          </p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '400px',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  borderRadius: '50%', 
                  background: '#fee2e2', 
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Warning size={32} weight="fill" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Hapus Pengguna?</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  Apakah Anda yakin ingin menghapus pengguna <strong>{userToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
                  <Button variant="secondary" style={{ flex: 1 }} onClick={() => setDeleteModalOpen(false)}>
                    Batal
                  </Button>
                  <Button variant="danger" style={{ flex: 1 }} onClick={confirmDelete}>
                    Hapus
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
