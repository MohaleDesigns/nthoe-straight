"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/app/data/products';

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
}

export interface ShippingMethod {
  id: 'ship' | 'pickup';
  name: string;
  description: string;
  price: number;
  days: string;
}

export type CheckoutStep = 'cart' | 'shipping' | 'payment';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  checkoutStep: CheckoutStep;
  setCheckoutStep: (step: CheckoutStep) => void;
  shippingDetails: ShippingDetails;
  setShippingDetails: (details: ShippingDetails) => void;
  selectedShippingMethod: ShippingMethod | null;
  setSelectedShippingMethod: (method: ShippingMethod | null) => void;
  shippingTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'ship',
    name: 'Ship',
    description: '2 to 5 business days',
    price: 100,
    days: '2-5 business days'
  },
  {
    id: 'pickup',
    name: 'Pick up at the shop',
    description: 'Usually ready in 24hrs',
    price: 0,
    days: '24 hours'
  }
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    province: ''
  });
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);

  useEffect(() => {
    // Only access localStorage once mounted on client to prevent hydration mismatch
    const loadCart = () => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error("Failed to load cart", error);
        }
    }
    loadCart();
    
    // Delay setting isMounted to avoid synchronous setState warning and ensure hydration is complete
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size)
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId: number, size: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => 
      (item.id === productId && item.selectedSize === size)
        ? { ...item, quantity } 
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingTotal = selectedShippingMethod?.price || 0;

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      checkoutStep,
      setCheckoutStep,
      shippingDetails,
      setShippingDetails,
      selectedShippingMethod,
      setSelectedShippingMethod,
      shippingTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
