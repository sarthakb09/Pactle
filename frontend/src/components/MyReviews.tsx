import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Review } from '../types';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import LoadingSpinner from './LoadingSpinner';
import { Edit, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const MyReviews: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadMyReviews();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const loadMyReviews = async () => {
    try {
      setIsLoading(true);
      const reviewsData = await apiService.getMyReviews();
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load your reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateReview = async (reviewData: any) => {
    if (!editingReview) return;
    
    try {
      setIsSubmitting(true);
      const updatedReview = await apiService.updateReview(editingReview.id, reviewData);
      setReviews(prev => prev.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      ));
      setEditingReview(null);
      setShowEditForm(false);
      toast.success('Review updated successfully');
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await apiService.deleteReview(reviewId);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowEditForm(true);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setShowEditForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-dark-background-primary">
        <LoadingSpinner />
      </div>
    );
  }

  // Show login message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-dark-background-primary">
        <div className="text-center">
          <p className="text-text-muted dark:text-dark-text-muted text-lg mb-4">
            Please log in to view your reviews
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-dark-background-primary">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary dark:bg-dark-background-primary py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
            My Reviews
          </h1>
          <p className="text-text-muted dark:text-dark-text-muted">
            Manage your product reviews and ratings
          </p>
        </div>

        {showEditForm && editingReview && (
          <div className="mb-8">
            <ReviewForm
              productId={editingReview.product}
              onSubmit={handleUpdateReview}
              onCancel={handleCancelEdit}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark p-8 text-center">
            <Package className="h-16 w-16 text-text-muted dark:text-dark-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
              No reviews yet
            </h3>
            <p className="text-text-muted dark:text-dark-text-muted">
              You haven't written any reviews yet. Start reviewing products you've purchased!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark p-6 border border-border-light dark:border-dark-border-light"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-main/10 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary-main" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">
                        Product #{review.product}
                      </h3>
                      <p className="text-sm text-text-muted dark:text-dark-text-muted">
                        Reviewed on {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Edit review"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <StarRating
                    rating={review.rating}
                    readonly={true}
                    size="md"
                  />
                </div>

                {review.title && (
                  <h4 className="font-medium text-text-primary dark:text-dark-text-primary mb-2">
                    {review.title}
                  </h4>
                )}

                {review.comment && (
                  <p className="text-text-muted dark:text-dark-text-muted leading-relaxed">
                    {review.comment}
                  </p>
                )}

                {review.updated_at !== review.created_at && (
                  <div className="mt-3 text-xs text-text-muted dark:text-dark-text-muted">
                    (Edited on {formatDate(review.updated_at)})
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews; 