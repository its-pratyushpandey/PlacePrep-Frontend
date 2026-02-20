import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
  LayoutDashboard,
  Code,
  Building2,
  Kanban,
  MessageSquare,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Trophy,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AIMentor from './AIMentor';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const logoRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!logoRef.current) return;
    gsap.fromTo(
      logoRef.current,
      { y: -6, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/preparation', icon: Code, label: 'Preparation' },
    { path: '/companies', icon: Building2, label: 'Companies' },
    { path: '/applications', icon: Kanban, label: 'Applications' },
    { path: '/mock-interview', icon: MessageSquare, label: 'Mock Interview' },
    { path: '/resume', icon: FileText, label: 'Resume' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex text-gray-900">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop ? 0 : (sidebarOpen ? 0 : '-100%')
        }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300"
        data-testid="sidebar"
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div ref={logoRef} className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-gray-900 text-lg">PlacePrep</h2>
                <p className="text-xs text-gray-500">AI Intelligence</p>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{user?.name}</p>
                <p className="text-xs text-gray-500">Level {user?.level || 1}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1 text-amber-600">
                <Trophy className="w-3 h-3" />
                <span>{user?.xp || 0} XP</span>
              </div>
              <div className="flex items-center gap-1 text-orange-600">
                <Flame className="w-3 h-3" />
                <span>{user?.streak || 0} Day Streak</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            data-testid="logout-button"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="mobile-menu-button"
            >
              <Menu className="w-6 h-6 text-gray-900" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <span className="font-heading font-bold text-gray-900">PlacePrep</span>
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* AI Mentor */}
      <AIMentor />
    </div>
  );
};

export default Layout;