import React, { useContext, useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, X } from 'lucide-react';
import { axiosInstance } from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

const Authentication = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); // 'success', 'error', or ''
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [user, setUser] = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Clear previous messages

    if (isSignUp) {
      // Password match validation
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match!' });
        return;
      }

      const sendObj = {
        username: formData.name,
        email: formData.email,
        password: formData.password
      };

      try {
        const response = await axiosInstance.post('/authentication/register', sendObj);
        
        // Show success message if backend returns one
        if (response.data.message) {
          setMessage({ type: 'success', text: response.data.message });
        }
        
        // Navigate after a short delay to show success message
        setTimeout(() => {
          navigate('/verify-account', { state: { email: formData.email, username: formData.name } });
        }, 1000);

      } catch (error) {
        console.error("Registration Error:", error);
        
        // Display error message from backend
        const errorMessage = error.response?.data?.message 
          || error.response?.data?.error 
          || 'Registration failed. Please try again.';
        setMessage({ type: 'error', text: errorMessage });
      }

    } else {
      // Sign In
      const sendObj = {
        email: formData.email,
        password: formData.password
      };

      try {
        const response = await axiosInstance.post('/authentication/login', sendObj);
        
        // Show success message if backend returns one
        if (response.data.message) {
          setMessage({ type: 'success', text: response.data.message });
        }
        
        setUser(response.data.returningObj);
        
        // Navigate after a short delay to show success message
        setTimeout(() => {
          navigate('/startup');
        }, 1000);

      } catch (error) {
        console.error("Login Error:", error);
        
        // Display error message from backend
        const errorMessage = error.response?.data?.message 
          || error.response?.data?.error 
          || 'Login failed. Please check your credentials.';
        setMessage({ type: 'error', text: errorMessage });
      }
    }
  };

  const toggleSignUpMode = () => {
    setIsSignUp(!isSignUp);
    setMessage({ type: '', text: '' }); // Clear messages when switching modes
    setFormData({ name: '', email: '', password: '', confirmPassword: '' }); // Clear form
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center">
            <img src="logo.png" alt="" width={150} />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-text-secondary">
            {isSignUp 
              ? 'Start creating professional invoices today' 
              : 'Sign in to access your account'}
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-surface rounded-2xl shadow-xl border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field - Only for Sign Up */}
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={isSignUp}
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-text-secondary hover:text-text-primary" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-secondary hover:text-text-primary" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field - Only for Sign Up */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required={isSignUp}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password - Only for Sign In */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                {/* <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                    Remember me
                  </label>
                </div> */}
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary-dark">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            {/* Message Display Area */}
            {message.text && (
              <div
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  message.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-green-50 border-green-200 text-green-800'
                }`}
              >
                <div className="flex shrink-0 mt-0.5">
                  {message.type === 'error' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 text-sm font-medium">
                  {message.text}
                </div>
                <button
                  type="button"
                  onClick={() => setMessage({ type: '', text: '' })}
                  className="flex shrink-0"
                >
                  <X className="w-4 h-4 hover:opacity-70" />
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition font-medium text-lg shadow-lg"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Sign In/Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={toggleSignUpMode}
                className="font-medium text-primary hover:text-primary-dark"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Terms and Privacy */}
        <p className="mt-8 text-center text-xs text-text-secondary">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary hover:text-primary-dark">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary hover:text-primary-dark">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Authentication;