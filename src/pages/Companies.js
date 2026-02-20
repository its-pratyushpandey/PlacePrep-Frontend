import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Trash2, Target, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    target_role: '',
    required_skills: '',
    difficulty_level: 'medium'
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/companies', {
        ...formData,
        required_skills: formData.required_skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      toast.success('Company added successfully!');
      setFormData({
        name: '',
        target_role: '',
        required_skills: '',
        difficulty_level: 'medium'
      });
      setShowForm(false);
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to add company');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/companies/${id}`);
      toast.success('Company removed');
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to delete company');
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
    <div className="space-y-6" data-testid="companies-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Target Companies</h1>
          <p className="text-gray-600">Track companies and your readiness score</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          data-testid="add-company-button"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Company
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
          data-testid="add-company-form"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  data-testid="company-name-input"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900"
                  placeholder="Google"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
                <input
                  type="text"
                  required
                  value={formData.target_role}
                  onChange={(e) => setFormData({...formData, target_role: e.target.value})}
                  data-testid="company-role-input"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={formData.required_skills}
                  onChange={(e) => setFormData({...formData, required_skills: e.target.value})}
                  data-testid="company-skills-input"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900"
                  placeholder="Arrays, Graphs, System Design"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData({...formData, difficulty_level: e.target.value})}
                  data-testid="company-difficulty-select"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" data-testid="submit-company-button" className="btn-primary">Add Company</button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6"
            data-testid={`company-card-${index}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-gray-900">{company.name}</h3>
                  <p className="text-sm text-gray-600">{company.target_role}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(company.id)}
                data-testid={`delete-company-${index}`}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Readiness Score</span>
                <span className="text-sm font-bold text-gray-900">{company.readiness_score.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500"
                  style={{ width: `${company.readiness_score}%` }}
                />
              </div>
            </div>

            {company.skill_gaps.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-gray-700">Skill Gaps</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.skill_gaps.slice(0, 5).map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {company.required_skills.slice(0, 5).map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-200">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
        {companies.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-600">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No companies added yet. Start tracking your target companies!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;