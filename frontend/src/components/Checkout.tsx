import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ArrowLeft, CreditCard, MapPin, Truck } from 'lucide-react';
import apiService from '../services/api';
import toast from 'react-hot-toast';

// Load Stripe (you'll need to add your publishable key)
const stripePromise = loadStripe('pk_test_51Rmtf34DjtBRNIhFeqoy03BQKEISP7EOJjaBpA7kHoxKq1DXGZ3g6KdVmS8GUjJfXVCLsmb4XNPl3zPmaEE8D8LC00HLnxlCbu');

// Checkout Form Component
const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe is not initialized');
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error('Please enter your shipping address');
      return;
    }

    setLoading(true);

    try {
      // Create order
      console.log('Creating order...');
      const order = await apiService.createOrder(shippingAddress);
      console.log('Order created:', order);

      if (!order.stripe_payment_intent_id) {
        toast.error('Payment intent not created');
        return;
      }

      if (!order.client_secret) {
        toast.error('Client secret not available');
        return;
      }

      // Get payment intent from order
      console.log('Confirming payment with Stripe...');
      const { error, paymentIntent } = await stripe.confirmCardPayment(order.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        console.error('Stripe payment error:', error);
        toast.error(error.message || 'Payment failed');
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded, confirming with backend...');
        // Confirm payment with backend
        await apiService.confirmPayment(order.id);
        
        // Clear cart
        await clearCart();
        
        toast.success('Payment successful! Order confirmed.');
        navigate('/orders');
      } else {
        console.error('Payment not succeeded:', paymentIntent);
        toast.error('Payment was not completed');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Checkout failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <div>
        <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
          <MapPin className="inline h-4 w-4 mr-1" />
          Shipping Address
        </label>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          className="w-full px-3 py-2 border border-border-medium dark:border-dark-border-medium rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent bg-background-secondary dark:bg-dark-background-secondary text-text-primary dark:text-dark-text-primary placeholder-text-muted dark:placeholder-dark-text-muted"
          rows={3}
          placeholder="Enter your complete shipping address..."
          required
        />
      </div>

      {/* Payment Section */}
      <div>
        <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
          <CreditCard className="inline h-4 w-4 mr-1" />
          Payment Information
        </label>
        <div className="border border-border-medium dark:border-dark-border-medium rounded-lg p-4 bg-background-secondary dark:bg-dark-background-secondary">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-background-primary dark:bg-dark-background-primary rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4">Order Summary</h3>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-text-muted dark:text-dark-text-muted">
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-medium text-text-primary dark:text-dark-text-primary">${item.total_price.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border-light dark:border-dark-border-light pt-2 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted dark:text-dark-text-muted">Subtotal</span>
              <span className="font-medium text-text-primary dark:text-dark-text-primary">${cartTotal?.total_amount.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted dark:text-dark-text-muted">Shipping</span>
              <span className="text-success-main font-medium">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted dark:text-dark-text-muted">Tax</span>
              <span className="font-medium text-text-primary dark:text-dark-text-primary">
                ${((cartTotal?.total_amount || 0) * 0.08).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-border-light dark:border-dark-border-light pt-2 mt-2">
              <span className="text-text-primary dark:text-dark-text-primary">Total</span>
              <span className="text-text-primary dark:text-dark-text-primary">${((cartTotal?.total_amount || 0) * 1.08).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full btn-primary py-3 px-6 flex items-center justify-center gap-2 font-medium"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <Truck className="h-5 w-5" />
            Complete Order
          </>
        )}
      </button>
    </form>
  );
};

// Main Checkout Component
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, cartItems, navigate]);

  if (!isAuthenticated || !cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-primary dark:bg-dark-background-primary py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-text-muted dark:text-dark-text-muted hover:text-text-primary dark:hover:text-dark-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Cart
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-2">Checkout</h1>
          <p className="text-text-muted dark:text-dark-text-muted">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark p-6">
            <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-6">Payment & Shipping</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">{item.product.name}</p>
                      <p className="text-sm text-text-muted dark:text-dark-text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                      ${item.total_price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border-light dark:border-dark-border-light pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-dark-text-muted">Subtotal</span>
                  <span className="font-medium text-text-primary dark:text-dark-text-primary">${cartTotal?.total_amount.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-dark-text-muted">Shipping</span>
                  <span className="text-success-main font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-dark-text-muted">Tax</span>
                  <span className="font-medium text-text-primary dark:text-dark-text-primary">
                    ${((cartTotal?.total_amount || 0) * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-border-light dark:border-dark-border-light pt-2">
                  <span className="text-text-primary dark:text-dark-text-primary">Total</span>
                  <span className="text-text-primary dark:text-dark-text-primary">${((cartTotal?.total_amount || 0) * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 