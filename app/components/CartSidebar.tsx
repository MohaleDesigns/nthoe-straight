"use client";

import { useCart, CheckoutStep, ShippingDetails, SHIPPING_METHODS } from "@/app/context/CartContext";
import { X, Plus, Minus, Trash2, Check, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import supabase from "@/app/api/client";
import type PaystackType from "@paystack/inline-js";

export default function CartSidebar() {
  const router = useRouter()

  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    clearCart,
    checkoutStep,
    setCheckoutStep,
    shippingDetails,
    setShippingDetails,
    selectedShippingMethod,
    setSelectedShippingMethod,
    shippingTotal
  } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field: keyof ShippingDetails, value: string) => {
    setShippingDetails({ ...shippingDetails, [field]: value });
  };

  const handleNavigation = () => {
    router.push('/shop');
    setIsCartOpen(false)
  };

  const canProceedToShipping = cart.length > 0;
  const canProceedToPayment = 
    shippingDetails.fullName &&
    shippingDetails.email &&
    shippingDetails.phone &&
    shippingDetails.address &&
    shippingDetails.city &&
    shippingDetails.postalCode &&
    shippingDetails.province &&
    selectedShippingMethod;

  const totalWithShipping = cartTotal + shippingTotal;

  const steps = [
    { id: 'cart' as CheckoutStep, label: 'Cart' },
    { id: 'shipping' as CheckoutStep, label: 'Shipping' },
    { id: 'payment' as CheckoutStep, label: 'Payment' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === checkoutStep);

  const handlePaystackPayment = useCallback(async () => {
    if (!canProceedToPayment) {
      setError("Please complete all required shipping details.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    if (!publicKey) {
      setError("Payment configuration is missing. Please contact support.");
      setIsProcessing(false);
      return;
    }

    // Dynamically import Paystack on client side only
    const Paystack = (await import("@paystack/inline-js")).default;

    // Extract first and last name from full name
    const nameParts = shippingDetails.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const paystack = new Paystack();
    const reference = `order-${Date.now()}`;

    paystack.newTransaction({
      key: publicKey,
      email: shippingDetails.email,
      amount: totalWithShipping * 100, // Paystack expects amount in kobo (cents)
      currency: 'ZAR',
      reference: reference,
      firstName: firstName,
      lastName: lastName,
      phone: shippingDetails.phone,
      metadata: {
        custom_fields: [
          {
            display_name: "Shipping Method",
            variable_name: "shipping_method",
            value: selectedShippingMethod?.name || "",
          },
        ],
      },
      onLoad: (response: unknown) => {
        console.log("Transaction loaded:", response);
      },
      onSuccess: async (transaction: { reference?: string }) => {
        try {
          // Get current user and session
          const { data: { user } } = await supabase.auth.getUser();
          const { data: sessionData } = await supabase.auth.getSession();
          const userId = user?.id || null;
          const accessToken = sessionData?.session?.access_token;

          // Save order to database
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
            },
            body: JSON.stringify({
              shippingDetails,
              cartItems: cart,
              subtotal: cartTotal,
              shippingCost: shippingTotal,
              total: totalWithShipping,
              selectedShippingMethod,
              paymentReference: transaction.reference || reference,
              userId
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // console.log('Order saved successfully:', data);
            
            // Reset checkout flow
            clearCart();
            setShippingDetails({
              fullName: '',
              email: '',
              phone: '',
              address: '',
              city: '',
              postalCode: '',
              province: ''
            });
            setSelectedShippingMethod(null);
            setIsCartOpen(false);
            setCheckoutStep('cart');
            setIsProcessing(false);
            
            // Redirect to orders page if user is logged in
            if (userId) {
              router.push('/orders');
            } else {
              router.push('/');
            }
          } else {
            console.error('Failed to save order');
            setError('Payment successful but failed to save order. Please contact support.');
            setIsProcessing(false);
          }
        } catch (err) {
          console.error('Error saving order:', err);
          setError('Payment successful but failed to save order. Please contact support.');
          setIsProcessing(false);
        }
      },
      onCancel: () => {
        // console.log("Payment cancelled by user");
        setIsProcessing(false);
      },
      onError: (err: { message?: string }) => {
        console.error("Payment error:", err);
        setError(err.message || "Payment failed. Please try again.");
        setIsProcessing(false);
      },
    });
  }, [canProceedToPayment, shippingDetails, selectedShippingMethod, totalWithShipping, cart, cartTotal, shippingTotal, router, clearCart, setShippingDetails, setSelectedShippingMethod, setIsCartOpen, setCheckoutStep]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-[60] transform transition-transform duration-500 ease-in-out shadow-2xl flex flex-col ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {/* Header with Progress Bar */}
        <div className="border-b border-gray-100">
          <div className="flex items-center justify-between p-6">
            <button 
              onClick={() => {
                if (checkoutStep === 'shipping') setCheckoutStep('cart');
                else if (checkoutStep === 'payment') setCheckoutStep('shipping');
              }}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
                checkoutStep === 'cart' ? 'invisible' : ''
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold tracking-tight">
              {checkoutStep === 'cart' && `Your Cart (${cart.length})`}
              {checkoutStep === 'shipping' && 'Shipping Details'}
              {checkoutStep === 'payment' && 'Payment'}
            </h2>
            <button 
              onClick={() => {
                setIsCartOpen(false);
                setCheckoutStep('cart');
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      index <= currentStepIndex
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index < currentStepIndex ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-xs mt-1 ${
                      index <= currentStepIndex ? 'text-black font-medium' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Cart Step */}
          {checkoutStep === 'cart' && (
            <div className="p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                    <ShoppingBagIcon className="w-8 h-8" />
                  </div>
                  <p className="text-gray-500 text-lg">Your cart is empty.</p>
                  <button 
                    onClick={handleNavigation}
                    className="text-black underline underline-offset-4 font-medium hover:text-gray-600"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                    <div className="w-24 h-32 bg-gray-100 shrink-0 overflow-hidden relative">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Size: {item.selectedSize} • {item.color}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                            className="p-1 hover:bg-gray-50 text-gray-500"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                            className="p-1 hover:bg-gray-50 text-gray-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-semibold">R{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Shipping Step */}
          {checkoutStep === 'shipping' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name <span style={{ color: 'red', fontSize: '1rem' }}>*</span></label>
                    <input
                      type="text"
                      value={shippingDetails.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span style={{ color: 'red', fontSize: '1rem' }}>*</span></label>
                    <input
                      type="email"
                      value={shippingDetails.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span style={{ color: 'red', fontSize: '1rem' }}>*</span></label>
                    <input
                      type="tel"
                      value={shippingDetails.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="+27 12 345 6789"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address <span style={{ color: 'red', fontSize: '1rem' }}>*</span></label>
                    <input
                      type="text"
                      value={shippingDetails.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City <span style={{ color: 'red', fontSize: '1rem' }}>*</span></label>
                      <input
                        type="text"
                        value={shippingDetails.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Johannesburg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code <span style={{ color: 'red', fontSize: '1rem' }}>*</span></label>
                      <input
                        type="text"
                        value={shippingDetails.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="2000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province <span style={{ color: 'red', fontSize: '1rem' }}>*</span></label>
                    <input
                      type="text"
                      value={shippingDetails.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Gauteng"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedShippingMethod?.id === method.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShippingMethod?.id === method.id}
                            onChange={() => setSelectedShippingMethod(method)}
                            className="w-4 h-4 text-black"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {method.price === 0 ? 'FREE' : `R${method.price.toLocaleString()}`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {checkoutStep === 'payment' && (
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} (x{item.quantity}) - {item.selectedSize}
                      </span>
                      <span className="font-medium">R{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">R{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping ({selectedShippingMethod?.name})</span>
                      <span className="font-medium">
                        {shippingTotal === 0 ? 'FREE' : `R${shippingTotal.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>R{totalWithShipping.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Shipping To</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                  <p className="font-medium">{shippingDetails.fullName}</p>
                  <p className="text-gray-600">{shippingDetails.phone}</p>
                  <p className="text-gray-600">{shippingDetails.email}</p>
                  <p className="text-gray-600 mt-2">
                    {shippingDetails.address}<br />
                    {shippingDetails.city}, {shippingDetails.province} {shippingDetails.postalCode}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {checkoutStep === 'cart' && (
              <>
                <div className="flex justify-between mb-4 text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">R{cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setCheckoutStep('shipping')}
                  disabled={!canProceedToShipping}
                  className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Shipping
                </button>
              </>
            )}

            {checkoutStep === 'shipping' && (
              <>
                <div className="flex justify-between mb-4 text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">R{cartTotal.toLocaleString()}</span>
                </div>
                {selectedShippingMethod && (
                  <div className="flex justify-between mb-4 text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shippingTotal === 0 ? 'FREE' : `R${shippingTotal.toLocaleString()}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between mb-6 text-lg font-bold">
                  <span>Total</span>
                  <span>R{totalWithShipping.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setCheckoutStep('payment')}
                  disabled={!canProceedToPayment}
                  className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              </>
            )}

            {checkoutStep === 'payment' && (
              <button
                onClick={handlePaystackPayment}
                disabled={isProcessing || !canProceedToPayment}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Pay • R${totalWithShipping.toLocaleString()}`}
              </button>
            )}

            <p className="text-xs text-center text-gray-400 mt-4">
              Secure checkout powered by Paystack
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
      <path d="M3 6h18"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
