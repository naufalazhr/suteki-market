/**
 * Mock Storage Service
 * Simulates a backend database using localStorage
 */

const STORAGE_KEYS = {
  USERS: 'suteki_users',
  PRODUCTS: 'suteki_products',
  ORDERS: 'suteki_orders',
  CURRENT_USER: 'suteki_current_user',
};

// Initial Seed Data
const SEED_DATA = {
  users: [
    {
      id: 'admin-1',
      username: 'admin',
      password: 'password', // In a real app, this would be hashed
      name: 'Master Admin',
      role: 'admin',
    },
    {
      id: 'admin-2',
      username: 'masteradmin',
      password: 'masteradmin',
      name: 'Master Admin',
      role: 'admin',
    },
    {
      id: 'seller-1',
      username: 'seller',
      password: 'password',
      name: 'Kantor Cafe',
      role: 'seller',
    },
  ],
  products: [
    {
      id: 'prod-1',
      sellerId: 'seller-1',
      name: 'Kopi Susu Gula Aren',
      description: 'Kopi susu kekinian dengan gula aren asli.',
      price: 18000,
      category: 'Beverage',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'prod-2',
      sellerId: 'seller-1',
      name: 'Roti Bakar Coklat Keju',
      description: 'Roti tawar tebal dibakar dengan topping coklat dan keju melimpah.',
      price: 15000,
      category: 'Food',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1584776293029-4b333141e805?q=80&w=1000&auto=format&fit=crop',
    },
  ],
  orders: [],
};

// Helper to get data
const get = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Helper to set data
const set = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const storage = {
  // Initialize storage with seed data if empty
  init: () => {
    if (!get(STORAGE_KEYS.USERS)) {
      set(STORAGE_KEYS.USERS, SEED_DATA.users);
    } else {
      // Ensure masteradmin exists even if users are already seeded
      const users = get(STORAGE_KEYS.USERS);
      const masterAdminExists = users.some(u => u.username === 'masteradmin');
      if (!masterAdminExists) {
        const masterAdmin = SEED_DATA.users.find(u => u.username === 'masteradmin');
        if (masterAdmin) {
          users.push(masterAdmin);
          set(STORAGE_KEYS.USERS, users);
        }
      }
    }
    if (!get(STORAGE_KEYS.PRODUCTS)) {
      set(STORAGE_KEYS.PRODUCTS, SEED_DATA.products);
    }
    if (!get(STORAGE_KEYS.ORDERS)) {
      set(STORAGE_KEYS.ORDERS, SEED_DATA.orders);
    }
  },

  // User Methods
  getUsers: () => get(STORAGE_KEYS.USERS) || [],
  addUser: (user) => {
    const users = get(STORAGE_KEYS.USERS) || [];
    users.push(user);
    set(STORAGE_KEYS.USERS, users);
    return user;
  },
  removeUser: (userId) => {
    const users = get(STORAGE_KEYS.USERS) || [];
    const newUsers = users.filter(u => u.id !== userId);
    set(STORAGE_KEYS.USERS, newUsers);
  },
  updateUser: (updatedUser) => {
    const users = get(STORAGE_KEYS.USERS) || [];
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index >= 0) {
      users[index] = updatedUser;
      set(STORAGE_KEYS.USERS, users);
    }
  },
  findUser: (username, password) => {
    const users = get(STORAGE_KEYS.USERS) || [];
    return users.find(u => u.username === username && u.password === password);
  },

  // Product Methods
  getProducts: () => get(STORAGE_KEYS.PRODUCTS) || [],
  saveProduct: (product) => {
    const products = get(STORAGE_KEYS.PRODUCTS) || [];
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    set(STORAGE_KEYS.PRODUCTS, products);
    return product;
  },
  deleteProduct: (productId) => {
    const products = get(STORAGE_KEYS.PRODUCTS) || [];
    const newProducts = products.filter(p => p.id !== productId);
    set(STORAGE_KEYS.PRODUCTS, newProducts);
  },

  // Order Methods
  getOrders: () => get(STORAGE_KEYS.ORDERS) || [],
  addOrder: (order) => {
    const orders = get(STORAGE_KEYS.ORDERS) || [];
    orders.push(order);
    set(STORAGE_KEYS.ORDERS, orders);
    return order;
  },
  updateOrder: (updatedOrder) => {
    const orders = get(STORAGE_KEYS.ORDERS) || [];
    const index = orders.findIndex(o => o.id === updatedOrder.id);
    if (index >= 0) {
      orders[index] = updatedOrder;
      set(STORAGE_KEYS.ORDERS, orders);
    }
  },

  // Session
  getCurrentUser: () => get(STORAGE_KEYS.CURRENT_USER),
  setCurrentUser: (user) => set(STORAGE_KEYS.CURRENT_USER, user),
  clearSession: () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER),
};
