import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to continue your preparation journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="login-email-input"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 placeholder-slate-400 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="login-password-input"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 placeholder-slate-400 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit-button"
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:opacity-80 transition-colors font-medium" data-testid="register-link">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;