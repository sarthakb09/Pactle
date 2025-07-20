import React, { useState, useEffect } from 'react';
import { Order, Review } from '../types';
import apiService from '../services/api';
import { Package, Calendar, DollarSign, Eye, Star, MessageSquare, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGSAP } from '../hooks/useGSAP';
import { gsap } from 'gsap';
import LoadingSpinner from './LoadingSpinner';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { useAuth } from '../contexts/AuthContext';

const OrderHistory: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [expandedProduct, setExpandedProduct] = useState<{ orderId: number; productId: number; productName: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { elementRef: containerRef, fadeIn } = useGSAP<HTMLDivElement>();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchUserReviews();
    }
  }, [isAuthenticated]);

  // Animate orders when they load
  useEffect(() => {
    if (orders.length > 0 && !loading) {
      fadeIn(0.6);
      
      // Animate order cards with stagger effect
      const orderCards = document.querySelectorAll('.order-card');
      gsap.fromTo(
        orderCards,
        { 
          opacity: 0, 
          y: 30, 
          scale: 0.95 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, [orders, loading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const reviews = await apiService.getMyReviews();
      setUserReviews(reviews);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'shipped':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const hasUserReviewed = (productId: number) => {
    return userReviews.some(review => review.product === productId);
  };

  const canReviewProduct = (order: Order, productId: number) => {
    // Can review any product that user hasn't reviewed yet, regardless of order status
    return !hasUserReviewed(productId);
  };

  const handleReviewClick = (orderId: number, productId: number, productName: string) => {
    setExpandedProduct({ orderId, productId, productName });
  };

  const handleSubmitReview = async (reviewData: any) => {
    if (!expandedProduct) return;
    
    try {
      setIsSubmitting(true);
      await apiService.createReview({
        ...reviewData,
        product: expandedProduct.productId
      });
      
      // Refresh reviews
      await fetchUserReviews();
      
      setExpandedProduct(null);
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReview = () => {
    setExpandedProduct(null);
  };

  const isProductExpanded = (orderId: number, productId: number) => {
    return expandedProduct?.orderId === orderId && expandedProduct?.productId === productId;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-dark-background-primary">
        <LoadingSpinner size="lg" color="blue" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background-primary dark:bg-dark-background-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-2">Order History</h1>
          <p className="text-text-muted dark:text-dark-text-muted">View all your past orders and their status</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark p-12 text-center">
            <Package className="h-16 w-16 text-text-muted dark:text-dark-text-muted mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-2">No orders yet</h2>
            <p className="text-text-muted dark:text-dark-text-muted mb-6">Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="order-card bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark hover:shadow-custom dark:hover:shadow-custom-lg-dark transition-all duration-300 overflow-hidden border border-border-light dark:border-dark-border-light">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-light p-2 rounded-lg">
                        <Package className="h-6 w-6 text-primary-main" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-text-muted dark:text-dark-text-muted">
                          {order.items_count || order.order_items?.length || 0} item{(order.items_count || order.order_items?.length || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
                        ${Number(order.total_amount || 0).toFixed(2)}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-text-muted dark:text-dark-text-muted">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(order.created_at)}
                    </div>
                    <div className="flex items-center text-sm text-text-muted dark:text-dark-text-muted">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Payment: {order.stripe_payment_intent_id ? 'Completed' : 'Pending'}
                    </div>
                    <div className="flex items-center text-sm text-text-muted dark:text-dark-text-muted">
                      <Package className="h-4 w-4 mr-2" />
                      {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {order.shipping_address && (
                    <div className="mb-4 p-3 bg-background-primary dark:bg-dark-background-primary rounded-lg">
                      <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">Shipping Address:</p>
                      <p className="text-sm text-text-muted dark:text-dark-text-muted">{order.shipping_address}</p>
                    </div>
                  )}

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="border-t border-border-light dark:border-dark-border-light pt-4">
                      <h4 className="text-sm font-medium text-text-primary dark:text-dark-text-primary mb-3">Order Items:</h4>
                      <div className="space-y-3">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-background-primary dark:bg-dark-background-primary rounded-lg">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                                    {item.product.name}
                                  </p>
                                  <p className="text-sm text-text-muted dark:text-dark-text-muted">
                                    Qty: {item.quantity || 0} × ${Number(item.unit_price || 0).toFixed(2)}
                                  </p>
                                  {/* Show rating if user has reviewed */}
                                  {hasUserReviewed(item.product.id) && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <StarRating
                                        rating={userReviews.find(r => r.product === item.product.id)?.rating || 0}
                                        readonly={true}
                                        size="sm"
                                      />
                                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                        ✓ Reviewed
                                      </span>
                                    </div>
                                  )}
                                  {/* Show review available if not reviewed yet */}
                                  {!hasUserReviewed(item.product.id) && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                        💬 Review available
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                                  ${Number(item.total_price).toFixed(2)}
                                </p>
                                {/* Review button for all products that haven't been reviewed */}
                                {canReviewProduct(order, item.product.id) && (
                                  <button
                                    onClick={() => handleReviewClick(order.id, item.product.id, item.product.name)}
                                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors hover:scale-105"
                                    title="Review this product"
                                  >
                                    <MessageSquare className="h-3 w-3" />
                                    Review
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Inline Review Form */}
                            {isProductExpanded(order.id, item.product.id) && (
                              <div className="ml-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-medium text-blue-900 dark:text-blue-100">
                                    Review {item.product.name}
                                  </h5>
                                  <button
                                    onClick={handleCancelReview}
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <ReviewForm
                                  productId={item.product.id}
                                  onSubmit={handleSubmitReview}
                                  onCancel={handleCancelReview}
                                  isLoading={isSubmitting}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-border-light dark:border-dark-border-light flex justify-end">
                    <button className="flex items-center text-primary-main hover:text-primary-dark text-sm font-medium transition-all duration-300 hover:scale-105">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory; 