import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, User, Menu, X, LogOut, Package, Star } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import { gsap } from 'gsap';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { cartTotal } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { elementRef: headerRef, fadeIn, hoverScale } = useGSAP<HTMLElement>();

  useEffect(() => {
    // Animate header on mount
    fadeIn(0.6);
    
    // Add hover effects to navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      hoverScale(1.05, 0.2);
    });
  }, []);

  // Animate mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.fromTo(
        '.mobile-menu',
        { opacity: 0, height: 0 },
        { opacity: 1, height: 'auto', duration: 0.3, ease: 'power2.out' }
      );
    } else {
      gsap.to('.mobile-menu', { opacity: 0, height: 0, duration: 0.2 });
    }
  }, [isMobileMenuOpen]);

  // Animate user menu dropdown
  useEffect(() => {
    if (isUserMenuOpen) {
      gsap.fromTo(
        '.user-menu',
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
      );
    }
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/products');
    setIsUserMenuOpen(false);
  };

  const handleCartClick = () => {
    // Add a subtle bounce animation to cart icon
    gsap.to('.cart-icon', { 
      scale: 1.2, 
      duration: 0.1, 
      yoyo: true, 
      repeat: 1,
      ease: 'power2.out'
    });
  };

  return (
    <header ref={headerRef} className="bg-background-secondary dark:bg-dark-background-secondary shadow-sm border-b border-border-light dark:border-dark-border-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/products" className="flex items-center nav-item">
            <h1 className="text-2xl font-bold text-primary-main hover:text-primary-dark transition-colors duration-300">
              Pactle
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="nav-item text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-main transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  className="nav-item text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 relative group"
                >
                  Orders
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-main transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/reviews"
                  className="nav-item text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 relative group"
                >
                  Reviews
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-main transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}
          </nav>

          {/* Right side - Cart, Theme Toggle, and User */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Icon */}
            {isAuthenticated && (
              <Link
                to="/cart"
                onClick={handleCartClick}
                className="cart-icon relative p-2 text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 hover:scale-110"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartTotal && cartTotal.item_count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error-main text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartTotal.item_count}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="nav-item flex items-center space-x-2 p-2 text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 hover:scale-105"
                >
                  <User className="h-6 w-6" />
                </button>

                {isUserMenuOpen && (
                  <div className="user-menu absolute right-0 mt-2 w-48 bg-background-secondary dark:bg-dark-background-secondary rounded-md shadow-custom dark:shadow-custom-dark py-1 z-50 border border-border-light dark:border-dark-border-light">
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-background-primary dark:hover:bg-dark-background-primary transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </Link>
                    <Link
                      to="/reviews"
                      className="flex items-center px-4 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-background-primary dark:hover:bg-dark-background-primary transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      My Reviews
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-background-primary dark:hover:bg-dark-background-primary transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="nav-item text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="nav-item bg-primary-main text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all duration-300 hover:scale-105 hover:shadow-custom dark:hover:shadow-custom-dark"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 hover:scale-110"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="mobile-menu md:hidden border-t border-border-light dark:border-dark-border-light py-4 overflow-hidden bg-background-secondary dark:bg-dark-background-secondary">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/products"
                className="text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 hover:translate-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    className="text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 hover:translate-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cart
                  </Link>
                  <Link
                    to="/orders"
                    className="text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 hover:translate-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/reviews"
                    className="text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 hover:translate-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Reviews
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 hover:translate-x-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 hover:translate-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-text-primary dark:text-dark-text-primary hover:text-primary-main transition-all duration-300 hover:translate-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 