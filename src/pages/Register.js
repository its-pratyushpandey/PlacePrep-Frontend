import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
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
            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Get Started</h1>
            <p className="text-slate-600">Create your account and ace your placements</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="register-form">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="register-name-input"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 placeholder-slate-400 transition-colors"
                placeholder="John Doe"
              />
            </div>

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
                data-testid="register-email-input"
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
                minLength="6"
                data-testid="register-password-input"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 placeholder-slate-400 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="register-submit-button"
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-5 h-5" />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:opacity-80 transition-colors font-medium" data-testid="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;