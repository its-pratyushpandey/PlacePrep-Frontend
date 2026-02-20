import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Plus, Trash2, Clock } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

const Preparation = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'easy',
    topics: '',
    platform: 'leetcode',
    time_taken: '',
    notes: ''
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await api.get('/problems');
      setProblems(response.data);
    } catch (error) {
      toast.error('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/problems', {
        ...formData,
        topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean),
        time_taken: formData.time_taken ? parseInt(formData.time_taken) : null
      });
      toast.success('Problem added successfully!');
      setFormData({
        title: '',
        difficulty: 'easy',
        topics: '',
        platform: 'leetcode',
        time_taken: '',
        notes: ''
      });
      setShowForm(false);
      fetchProblems();
    } catch (error) {
      toast.error('Failed to add problem');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/problems/${id}`);
      toast.success('Problem deleted');
      fetchProblems();
    } catch (error) {
      toast.error('Failed to delete problem');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="preparation-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">Problem Tracker</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your DSA problem-solving journey</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          data-testid="add-problem-button"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Problem
        </button>
      </div>

      {/* Add Problem Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
          data-testid="add-problem-form"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Problem Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  data-testid="problem-title-input"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="Two Sum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  data-testid="problem-difficulty-select"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Topics (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={formData.topics}
                  onChange={(e) => setFormData({...formData, topics: e.target.value})}
                  data-testid="problem-topics-input"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="Arrays, Hash Table"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Platform</label>
                <input
                  type="text"
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  data-testid="problem-platform-input"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="LeetCode"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" data-testid="submit-problem-button" className="btn-primary">Add Problem</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Problems List */}
      <div className="grid grid-cols-1 gap-4">
        {problems.map((problem, index) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6"
            data-testid={`problem-card-${index}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Code className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">{problem.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    problem.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    problem.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {problem.topics.map((topic, i) => (
                    <span key={i} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                      {topic}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-500">{problem.platform}</p>
              </div>
              <button
                onClick={() => handleDelete(problem.id)}
                data-testid={`delete-problem-${index}`}
                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
        {problems.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No problems tracked yet. Start adding your solved problems!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preparation;