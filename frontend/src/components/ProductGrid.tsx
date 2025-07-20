import React, { useState, useEffect, useRef } from 'react';
import { Product, PaginatedResponse } from '../types';
import apiService from '../services/api';
import { Search, ShoppingCart, Eye, Star, TrendingUp, Sparkles, ArrowRight, Heart, Zap, Award } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGSAP } from '../hooks/useGSAP';
import { gsap } from 'gsap';
import StarRating from './StarRating';
import Lottie from 'lottie-react';
import womanShoppingAnimation from '../woman-shopping-online.json';

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [topSellers, setTopSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();
  
  const { elementRef: containerRef, fadeIn, staggerIn, scrollTrigger } = useGSAP<HTMLDivElement>();
  const productsGridRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Product> = await apiService.getProducts(
        currentPage,
        searchTerm || undefined,
        ordering
      );
      setProducts(response.results);
      setTotalPages(Math.ceil(response.count / 12));
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSellers = async () => {
    try {
      const response: PaginatedResponse<Product> = await apiService.getProducts(1, undefined, '-average_rating');
      setTopSellers(response.results.slice(0, 4));
    } catch (error) {
      console.error('Failed to load top sellers');
    }
  };

  const fetchNewArrivals = async () => {
    try {
      const response: PaginatedResponse<Product> = await apiService.getProducts(1, undefined, '-created_at');
      setNewArrivals(response.results.slice(0, 4));
    } catch (error) {
      console.error('Failed to load new arrivals');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTopSellers();
    fetchNewArrivals();
  }, [currentPage, searchTerm, ordering]);

  // Animate products when they load
  useEffect(() => {
    if (products.length > 0 && !loading) {
      // Animate the search section
      fadeIn(0.6);
      
      // Animate products with stagger effect
      if (productsGridRef.current) {
        const productCards = productsGridRef.current.querySelectorAll('.product-card');
        gsap.fromTo(
          productCards,
          { 
            opacity: 0, 
            y: 50, 
            scale: 0.9 
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
    }
  }, [products, loading]);

  // Marquee animation
  useEffect(() => {
    if (marqueeRef.current) {
      // Kill any existing animations on this element
      gsap.killTweensOf(marqueeRef.current);
      
      // Disable CSS animation when GSAP is active
      marqueeRef.current.style.animation = 'none';
      
      // Set initial position
      gsap.set(marqueeRef.current, { x: 0 });
      
      // Create the marquee animation
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(marqueeRef.current, {
        x: '-50%',
        duration: 20,
        ease: 'none'
      });
    }
  }, []);

  // Hero animation
  useEffect(() => {
    // Floating animation for the hero Lottie container
    gsap.to('.hero-lottie-container', {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Pulse animation for floating elements
    gsap.to('.floating-element', {
      scale: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      stagger: 0.5
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleAddToCart = async (product: Product) => {
    try {
      // Add bounce animation to the button
      const button = document.querySelector(`[data-product-id="${product.id}"]`);
      if (button) {
        gsap.to(button, { 
          scale: 1.1, 
          duration: 0.1, 
          yoyo: true, 
          repeat: 1,
          ease: "power2.out"
        });
      }
      
      await addToCart(product, 1);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleProductHover = (productId: number, isEntering: boolean) => {
    const card = document.querySelector(`[data-card-id="${productId}"]`);
    if (card) {
      gsap.to(card, {
        y: isEntering ? -5 : 0,
        scale: isEntering ? 1.02 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background-primary dark:bg-dark-background-primary">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-primary-main via-primary-dark to-primary-main text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent-main rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  LET'S EXPLORE
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-5xl lg:text-7xl font-bold">UNIQUE</span>
                  <span className="bg-accent-main text-primary-dark px-4 py-2 rounded-lg text-2xl font-bold">
                    PRODUCTS
                  </span>
                </div>
              </div>
              
              <p className="text-xl lg:text-2xl text-white/80 max-w-lg">
                Live for Influential and Innovative shopping experience!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="#products"
                  className="bg-white text-primary-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
                >
                  SHOP NOW
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-dark transition-all duration-300 hover:scale-105">
                  EXPLORE MORE
                </button>
              </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="relative">
              <div className="w-full h-96 lg:h-[500px] bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 overflow-hidden hero-lottie-container shadow-2xl shadow-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                <Lottie
                  animationData={womanShoppingAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    maxWidth: '400px',
                    maxHeight: '400px',
                    zIndex: 10,
                    position: 'relative'
                  }}
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent-main/30 rounded-xl flex items-center justify-center backdrop-blur-sm floating-element">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm floating-element">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="absolute top-1/2 -right-8 w-8 h-8 bg-primary-main/30 rounded-full flex items-center justify-center backdrop-blur-sm floating-element">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="bg-accent-main py-8 marquee-container">
        <div ref={marqueeRef} className="marquee-content flex items-center space-x-16 whitespace-nowrap">
          <span className="text-2xl font-bold text-primary-dark">PREMIUM QUALITY</span>
          <span className="text-2xl font-bold text-primary-dark">•</span>
          <span className="text-2xl font-bold text-primary-dark">FAST DELIVERY</span>
          <span className="text-2xl font-bold text-primary-dark">•</span>
          <span className="text-2xl font-bold text-primary-dark">SECURE PAYMENT</span>
          <span className="text-2xl font-bold text-primary-dark">•</span>
          <span className="text-2xl font-bold text-primary-dark">24/7 SUPPORT</span>
          <span className="text-2xl font-bold text-primary-dark">•</span>
          <span className="text-2xl font-bold text-primary-dark">FREE RETURNS</span>
          <span className="text-2xl font-bold text-primary-dark">•</span>
          <span className="text-2xl font-bold text-primary-dark">EXCLUSIVE DEALS</span>
          <span className="text-2xl font-bold text-primary-dark">•</span>
          <span className="text-2xl font-bold text-primary-dark">PREMIUM QUALITY</span>
          <span className="text-2xl font-bold text-primary-dark">•</span>
          <span className="text-2xl font-bold text-primary-dark">FAST DELIVERY</span>
          <span className="text-2xl font-bold text-primary-dark">•</span>
          <span className="text-2xl font-bold text-primary-dark">SECURE PAYMENT</span>
          <span className="text-2xl font-bold text-primary-dark">•</span>
          <span className="text-2xl font-bold text-primary-dark">24/7 SUPPORT</span>
          <span className="text-2xl font-bold text-primary-dark">•</span>
          <span className="text-2xl font-bold text-primary-dark">FREE RETURNS</span>
          <span className="text-2xl font-bold text-primary-dark">•</span>
          <span className="text-2xl font-bold text-primary-dark">EXCLUSIVE DEALS</span>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-background-secondary dark:bg-dark-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-main/20 to-accent-main/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-primary-main" />
              </div>
              <h2 className="text-5xl font-bold text-text-primary dark:text-dark-text-primary">
                NEW ARRIVALS
              </h2>
              <div className="w-12 h-12 bg-gradient-to-br from-accent-main/30 to-primary-light/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-accent-main" />
              </div>
            </div>
            <p className="text-xl text-text-muted dark:text-dark-text-muted max-w-3xl mx-auto leading-relaxed">
              Discover our latest products that just arrived. Be the first to explore these amazing new additions to our collection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <div
                key={product.id}
                data-card-id={product.id}
                className="product-card group relative bg-gradient-to-br from-white via-white to-accent-main/20 dark:from-dark-background-secondary dark:via-dark-background-secondary dark:to-primary-main/10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-white/50 dark:border-dark-border-light/50 backdrop-blur-sm"
                onMouseEnter={() => handleProductHover(product.id, true)}
                onMouseLeave={() => handleProductHover(product.id, false)}
              >
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary-main/5 rounded-2xl pointer-events-none"></div>
                
                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-primary-main/20 to-accent-main/30 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <Heart className="h-4 w-4 text-primary-main" />
                </div>
                
                <div className="relative overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                  
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-gradient-to-r from-accent-main to-primary-light text-primary-dark px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transform -rotate-2 group-hover:rotate-0 transition-all duration-300">
                      NEW
                    </div>
                  </div>
                  
                  {!product.is_in_stock && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-error-main to-error-dark text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      Out of Stock
                    </div>
                  )}
                  
                  {/* Price tag with glassmorphism */}
                  <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-dark-background-secondary/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-white/50 dark:border-dark-border-light/50">
                    <span className="text-lg font-bold text-primary-main">${product.price}</span>
                  </div>
                </div>
                
                <div className="p-6 relative">
                  {/* Product title with gradient text */}
                  <h3 className="font-bold text-xl text-text-primary dark:text-dark-text-primary mb-3 group-hover:text-primary-main transition-all duration-300 leading-tight">
                    {product.name}
                  </h3>
                  
                  {/* Rating with enhanced styling */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      <StarRating
                        rating={product.average_rating}
                        readonly={true}
                        size="sm"
                      />
                    </div>
                    <span className="text-sm text-text-muted dark:text-dark-text-muted font-medium">
                      {product.review_count > 0 ? `(${product.review_count})` : 'No reviews yet'}
                    </span>
                  </div>
                  
                  {/* Quick description */}
                  <p className="text-text-muted dark:text-dark-text-muted text-sm mb-6 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  
                  {/* Action buttons with enhanced styling */}
                  <div className="flex gap-3">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-1 bg-gradient-to-r from-background-primary to-accent-main/50 dark:from-dark-background-primary dark:to-primary-main/20 text-text-primary dark:text-dark-text-primary px-4 py-3 rounded-xl hover:from-primary-main hover:to-primary-dark hover:text-white transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 font-semibold shadow-lg border border-border-light/50 dark:border-dark-border-light/50"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                    <button
                      data-product-id={product.id}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.is_in_stock}
                      className="flex-1 bg-gradient-to-r from-primary-main to-primary-dark text-white px-4 py-3 rounded-xl hover:from-primary-dark hover:to-primary-main transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-main via-accent-main to-primary-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Sellers Section */}
      <section className="py-16 bg-background-primary dark:bg-dark-background-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-main/20 to-accent-main/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-primary-main" />
              </div>
              <h2 className="text-5xl font-bold text-text-primary dark:text-dark-text-primary">
                TOP SELLERS
              </h2>
              <div className="w-12 h-12 bg-gradient-to-br from-accent-main/30 to-primary-light/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Award className="h-6 w-6 text-accent-main" />
              </div>
            </div>
            <p className="text-xl text-text-muted dark:text-dark-text-muted max-w-3xl mx-auto leading-relaxed">
              Our most popular product loved by thousands of customers. This is the item that everyone is talking about.
            </p>
          </div>

          {/* Featured Top Seller Product */}
          {topSellers.length > 0 && (
            <div className="bg-gradient-to-br from-white via-white to-accent-main/20 dark:from-dark-background-secondary dark:via-dark-background-secondary dark:to-primary-main/10 rounded-3xl shadow-2xl overflow-hidden border border-white/50 dark:border-dark-border-light/50 backdrop-blur-sm relative">
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary-main/5 rounded-3xl pointer-events-none"></div>
              
              {/* Floating decorative elements */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-primary-main/20 to-accent-main/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Award className="h-6 w-6 text-primary-main" />
              </div>
              <div className="absolute bottom-6 left-6 w-10 h-10 bg-gradient-to-br from-accent-main/30 to-primary-light/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-accent-main" />
              </div>
              
              <div className="grid lg:grid-cols-2 gap-0 relative">
                {/* Left Side - Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={topSellers[0].image_url}
                    alt={topSellers[0].name}
                    className="w-full h-full min-h-[500px] object-cover transition-all duration-700 hover:scale-110"
                  />
                  
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  
                  {/* Enhanced badges */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-gradient-to-r from-primary-main to-primary-dark text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl transform -rotate-2 hover:rotate-0 transition-all duration-300">
                      #1 TOP SELLER
                    </div>
                  </div>
                  
                  {!topSellers[0].is_in_stock && (
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-error-main to-error-dark text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl animate-pulse">
                      Out of Stock
                    </div>
                  )}
                  
                  {/* Enhanced price tag */}
                  <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-dark-background-secondary/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-xl border border-white/50 dark:border-dark-border-light/50">
                    <span className="text-2xl font-bold text-primary-main">${topSellers[0].price}</span>
                  </div>
                  
                  {/* Floating rating badge */}
                  <div className="absolute bottom-6 right-6 bg-gradient-to-r from-accent-main to-primary-light text-primary-dark px-3 py-1.5 rounded-full shadow-lg">
                    <div className="flex items-center gap-1">
                      <StarRating
                        rating={topSellers[0].average_rating}
                        readonly={true}
                        size="sm"
                      />
                      <span className="text-xs font-bold">{topSellers[0].average_rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Product Information */}
                <div className="p-8 lg:p-12 flex flex-col justify-center relative">
                  <div className="space-y-8">
                    {/* Product Title with enhanced styling */}
                    <div>
                      <h3 className="text-4xl lg:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4 leading-tight">
                        {topSellers[0].name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <StarRating
                            rating={topSellers[0].average_rating}
                            readonly={true}
                            size="lg"
                          />
                        </div>
                        <span className="text-xl text-text-muted dark:text-dark-text-muted font-medium">
                          {topSellers[0].review_count > 0 ? `(${topSellers[0].review_count} reviews)` : '(No reviews yet)'}
                        </span>
                      </div>
                    </div>

                    {/* Product Description with enhanced styling */}
                    <div>
                      <p className="text-xl text-text-muted dark:text-dark-text-muted leading-relaxed">
                        {topSellers[0].description}
                      </p>
                    </div>

                    {/* Price and Stock Status with enhanced styling */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-background-primary/50 to-accent-main/30 dark:from-dark-background-primary/50 dark:to-primary-main/20 p-6 rounded-2xl border border-border-light/50 dark:border-dark-border-light/50">
                      <div className="space-y-2">
                        <span className="text-5xl font-bold text-primary-main">
                          ${topSellers[0].price}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-success-main rounded-full animate-pulse"></div>
                          <span className="text-success-main font-bold text-lg">
                            {topSellers[0].is_in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Quick Stats with enhanced styling */}
                      <div className="text-right space-y-2">
                        <div className="text-sm text-text-muted dark:text-dark-text-muted bg-white/50 dark:bg-dark-background-secondary/50 px-3 py-1 rounded-lg">
                          <span className="font-bold">Category:</span> Electronics
                        </div>
                        <div className="text-sm text-text-muted dark:text-dark-text-muted bg-white/50 dark:bg-dark-background-secondary/50 px-3 py-1 rounded-lg">
                          <span className="font-bold">SKU:</span> TS-{topSellers[0].id}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons with enhanced styling */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Link
                        to={`/product/${topSellers[0].id}`}
                        className="flex-1 bg-gradient-to-r from-background-primary to-accent-main/50 dark:from-dark-background-primary dark:to-primary-main/20 text-text-primary dark:text-dark-text-primary px-8 py-4 rounded-2xl hover:from-primary-main hover:to-primary-dark hover:text-white transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 font-bold text-xl border-2 border-border-medium/50 dark:border-dark-border-medium/50 shadow-xl hover:shadow-2xl"
                      >
                        <Eye className="h-6 w-6" />
                        View Details
                      </Link>
                      <button
                        data-product-id={topSellers[0].id}
                        onClick={() => handleAddToCart(topSellers[0])}
                        disabled={!topSellers[0].is_in_stock}
                        className="flex-1 bg-gradient-to-r from-primary-main to-primary-dark text-white px-8 py-4 rounded-2xl hover:from-primary-dark hover:to-primary-main transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-xl hover:shadow-2xl"
                      >
                        <ShoppingCart className="h-6 w-6" />
                        Add to Cart
                      </button>
                    </div>

                    {/* Additional Features with enhanced styling */}
                    <div className="grid grid-cols-2 gap-4 pt-6">
                      <div className="flex items-center gap-4 text-sm text-text-muted dark:text-dark-text-muted bg-white/50 dark:bg-dark-background-secondary/50 p-4 rounded-xl border border-border-light/50 dark:border-dark-border-light/50">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-main/20 to-accent-main/30 rounded-xl flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-primary-main" />
                        </div>
                        <span className="font-semibold">Best Seller</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-muted dark:text-dark-text-muted bg-white/50 dark:bg-dark-background-secondary/50 p-4 rounded-xl border border-border-light/50 dark:border-dark-border-light/50">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-main/30 to-primary-light/20 rounded-xl flex items-center justify-center">
                          <Zap className="h-5 w-5 text-accent-main" />
                        </div>
                        <span className="font-semibold">Fast Shipping</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-muted dark:text-dark-text-muted bg-white/50 dark:bg-dark-background-secondary/50 p-4 rounded-xl border border-border-light/50 dark:border-dark-border-light/50">
                        <div className="w-10 h-10 bg-gradient-to-br from-success-main/20 to-success-light/30 rounded-xl flex items-center justify-center">
                          <Award className="h-5 w-5 text-success-main" />
                        </div>
                        <span className="font-semibold">Premium Quality</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-muted dark:text-dark-text-muted bg-white/50 dark:bg-dark-background-secondary/50 p-4 rounded-xl border border-border-light/50 dark:border-dark-border-light/50">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-main/20 to-accent-main/30 rounded-xl flex items-center justify-center">
                          <Heart className="h-5 w-5 text-primary-main" />
                        </div>
                        <span className="font-semibold">Customer Favorite</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-main via-accent-main to-primary-light"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* All Products Section */}
      <section id="products" className="py-16 bg-background-secondary dark:bg-dark-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-main/20 to-accent-main/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ShoppingCart className="h-6 w-6 text-primary-main" />
              </div>
              <h2 className="text-5xl font-bold text-text-primary dark:text-dark-text-primary">
                ALL PRODUCTS
              </h2>
              <div className="w-12 h-12 bg-gradient-to-br from-accent-main/30 to-primary-light/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Eye className="h-6 w-6 text-accent-main" />
              </div>
            </div>
            <p className="text-xl text-text-muted dark:text-dark-text-muted max-w-3xl mx-auto leading-relaxed">
              Explore our complete collection of amazing products. Find exactly what you're looking for.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-gradient-to-br from-white via-white to-accent-main/20 dark:from-dark-background-secondary dark:via-dark-background-secondary dark:to-primary-main/10 rounded-2xl shadow-xl p-8 mb-12 border border-white/50 dark:border-dark-border-light/50 backdrop-blur-sm relative">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary-main/5 rounded-2xl pointer-events-none"></div>
            
            <div className="relative">
              <h3 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-6 text-center">
                Find Your Perfect Product
              </h3>
              
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-dark-text-muted h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-border-medium/50 dark:border-dark-border-medium/50 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all duration-300 bg-white/80 dark:bg-dark-background-secondary/80 text-text-primary dark:text-dark-text-primary placeholder-text-muted dark:placeholder-dark-text-muted backdrop-blur-sm shadow-lg"
                  />
                </div>
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="border-2 border-border-medium/50 dark:border-dark-border-medium/50 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all duration-300 bg-white/80 dark:bg-dark-background-secondary/80 text-text-primary dark:text-dark-text-primary backdrop-blur-sm shadow-lg font-medium"
                >
                  <option value="name">Name A-Z</option>
                  <option value="-name">Name Z-A</option>
                  <option value="price">Price Low to High</option>
                  <option value="-price">Price High to Low</option>
                  <option value="created_at">Newest First</option>
                  <option value="-created_at">Oldest First</option>
                </select>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary-main to-primary-dark text-white px-8 py-4 rounded-xl hover:from-primary-dark hover:to-primary-main transition-all duration-300 hover:scale-105 font-bold text-lg shadow-xl hover:shadow-2xl"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Products Grid */}
        <div ref={productsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              data-card-id={product.id}
              className="product-card group relative bg-gradient-to-br from-white via-white to-accent-main/10 dark:from-dark-background-secondary dark:via-dark-background-secondary dark:to-primary-main/5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-white/50 dark:border-dark-border-light/50 backdrop-blur-sm"
              onMouseEnter={() => handleProductHover(product.id, true)}
              onMouseLeave={() => handleProductHover(product.id, false)}
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary-main/5 rounded-2xl pointer-events-none"></div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-primary-main/20 to-accent-main/30 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <Heart className="h-4 w-4 text-primary-main" />
              </div>
              
              <div className="relative overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                
                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {!product.is_in_stock && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-error-main to-error-dark text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    Out of Stock
                  </div>
                )}
                
                {/* Price tag with glassmorphism */}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-dark-background-secondary/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-white/50 dark:border-dark-border-light/50">
                  <span className="text-lg font-bold text-primary-main">${product.price}</span>
                </div>
              </div>
              
              <div className="p-6 relative">
                {/* Product title with gradient text */}
                <h3 className="font-bold text-xl text-text-primary dark:text-dark-text-primary mb-3 group-hover:text-primary-main transition-all duration-300 leading-tight">
                  {product.name}
                </h3>
                
                {/* Rating with enhanced styling */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <StarRating
                      rating={product.average_rating}
                      readonly={true}
                      size="sm"
                    />
                  </div>
                  <span className="text-sm text-text-muted dark:text-dark-text-muted font-medium">
                    {product.review_count > 0 ? `(${product.review_count})` : 'No reviews yet'}
                  </span>
                </div>
                
                {/* Quick description */}
                <p className="text-text-muted dark:text-dark-text-muted text-sm mb-6 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>
                
                {/* Action buttons with enhanced styling */}
                <div className="flex gap-3">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 bg-gradient-to-r from-background-primary to-accent-main/50 dark:from-dark-background-primary dark:to-primary-main/20 text-text-primary dark:text-dark-text-primary px-4 py-3 rounded-xl hover:from-primary-main hover:to-primary-dark hover:text-white transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 font-semibold shadow-lg border border-border-light/50 dark:border-dark-border-light/50"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                  <button
                    data-product-id={product.id}
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.is_in_stock}
                    className="flex-1 bg-gradient-to-r from-primary-main to-primary-dark text-white px-4 py-3 rounded-xl hover:from-primary-dark hover:to-primary-main transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add
                  </button>
                </div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-main via-accent-main to-primary-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-8 py-4 border-2 border-border-medium/50 dark:border-dark-border-medium/50 rounded-xl hover:bg-gradient-to-r hover:from-primary-main hover:to-primary-dark hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 dark:bg-dark-background-secondary/80 text-text-primary dark:text-dark-text-primary font-bold shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                Previous
              </button>
              <div className="px-8 py-4 text-text-primary dark:text-dark-text-primary bg-gradient-to-r from-primary-main/10 to-accent-main/20 dark:from-primary-main/20 dark:to-accent-main/10 border-2 border-primary-main/30 dark:border-primary-main/30 rounded-xl font-bold shadow-lg backdrop-blur-sm">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-8 py-4 border-2 border-border-medium/50 dark:border-dark-border-medium/50 rounded-xl hover:bg-gradient-to-r hover:from-primary-main hover:to-primary-dark hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 dark:bg-dark-background-secondary/80 text-text-primary dark:text-dark-text-primary font-bold shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      </section>
    </div>
  );
};

export default ProductGrid; 