import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGSAP } from '../hooks/useGSAP';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';
import womanShoppingAnimation from '../woman-shopping-online.json';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { elementRef: containerRef, fadeIn, slideInLeft } = useGSAP<HTMLDivElement>();

  useEffect(() => {
    // Animate the login form on mount
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
    
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
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
      
      await login(formData);
      navigate('/products');
    } catch (error) {
      // Error is handled in the context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex relative overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-background-primary dark:bg-dark-background-primary">
        <div className="max-w-md w-full space-y-8">
          <div className="form-element">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary dark:text-dark-text-primary">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-text-muted dark:text-dark-text-muted">
              Or{' '}
              <Link
                to="/register"
                className="font-medium text-primary-main hover:text-primary-dark transition-colors duration-300 hover:scale-105 inline-block"
              >
                create a new account
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6 form-element bg-background-secondary dark:bg-dark-background-secondary rounded-lg shadow-sm dark:shadow-custom-dark p-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px form-element">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted dark:text-dark-text-muted" />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-border-medium dark:border-dark-border-medium placeholder-text-muted dark:placeholder-dark-text-muted text-text-primary dark:text-dark-text-primary rounded-t-md focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main focus:z-10 sm:text-sm transition-all duration-300 bg-background-secondary dark:bg-dark-background-secondary"
                  placeholder="Username or Email"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted dark:text-dark-text-muted" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 pr-10 border border-border-medium dark:border-dark-border-medium placeholder-text-muted dark:placeholder-dark-text-muted text-text-primary dark:text-dark-text-primary rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main focus:z-10 sm:text-sm transition-all duration-300 bg-background-secondary dark:bg-dark-background-secondary"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-text-muted dark:text-dark-text-muted" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-muted dark:text-dark-text-muted" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between form-element">
              <div className="text-sm">
                <Link
                  to="/register"
                  className="font-medium text-primary-main hover:text-primary-dark transition-colors duration-300 hover:scale-105 inline-block"
                >
                  Don't have an account?
                </Link>
              </div>
            </div>

            <div className="form-element">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center form-element">
              <Link
                to="/products"
                className="font-medium text-primary-main hover:text-primary-dark text-sm transition-colors duration-300 hover:scale-105 inline-block"
              >
                Continue shopping without account
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Lottie Animation */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-primary-main via-primary-dark to-primary-main">
        <div className="w-full h-96 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 overflow-hidden shadow-2xl shadow-white/10">
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
      </div>
    </div>
  );
};

export default Login; 