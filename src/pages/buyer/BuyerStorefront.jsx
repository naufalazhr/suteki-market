import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { ShoppingCart, X, QrCode, Bank, Storefront, Funnel, SortAscending } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BuyerStorefront = () => {
  const { user } = useAuth();
  const { products, sellers, placeOrder } = useStore();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price_asc', 'price_desc'
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to get seller name
  const getSellerName = (sellerId) => {
    const seller = sellers.find(s => s.id === sellerId);
    return seller ? seller.name : 'Unknown Seller';
  };

  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(product => {
      // Search Query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Category Filter
      if (selectedCategory === 'All') return true;
      return product.category.toLowerCase().includes(selectedCategory.toLowerCase()) || 
             (selectedCategory === 'Makanan' && product.category.toLowerCase() === 'food') ||
             (selectedCategory === 'Minuman' && product.category.toLowerCase() === 'beverage');
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      // Check stock limit
      if (existing && existing.quantity >= product.stock) return prev;
      
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { 
        productId: product.id, 
        name: product.name, 
        price: product.price, 
        sellerId: product.sellerId,
        quantity: 1 
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    // If user is a guest/buyer (not admin/seller) and hasn't provided phone, ask for it
    if (user.role === 'buyer' && !user.phone && !whatsappNumber) {
      setCheckoutStep('contact');
    } else {
      setCheckoutStep('payment');
    }
  };

  const confirmPayment = (method) => {
    const order = {
      id: `order-${Date.now()}`,
      buyerId: user.id,
      buyerName: user.name,
      buyerPhone: user.phone || whatsappNumber, // Save contact info
      items: cart,
      total: totalAmount,
      paymentMethod: method,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    placeOrder(order);
    setCart([]);
    setCheckoutStep('success');
    setWhatsappNumber(''); // Reset after order
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Katalog Produk</h1>
        <Button variant="secondary" onClick={() => setIsCartOpen(true)}>
          <ShoppingCart size={24} style={{ marginRight: '0.5rem' }} />
          Keranjang ({cart.reduce((a, b) => a + b.quantity, 0)})
        </Button>
      </div>

      {/* Search, Filters & Sorting */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Input 
            placeholder="Cari makanan atau minuman..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', maxWidth: '400px' }}
          />
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Funnel size={20} color="var(--color-text-muted)" />
          <Button 
            size="sm" 
            variant={selectedCategory === 'All' ? 'primary' : 'secondary'} 
            onClick={() => setSelectedCategory('All')}
            style={{ borderRadius: '999px' }}
          >
            Semua
          </Button>
          <Button 
            size="sm" 
            variant={selectedCategory === 'Makanan' ? 'primary' : 'secondary'} 
            onClick={() => setSelectedCategory('Makanan')}
            style={{ borderRadius: '999px' }}
          >
            Makanan
          </Button>
          <Button 
            size="sm" 
            variant={selectedCategory === 'Minuman' ? 'primary' : 'secondary'} 
            onClick={() => setSelectedCategory('Minuman')}
            style={{ borderRadius: '999px' }}
          >
            Minuman
          </Button>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <SortAscending size={20} color="var(--color-text-muted)" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="name">Nama (A-Z)</option>
            <option value="price_asc">Harga (Terendah)</option>
            <option value="price_desc">Harga (Tertinggi)</option>
          </select>
        </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ height: '150px', backgroundColor: '#f1f5f9', marginBottom: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>Tidak Ada Gambar</div>
                  )}
                </div>
                
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.25rem', 
                    fontSize: '0.75rem', 
                    color: 'var(--color-primary)',
                    backgroundColor: 'var(--color-primary-light)',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '999px',
                    marginBottom: '0.25rem'
                  }}>
                    <Storefront size={12} weight="fill" />
                    {getSellerName(product.sellerId)}
                  </div>
                  <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>{product.name}</h3>
                </div>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>{product.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Rp {product.price.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: product.stock > 0 ? 'var(--color-text-muted)' : 'var(--color-danger)' }}>
                      {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
                    </div>
                  </div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button size="sm" onClick={() => addToCart(product)} disabled={product.stock <= 0}>
                      {product.stock > 0 ? 'Beli' : 'Habis'}
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar Cart Overlay */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setIsCartOpen(false)}>
          
          {/* Sidebar Content */}
          <div style={{
            width: '100%',
            maxWidth: '400px',
            height: '100%',
            backgroundColor: 'var(--color-surface)',
            boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
            padding: '2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Keranjang Belanja</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)}>
                <X size={24} />
              </Button>
            </div>

            {checkoutStep === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Pesanan Diterima!</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                  Terima kasih, {user.name}. Penjual akan segera memproses pesananmu.
                </p>
                <Button onClick={() => {
                  setCheckoutStep('cart');
                  setIsCartOpen(false);
                }}>Lanjut Belanja</Button>
              </div>
            ) : (
              <>
                {cart.length === 0 ? (
                  <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Keranjang masih kosong</p>
                ) : (
                  <>
                    <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                      {cart.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                          <div>
                            <div style={{ fontWeight: 500 }}>{item.name}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                              {item.quantity} x Rp {item.price.toLocaleString()}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.productId)}>
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem', marginBottom: '1.5rem' }}>
                      <span>Total</span>
                      <span>Rp {totalAmount.toLocaleString()}</span>
                    </div>

                    {checkoutStep === 'cart' && (
                      <Button style={{ width: '100%' }} onClick={handleCheckout}>Bayar Sekarang</Button>
                    )}
                    
                    {checkoutStep === 'contact' && (
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Informasi Kontak</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                          Mohon masukkan nomor WhatsApp agar penjual dapat menghubungi Anda.
                        </p>
                        <Input 
                          label="Nomor WhatsApp" 
                          placeholder="Contoh: 081234567890" 
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          required
                        />
                        <Button 
                          style={{ width: '100%' }} 
                          onClick={() => setCheckoutStep('payment')}
                          disabled={!whatsappNumber || whatsappNumber.length < 10}
                        >
                          Lanjut ke Pembayaran
                        </Button>
                        <Button variant="ghost" onClick={() => setCheckoutStep('cart')}>Kembali</Button>
                      </div>
                    )}

                    {checkoutStep === 'payment' && (
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Pilih Metode Pembayaran:</p>
                        <Button variant="secondary" style={{ justifyContent: 'flex-start' }} onClick={() => confirmPayment('transfer')}>
                          <Bank size={20} style={{ marginRight: '0.5rem' }} />
                          Transfer Bank
                        </Button>
                        <Button variant="secondary" style={{ justifyContent: 'flex-start' }} onClick={() => confirmPayment('qris')}>
                          <QrCode size={20} style={{ marginRight: '0.5rem' }} />
                          QRIS
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setCheckoutStep('cart')} style={{ marginTop: '0.5rem' }}>
                          Kembali ke Keranjang
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
