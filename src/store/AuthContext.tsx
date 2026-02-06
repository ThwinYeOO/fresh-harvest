import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { User, Order } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  orders: Order[];
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_ORDERS'; payload: Order[] };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  orders: Order[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = [
  { id: '1', email: 'admin@htoohtoo.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
  { id: '2', email: 'customer@example.com', password: 'customer123', name: 'John Doe', role: 'customer' as const },
];

// Mock orders for demo
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    userId: '2',
    items: [
      { id: '1', name: 'Fresh Apple', price: 2.99, image: '/product-apple.png', category: 'Fruits', rating: 4.8, reviews: 120, description: 'Sweet and crispy red apples', inStock: true, quantity: 3, weight: '1kg' },
      { id: '2', name: 'Organic Banana', price: 1.99, image: '/product-banana.png', category: 'Fruits', rating: 4.6, reviews: 85, description: 'Ripe organic bananas', inStock: true, quantity: 2, weight: '1 bunch' },
    ],
    total: 12.95,
    status: 'delivered',
    createdAt: '2024-01-15T10:30:00Z',
    shippingAddress: {
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1 234 567 890',
    },
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-002',
    userId: '2',
    items: [
      { id: '3', name: 'Fresh Carrot', price: 1.49, image: '/product-carrot.png', category: 'Vegetables', rating: 4.7, reviews: 95, description: 'Fresh organic carrots', inStock: true, quantity: 5, weight: '500g' },
    ],
    total: 7.45,
    status: 'shipped',
    createdAt: '2024-01-20T14:15:00Z',
    shippingAddress: {
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1 234 567 890',
    },
    paymentMethod: 'PayPal',
  },
];

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, orders: [] };
    case 'UPDATE_USER':
      return state.user ? { ...state, user: { ...state.user, ...action.payload } } : state;
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    orders: [],
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('htoohtoo_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'LOGIN', payload: user });
      if (user.role === 'customer') {
        dispatch({ type: 'SET_ORDERS', payload: MOCK_ORDERS });
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      dispatch({ type: 'LOGIN', payload: userWithoutPassword });
      localStorage.setItem('htoohtoo_user', JSON.stringify(userWithoutPassword));
      if (user.role === 'customer') {
        dispatch({ type: 'SET_ORDERS', payload: MOCK_ORDERS });
      }
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      return false;
    }
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      email,
      name,
      role: 'customer' as const,
    };
    MOCK_USERS.push({ ...newUser, password });
    dispatch({ type: 'LOGIN', payload: newUser });
    localStorage.setItem('htoohtoo_user', JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('htoohtoo_user');
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: data });
    if (state.user) {
      localStorage.setItem('htoohtoo_user', JSON.stringify({ ...state.user, ...data }));
    }
  }, [state.user]);

  const addOrder = useCallback((order: Order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        orders: state.orders,
        login,
        register,
        logout,
        updateProfile,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
