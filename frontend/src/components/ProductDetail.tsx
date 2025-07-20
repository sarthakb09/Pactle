import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import apiService from '../services/api';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, ArrowLeft, Truck, Shield, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import StarRating from './StarRating';
import ProductReviews from './ProductReviews';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await apiService.getProduct(parseInt(id));
        setProduct(data);
      } catch (error) {
        toast.error('Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product, quantity);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleReviewUpdate = () => {
    // Refresh product data to get updated ratings
    if (id) {
      apiService.getProduct(parseInt(id)).then(setProduct);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-dark-background-primary">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-dark-background-primary">
        <div className="text-center">
          <p className="text-text-muted dark:text-dark-text-muted text-lg">Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 btn-primary px-6 py-2"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary dark:bg-dark-background-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-text-muted dark:text-dark-text-muted hover:text-text-primary dark:hover:text-dark-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Products
        </button>

        <div className="bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {!product.is_in_stock && (
                <div className="absolute top-4 right-4 bg-error-main text-white px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <StarRating
                      rating={product.average_rating}
                      readonly={true}
                      size="md"
                      showValue={true}
                    />
                    <span className="text-text-muted dark:text-dark-text-muted">
                      ({product.review_count} {product.review_count === 1 ? 'review' : product.review_count === 0 ? 'No reviews yet' : 'reviews'})
                    </span>
                  </div>
                  <span className="text-sm text-text-muted dark:text-dark-text-muted">
                    {product.inventory_count} in stock
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary-main">
                  ${product.price}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                  Description
                </h3>
                <p className="text-text-muted dark:text-dark-text-muted leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                  <Truck className="h-4 w-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                  <Shield className="h-4 w-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                  <RefreshCw className="h-4 w-4" />
                  <span>Easy Returns</span>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="border-t border-border-light dark:border-dark-border-light pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-border-medium dark:border-dark-border-medium rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-main focus:border-transparent bg-background-secondary dark:bg-dark-background-secondary text-text-primary dark:text-dark-text-primary"
                  >
                    {Array.from({ length: Math.min(10, product.inventory_count) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.is_in_stock}
                  className="w-full btn-primary py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                {product.is_in_stock && (
                  <p className="text-sm text-text-muted dark:text-dark-text-muted mt-2 text-center">
                    Total: ${(product.price * quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark p-8">
          <ProductReviews
            productId={product.id}
            averageRating={product.average_rating}
            reviewCount={product.review_count}
            onReviewUpdate={handleReviewUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 