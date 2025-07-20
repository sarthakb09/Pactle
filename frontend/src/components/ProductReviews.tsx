import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Review, CreateReviewData, UpdateReviewData } from '../types';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import LoadingSpinner from './LoadingSpinner';

interface ProductReviewsProps {
  productId: number;
  averageRating: number;
  reviewCount: number;
  onReviewUpdate?: () => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  averageRating,
  reviewCount,
  onReviewUpdate
}) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const reviewsData = await apiService.getProductReviews(productId);
      setReviews(reviewsData);
      
      // Check if current user has already reviewed this product
      if (isAuthenticated && user) {
        const userReview = reviewsData.find(review => review.user === user.username);
        setUserReview(userReview || null);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData: CreateReviewData) => {
    try {
      setIsSubmitting(true);
      const newReview = await apiService.createReview(reviewData);
      setReviews(prev => [newReview, ...prev]);
      setUserReview(newReview);
      setShowReviewForm(false);
      onReviewUpdate?.();
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReview = async (reviewData: UpdateReviewData) => {
    if (!editingReview) return;
    
    try {
      setIsSubmitting(true);
      const updatedReview = await apiService.updateReview(editingReview.id, reviewData);
      setReviews(prev => prev.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      ));
      setUserReview(updatedReview);
      setEditingReview(null);
      onReviewUpdate?.();
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      await apiService.deleteReview(reviewId);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      setUserReview(null);
      onReviewUpdate?.();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleCancelForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StarRating
              rating={averageRating}
              readonly={true}
              size="lg"
              showValue={true}
            />
            <span className="text-gray-600 dark:text-gray-400">
              ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
        
        {isAuthenticated && !userReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          onSubmit={editingReview ? handleUpdateReview : handleSubmitReview}
          onCancel={handleCancelForm}
          isLoading={isSubmitting}
        />
      )}

      {/* User's Review (if exists) */}
      {userReview && !showReviewForm && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              Your Review
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditReview(userReview)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteReview(userReview.id)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="mb-2">
            <StarRating
              rating={userReview.rating}
              readonly={true}
              size="sm"
            />
          </div>
          {userReview.title && (
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              {userReview.title}
            </h5>
          )}
          {userReview.comment && (
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              {userReview.comment}
            </p>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Customer Reviews
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <ReviewList
            reviews={reviews.filter(review => !userReview || review.id !== userReview.id)}
            onEditReview={isAuthenticated ? handleEditReview : undefined}
            onDeleteReview={isAuthenticated ? handleDeleteReview : undefined}
            currentUserId={user?.username}
          />
        )}
      </div>
    </div>
  );
};

export default ProductReviews; 