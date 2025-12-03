import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Plus, Trash, CheckCircle, Bell, WhatsappLogo, Printer, UserGear, X, Warning } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SellerDashboard = () => {
  const { user } = useAuth();
  const { products, orders, addProduct, deleteProduct, updateOrderStatus, updateUser } = useStore();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  
  // Product State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: '', image: '' });

  // Profile Edit State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bankName: user?.bankName || '',
    bankAccount: user?.bankAccount || '',
    bankHolder: user?.bankHolder || '',
    qrisImage: user?.qrisImage || ''
  });

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);

  const myProducts = products.filter(p => p.sellerId === user.id);
  const myOrders = orders.filter(o => o.items.some(item => item.sellerId === user.id));
  const pendingOrders = myOrders.filter(o => o.status !== 'completed');

  // Check if payment info is complete (At least one method required)
  const isPaymentInfoComplete = user.bankAccount || user.qrisImage;

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bankName: user.bankName || '',
        bankAccount: user.bankAccount || '',
        bankHolder: user.bankHolder || '',
        qrisImage: user.qrisImage || ''
      });
    }
  }, [user]);

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    
    // Validation
    if (Number(newProduct.price) < 0) {
      alert('Harga tidak boleh negatif');
      return;
    }
    if (Number(newProduct.stock) < 0) {
      alert('Stok tidak boleh negatif');
      return;
    }

    addProduct({
      id: `prod-${Date.now()}`,
      sellerId: user.id,
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock)
    });
    setNewProduct({ name: '', description: '', price: '', stock: '', category: '', image: '' });
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProduct(id);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateUser({
      ...user,
      ...profileData
    });
    setIsProfileModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, qrisImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const sendToWhatsapp = (order) => {
    const itemsList = order.items
      .filter(i => i.sellerId === user.id)
      .map(i => `${i.quantity}x ${i.name}`)
      .join('\n');
    
    const total = order.items
      .filter(i => i.sellerId === user.id)
      .reduce((sum, i) => sum + (i.price * i.quantity), 0);

    const message = `*Pesanan Baru #${order.id.slice(-4)}*\n\n${itemsList}\n\n*Total: Rp ${total.toLocaleString()}*\nPemesan: ${order.buyerName}\nCatatan: ${order.note || '-'}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const printReceipt = (order) => {
    const printWindow = window.open('', '_blank');
    const items = order.items.filter(i => i.sellerId === user.id);
    const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Pesanan #${order.id.slice(-6)}</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; display: flex; justify-content: space-between; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>${user.name}</h3>
            <p>Order #${order.id.slice(-6)}</p>
            <p>${new Date(order.timestamp).toLocaleString('id-ID')}</p>
          </div>
          <div>
            <p><strong>Pemesan:</strong> ${order.buyerName}</p>
            <br/>
            ${items.map(item => `
              <div class="item">
                <span>${item.quantity}x ${item.name}</span>
                <span>${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            <span>TOTAL</span>
            <span>Rp ${total.toLocaleString()}</span>
          </div>
          ${order.note ? `<p style="margin-top: 10px; font-style: italic;">Catatan: ${order.note}</p>` : ''}
          <div class="footer">
            <p>Terima Kasih!</p>
          </div>
          <button class="no-print" onclick="window.print()" style="width: 100%; padding: 10px; margin-top: 20px; cursor: pointer;">Cetak Struk</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Bulk Print State
  const [selectedOrders, setSelectedOrders] = useState([]);

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === myOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(myOrders.map(o => o.id));
    }
  };

  const printConsolidatedReceipts = () => {
    const ordersToPrint = myOrders.filter(o => selectedOrders.includes(o.id));
    if (ordersToPrint.length === 0) return;

    const printWindow = window.open('', '_blank');
    
    const receiptsHtml = ordersToPrint.map(order => {
      const items = order.items.filter(i => i.sellerId === user.id);
      const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      
      return `
        <div class="receipt" style="page-break-after: always; margin-bottom: 40px; border-bottom: 1px dashed #ccc; padding-bottom: 20px;">
          <div class="header">
            <h3>${user.name}</h3>
            <p>Order #${order.id.slice(-6)}</p>
            <p>${new Date(order.timestamp).toLocaleString('id-ID')}</p>
          </div>
          <div>
            <p><strong>Pemesan:</strong> ${order.buyerName}</p>
            <br/>
            ${items.map(item => `
              <div class="item">
                <span>${item.quantity}x ${item.name}</span>
                <span>${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            <span>TOTAL</span>
            <span>Rp ${total.toLocaleString()}</span>
          </div>
          ${order.note ? `<p style="margin-top: 10px; font-style: italic;">Catatan: ${order.note}</p>` : ''}
          <div class="footer">
            <p>Terima Kasih!</p>
          </div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Struk (${ordersToPrint.length})</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; display: flex; justify-content: space-between; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; }
            @media print { 
              .no-print { display: none; } 
              .receipt { border-bottom: none !important; margin-bottom: 0 !important; }
            }
          </style>
        </head>
        <body>
          ${receiptsHtml}
          <button class="no-print" onclick="window.print()" style="width: 100%; padding: 10px; margin-top: 20px; cursor: pointer; background: #000; color: #fff; border: none; font-weight: bold;">Cetak Semua (${ordersToPrint.length})</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div>
      {/* Payment Warning Banner */}
      {!isPaymentInfoComplete && (
        <div style={{ 
          background: '#fee2e2', 
          border: '1px solid #f87171', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: '#fecaca', borderRadius: '50%' }}>
              <Bell size={20} weight="fill" />
            </div>
            <div>
              <strong style={{ display: 'block' }}>Wajib Lengkapi Informasi Pembayaran</strong>
              <span style={{ fontSize: '0.875rem' }}>Anda harus mengatur nomor rekening atau QRIS sebelum bisa menambahkan produk.</span>
            </div>
          </div>
          <Button size="sm" onClick={() => setIsProfileModalOpen(true)} variant="danger">
            Setup Sekarang
          </Button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Dashboard Penjual</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Selamat datang, {user.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <Button variant="secondary" style={{ padding: '0.5rem' }} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={24} />
              {pendingOrders.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--color-danger)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {pendingOrders.length}
                </span>
              )}
            </Button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '300px',
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50,
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>
                    Notifikasi ({pendingOrders.length})
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {pendingOrders.length === 0 ? (
                      <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        Tidak ada pesanan baru
                      </div>
                    ) : (
                      pendingOrders.map(order => (
                        <div key={order.id} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Pesanan Baru #{order.id.slice(-4)}</div>
                          <div style={{ color: 'var(--color-text-muted)' }}>Dari {order.buyerName}</div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button variant="secondary" onClick={() => setIsProfileModalOpen(true)}>
            <UserGear size={20} style={{ marginRight: '0.5rem' }} />
            Edit Profil
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Button 
          variant={activeTab === 'orders' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('orders')}
        >
          Pesanan
        </Button>
        <Button 
          variant={activeTab === 'products' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('products')}
        >
          Produk
        </Button>
      </div>

      {activeTab === 'products' && (
        <>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            {isPaymentInfoComplete ? (
              <Button onClick={() => setIsAddingProduct(!isAddingProduct)}>
                <Plus size={20} style={{ marginRight: '0.5rem' }} />
                Tambah Produk
              </Button>
            ) : (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Warning size={20} />
                Lengkapi info pembayaran untuk menambah produk
              </div>
            )}
          </div>

          {isAddingProduct && (
            <Card title="Tambah Produk Baru" style={{ marginBottom: '2rem' }}>
              <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <Input label="Nama Produk" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                <Input label="Kategori" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required />
                <Input label="Harga" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                <Input label="Stok" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Gambar Produk</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    style={{ 
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '0.5rem'
                    }}
                  />
                  {newProduct.image && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Preview:</p>
                      <img src={newProduct.image} alt="Product Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                      <div style={{ marginTop: '0.5rem' }}>
                        <Button type="button" variant="danger" size="sm" onClick={() => setNewProduct({ ...newProduct, image: '' })}>
                          Hapus Gambar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="Deskripsi" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Button type="submit">Simpan Produk</Button>
                </div>
              </form>
            </Card>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {myProducts.map(product => (
              <Card key={product.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ height: '150px', backgroundColor: '#f1f5f9', marginBottom: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>Tidak Ada Gambar</div>
                  )}
                </div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{product.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontWeight: 700 }}>Rp {product.price.toLocaleString()}</span>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Bulk Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={selectedOrders.length === myOrders.length && myOrders.length > 0}
                onChange={toggleSelectAll}
                style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 500 }}>Pilih Semua</span>
            </div>
            
            {selectedOrders.length > 0 && (
              <Button onClick={printConsolidatedReceipts}>
                <Printer size={20} style={{ marginRight: '0.5rem' }} />
                Cetak {selectedOrders.length} Struk Terpilih
              </Button>
            )}
          </div>

          {myOrders.map(order => (
            <Card key={order.id}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ paddingTop: '0.25rem' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontWeight: 600 }}>Order #{order.id.slice(-6)}</h3>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        Pembeli: {order.buyerName} • {new Date(order.timestamp).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        backgroundColor: order.status === 'completed' ? '#dcfce7' : '#fef9c3',
                        color: order.status === 'completed' ? '#166534' : '#854d0e'
                      }}>
                        {order.status === 'completed' ? 'SELESAI' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginBottom: '1rem' }}>
                    {order.items.filter(i => i.sellerId === user.id).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>{item.quantity}x {item.name}</span>
                        <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="secondary" size="sm" onClick={() => sendToWhatsapp(order)}>
                        <WhatsappLogo size={20} style={{ marginRight: '0.5rem', color: '#25D366' }} />
                        Kirim WA
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => printReceipt(order)}>
                        <Printer size={20} style={{ marginRight: '0.5rem' }} />
                        Cetak Struk
                      </Button>
                    </div>
                    
                    {order.status !== 'completed' && (
                      <Button onClick={() => updateOrderStatus(order.id, 'completed')}>
                        <CheckCircle size={20} style={{ marginRight: '0.5rem' }} />
                        Tandai Selesai
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {myOrders.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
              Belum ada pesanan.
            </p>
          )}
        </div>
      )}

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
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
                maxWidth: '500px',
                boxShadow: 'var(--shadow-lg)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Edit Profil Toko</h2>
                <button onClick={() => setIsProfileModalOpen(false)} style={{ padding: '0.5rem', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '1rem' }}>
                <Input 
                  label="Nama Toko" 
                  value={profileData.name} 
                  onChange={e => setProfileData({...profileData, name: e.target.value})} 
                  required 
                />
                
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Informasi Pembayaran</h3>
                  <Input 
                    label="Nama Bank / E-Wallet" 
                    placeholder="Contoh: BCA, GoPay, OVO"
                    value={profileData.bankName} 
                    onChange={e => setProfileData({...profileData, bankName: e.target.value})} 
                  />
                  <Input 
                    label="Nomor Rekening / HP" 
                    value={profileData.bankAccount} 
                    onChange={e => setProfileData({...profileData, bankAccount: e.target.value})} 
                  />
                  <Input 
                    label="Atas Nama" 
                    value={profileData.bankHolder} 
                    onChange={e => setProfileData({...profileData, bankHolder: e.target.value})} 
                  />
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Upload QRIS</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ 
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '0.5rem'
                      }}
                    />
                    {profileData.qrisImage && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Preview:</p>
                        <img src={profileData.qrisImage} alt="QRIS Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                        <div style={{ marginTop: '0.5rem' }}>
                          <Button type="button" variant="danger" size="sm" onClick={() => setProfileData({ ...profileData, qrisImage: '' })}>
                            Hapus Gambar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <Button type="button" variant="secondary" style={{ flex: 1 }} onClick={() => setIsProfileModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" style={{ flex: 1 }}>
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
