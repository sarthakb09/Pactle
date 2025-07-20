import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ShoppingBag, ArrowRight, Sparkles, UserPlus, Shield, Gift, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGSAP } from '../hooks/useGSAP';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';
import womanShoppingAnimation from '../woman-shopping-online.json';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const { elementRef: containerRef, fadeIn, slideInLeft } = useGSAP<HTMLDivElement>();

  useEffect(() => {
    // Animate the register form on mount
    fadeIn(0.8);
    
    // Animate form elements with stagger
    gsap.fromTo(
      '.form-element',
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3
      }
    );

    // Animate right side elements
    gsap.fromTo(
      '.right-side-element',
      { opacity: 0, x: 50 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.5
      }
    );

    // Floating animation for decorative elements
    gsap.to('.floating-element', {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 0.5
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Add focus animation
    gsap.to(e.target, {
      scale: 1.02,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Remove focus animation
    gsap.to(e.target, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password || !formData.first_name || !formData.last_name) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      
      // Add button animation
      const button = e.currentTarget.querySelector('button[type="submit"]');
      if (button) {
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.out"
        });
      }
      
      await register(formData);
      navigate('/products');
    } catch (error) {
      // Error is handled in the context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex relative overflow-hidden">
      {/* Left Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary dark:from-dark-background-primary dark:via-dark-background-secondary dark:to-dark-background-primary">
        <div className="w-full max-w-lg space-y-8">
          {/* Header Section */}
          <div className="form-element text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-main to-primary-dark rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
              Join Our Community
            </h2>
            <p className="text-lg text-text-muted dark:text-dark-text-muted">
              Create your account and start shopping today
            </p>
          </div>
          
          {/* Form Section */}
          <form className="form-element bg-background-secondary/80 dark:bg-dark-background-secondary/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border-light/50 dark:border-dark-border-light/50 p-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Fields */}
              <div className="form-element grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
                    First Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-text-muted dark:text-dark-text-muted group-focus-within:text-primary-main transition-colors duration-300" />
                    </div>
                    <input
                      name="first_name"
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-border-medium dark:border-dark-border-medium rounded-xl placeholder-text-muted dark:placeholder-dark-text-muted text-text-primary dark:text-dark-text-primary bg-background-secondary dark:bg-dark-background-secondary focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all duration-300 text-base"
                      placeholder="Enter your first name"
                      value={formData.first_name}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
                    Last Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-text-muted dark:text-dark-text-muted group-focus-within:text-primary-main transition-colors duration-300" />
                    </div>
                    <input
                      name="last_name"
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-border-medium dark:border-dark-border-medium rounded-xl placeholder-text-muted dark:placeholder-dark-text-muted text-text-primary dark:text-dark-text-primary bg-background-secondary dark:bg-dark-background-secondary focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all duration-300 text-base"
                      placeholder="Enter your last name"
                      value={formData.last_name}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>
              </div>
              
              {/* Username Input */}
              <div className="form-element">
                <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-text-muted dark:text-dark-text-muted group-focus-within:text-primary-main transition-colors duration-300" />
                  </div>
                  <input
                    name="username"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 border-2 border-border-medium dark:border-dark-border-medium rounded-xl placeholder-text-muted dark:placeholder-dark-text-muted text-text-primary dark:text-dark-text-primary bg-background-secondary dark:bg-dark-background-secondary focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all duration-300 text-base"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="form-element">
                <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-muted dark:text-dark-text-muted group-focus-within:text-primary-main transition-colors duration-300" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 border-2 border-border-medium dark:border-dark-border-medium rounded-xl placeholder-text-muted dark:placeholder-dark-text-muted text-text-primary dark:text-dark-text-primary bg-background-secondary dark:bg-dark-background-secondary focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all duration-300 text-base"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-element">
                <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-muted dark:text-dark-text-muted group-focus-within:text-primary-main transition-colors duration-300" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-12 pr-12 py-4 border-2 border-border-medium dark:border-dark-border-medium rounded-xl placeholder-text-muted dark:placeholder-dark-text-muted text-text-primary dark:text-dark-text-primary bg-background-secondary dark:bg-dark-background-secondary focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all duration-300 text-base"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-text-muted dark:text-dark-text-muted" />
                    ) : (
                      <Eye className="h-5 w-5 text-text-muted dark:text-dark-text-muted" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-sm text-text-muted dark:text-dark-text-muted">
                  Password must be at least 8 characters long
                </p>
              </div>

              {/* Submit Button */}
              <div className="form-element">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-main to-primary-dark text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-primary-dark hover:to-primary-main transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Account
                    </div>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="form-element text-center">
                <p className="text-text-muted dark:text-dark-text-muted">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-primary-main hover:text-primary-dark transition-colors duration-300 hover:scale-105 inline-block"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Lottie Animation */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-primary-main via-primary-dark to-primary-main">
        <div className="w-full h-96 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 overflow-hidden shadow-2xl shadow-white/10 right-side-element">
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
        <div className="absolute top-20 right-20 w-16 h-16 bg-accent-main/30 rounded-xl flex items-center justify-center backdrop-blur-sm floating-element">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm floating-element">
          <Gift className="h-6 w-6 text-white" />
        </div>
        <div className="absolute top-1/2 right-10 w-8 h-8 bg-primary-main/30 rounded-full flex items-center justify-center backdrop-blur-sm floating-element">
          <Shield className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Register; 