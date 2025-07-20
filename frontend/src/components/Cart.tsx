import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { cartItems, cartTotal, updateCartItem, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(id, newQuantity);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        // Error handled in context
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary dark:bg-dark-background-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-2">Shopping Cart</h1>
          <p className="text-text-muted dark:text-dark-text-muted">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-text-muted dark:text-dark-text-muted mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-2">Your cart is empty</h2>
            <p className="text-text-muted dark:text-dark-text-muted mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary px-6 py-3"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark overflow-hidden">
                <div className="p-6 border-b border-border-light dark:border-dark-border-light">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">Cart Items</h2>
                    <button
                      onClick={handleClearCart}
                      className="text-error-main hover:text-error-dark text-sm font-medium transition-colors duration-300"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-border-light dark:divide-dark-border-light">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-text-muted dark:text-dark-text-muted text-sm mb-2">
                            ${item.product.price} each
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-border-medium dark:border-dark-border-medium rounded-lg bg-background-secondary dark:bg-dark-background-secondary">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-2 hover:bg-background-primary dark:hover:bg-dark-background-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 text-sm font-medium text-text-primary dark:text-dark-text-primary">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.inventory_count}
                                className="p-2 hover:bg-background-primary dark:hover:bg-dark-background-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-error-main hover:text-error-dark p-2 transition-colors duration-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-text-primary dark:text-dark-text-primary">
                            ${item.total_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted dark:text-dark-text-muted">Subtotal</span>
                    <span className="font-medium text-text-primary dark:text-dark-text-primary">
                      ${cartTotal?.total_amount.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted dark:text-dark-text-muted">Shipping</span>
                    <span className="font-medium text-success-main">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted dark:text-dark-text-muted">Tax</span>
                    <span className="font-medium text-text-primary dark:text-dark-text-primary">
                      ${((cartTotal?.total_amount || 0) * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-border-light dark:border-dark-border-light pt-3">
                    <div className="flex justify-between text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                      <span>Total</span>
                      <span>
                        ${((cartTotal?.total_amount || 0) * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary py-3 px-6 flex items-center justify-center gap-2 font-medium"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => navigate('/products')}
                  className="w-full bg-background-primary dark:bg-dark-background-primary text-text-primary dark:text-dark-text-primary py-3 px-6 rounded-lg hover:bg-border-light dark:hover:bg-dark-border-light transition-colors mt-3 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 