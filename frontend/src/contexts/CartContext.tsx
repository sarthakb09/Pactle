import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, CartTotal } from '../types';
import apiService from '../services/api';
import toast from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  cartTotal: CartTotal | null;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<CartTotal | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const [items, total] = await Promise.all([
        apiService.getCart(),
        apiService.getCartTotal()
      ]);
      setCartItems(items);
      setCartTotal(total);
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load cart on mount
    refreshCart();
  }, []);

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      setLoading(true);
      await apiService.addToCart(product.id, quantity);
      await refreshCart();
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add item to cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (id: number, quantity: number) => {
    try {
      setLoading(true);
      await apiService.updateCartItem(id, quantity);
      await refreshCart();
      toast.success('Cart updated!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      setLoading(true);
      await apiService.removeFromCart(id);
      await refreshCart();
      toast.success('Item removed from cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to remove item from cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await apiService.clearCart();
      setCartItems([]);
      setCartTotal(null);
      toast.success('Cart cleared!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to clear cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cartItems,
    cartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loading,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 