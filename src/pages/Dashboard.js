import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, TrendingUp, Briefcase, Code, 
  ArrowRight, Zap, Award, Calendar 
} from 'lucide-react';
import { 
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import api from '../utils/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const metrics = dashboardData?.metrics;
  const readinessData = [
    { name: 'Readiness', value: metrics?.overall_readiness || 0, fill: '#4f46e5' }
  ];

  const topicData = [
    ...metrics?.strong_topics.slice(0, 3).map((topic) => ({ 
      name: topic, 
      value: 80, 
      fill: '#10b981' 
    })) || [],
    ...metrics?.weak_topics.slice(0, 3).map((topic) => ({ 
      name: topic, 
      value: 40, 
      fill: '#6366f1' 
    })) || []
  ];

  return (
    <div className="space-y-8" data-testid="dashboard">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">
          Welcome back, {dashboardData?.user?.name}
        </h1>
        <p className="text-gray-600">Here's your placement preparation overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 hover:shadow-lg transition-shadow"
          data-testid="total-problems-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Code className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Problems Solved</p>
              <p className="text-2xl font-heading font-bold text-gray-900">
                {dashboardData?.total_problems || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 hover:shadow-lg transition-shadow"
          data-testid="applications-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Applications</p>
              <p className="text-2xl font-heading font-bold text-gray-900">
                {dashboardData?.total_applications || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 hover:shadow-lg transition-shadow"
          data-testid="interview-probability-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Interview Probability</p>
              <p className="text-2xl font-heading font-bold text-gray-900">
                {metrics?.interview_probability?.toFixed(0) || 0}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 hover:shadow-lg transition-shadow"
          data-testid="conversion-rate-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-heading font-bold text-gray-900">
                {metrics?.application_conversion_rate?.toFixed(0) || 0}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-5 glass-card p-6"
          data-testid="readiness-score-card"
        >
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">AI Readiness Score</h2>
          <div className="relative">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                barSize={20}
                data={readinessData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-heading font-bold text-gray-900">
                  {metrics?.overall_readiness?.toFixed(0) || 0}%
                </p>
                <p className="text-sm text-gray-600">Ready</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <p className="text-sm text-gray-700">{metrics?.next_action}</p>
          </div>
        </motion.div>

        {/* Topic Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-7 glass-card p-6"
          data-testid="topic-performance-card"
        >
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">Topic Performance</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topicData}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  color: '#111827'
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {topicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Next Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-12 glass-card p-6"
          data-testid="next-action-card"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">Recommended Action</h3>
              <p className="text-gray-600 mb-4">{metrics?.next_action}</p>
              <div className="flex flex-wrap gap-2">
                {metrics?.weak_topics?.slice(0, 3).map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-lg border border-amber-200"
                  >
                    Focus: {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      {dashboardData?.recent_problems?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-6"
          data-testid="recent-activity-card"
        >
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {dashboardData.recent_problems.slice(0, 5).map((problem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{problem.title}</p>
                    <p className="text-xs text-gray-500">{problem.platform}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded border font-medium ${
                  problem.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  problem.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
