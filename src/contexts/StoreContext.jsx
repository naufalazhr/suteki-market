import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const refreshData = () => {
    setProducts(storage.getProducts());
    setOrders(storage.getOrders());
    setUsers(storage.getUsers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addProduct = (product) => {
    storage.saveProduct(product);
    refreshData();
  };

  const updateProduct = (product) => {
    storage.saveProduct(product);
    refreshData();
  };

  const deleteProduct = (id) => {
    storage.deleteProduct(id);
    refreshData();
  };

  const placeOrder = (order) => {
    setOrders(prev => [order, ...prev]);
    storage.addOrder(order);
    
    // Reduce Stock
    order.items.forEach(item => {
      const productIndex = products.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        const updatedProduct = { 
          ...products[productIndex], 
          stock: products[productIndex].stock - item.quantity 
        };
        updateProduct(updatedProduct); // Call updateProduct with the full product object
      }
    });
    refreshData();
  };

  const updateOrderStatus = (orderId, status) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      storage.updateOrder({ ...order, status });
      refreshData();
    }
  };

  const updateOrder = (updatedOrder) => {
    storage.updateOrder(updatedOrder);
    refreshData();
  };

  const addUser = (user) => {
    storage.addUser(user);
    refreshData();
  };

  const removeUser = (userId) => {
    storage.removeUser(userId);
    refreshData();
  };

  const updateUser = (user) => {
    storage.updateUser(user);
    refreshData();
  };

  return (
    <StoreContext.Provider value={{
      products,
      orders,
      users,
      sellers: users.filter(u => u.role === 'seller'), // Derived for backward compatibility if needed
      addProduct,
      updateProduct,
      deleteProduct,
      placeOrder,
      updateOrderStatus,
      updateOrder,
      addUser,
      updateUser,
      removeUser,
      refreshData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
