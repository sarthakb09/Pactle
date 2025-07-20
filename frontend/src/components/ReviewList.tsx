import React from 'react';
import StarRating from './StarRating';
import { Review } from '../types';

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (reviewId: number) => void;
  currentUserId?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading = false,
  onEditReview,
  onDeleteReview,
  currentUserId
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
          No reviews yet
        </div>
        <p className="text-gray-400 dark:text-gray-500">
          Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">
                  {review.user_full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {review.user_full_name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(review.created_at)}
                </div>
              </div>
            </div>
            
            {/* Actions for current user's reviews */}
            {currentUserId === review.user && (
              <div className="flex gap-2">
                {onEditReview && (
                  <button
                    onClick={() => onEditReview(review)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
                {onDeleteReview && (
                  <button
                    onClick={() => onDeleteReview(review.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="mb-3">
            <StarRating
              rating={review.rating}
              readonly={true}
              size="sm"
            />
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {review.title}
            </h4>
          )}

          {/* Comment */}
          {review.comment && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {review.comment}
            </p>
          )}

          {/* Updated indicator */}
          {review.updated_at !== review.created_at && (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              (Edited on {formatDate(review.updated_at)})
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 