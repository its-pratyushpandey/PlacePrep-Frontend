import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, MoreVertical } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    status: 'applied',
    notes: ''
  });

  const statuses = [
    { value: 'applied', label: 'Applied', color: 'bg-blue-500/20 text-blue-400' },
    { value: 'screening', label: 'Screening', color: 'bg-purple-500/20 text-purple-400' },
    { value: 'interview', label: 'Interview', color: 'bg-amber-500/20 text-amber-400' },
    { value: 'offer', label: 'Offer', color: 'bg-green-500/20 text-green-400' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-500/20 text-red-400' }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/applications', formData);
      toast.success('Application added!');
      setFormData({
        company_name: '',
        position: '',
        status: 'applied',
        notes: ''
      });
      setShowForm(false);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to add application');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}`, { status: newStatus });
      toast.success('Status updated');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/applications/${id}`);
      toast.success('Application deleted');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to delete application');
    }
  };

  const getStatusColor = (status) => {
    return statuses.find(s => s.value === status)?.color || 'bg-slate-500/20 text-slate-400';
  };

  const groupedApplications = statuses.map(status => ({
    ...status,
    apps: applications.filter(app => app.status === status.value)
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="applications-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">Application Pipeline</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your job applications</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          data-testid="add-application-button"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Application
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
          data-testid="add-application-form"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  data-testid="application-company-input"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="Google"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Position</label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  data-testid="application-position-input"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" data-testid="submit-application-button" className="btn-primary">Add Application</button>
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

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {groupedApplications.map((column) => (
            <div key={column.value} className="w-80 flex-shrink-0" data-testid={`column-${column.value}`}>
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white">{column.label}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${column.color}`}>
                    {column.apps.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {column.apps.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border border-slate-200 rounded-lg p-4 hover:border-primary/30 shadow-sm transition-colors"
                      data-testid={`application-card-${app.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-1">{app.company_name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{app.position}</p>
                        </div>
                        <div className="relative group">
                          <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                            <MoreVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          </button>
                          <div className="absolute right-0 top-8 hidden group-hover:block bg-white border border-slate-200 rounded-lg shadow-xl z-10 min-w-[150px]">
                            {statuses.filter(s => s.value !== app.status).map((status) => (
                              <button
                                key={status.value}
                                onClick={() => handleStatusChange(app.id, status.value)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 first:rounded-t-lg last:rounded-b-lg transition-colors"
                              >
                                Move to {status.label}
                              </button>
                            ))}
                            <button
                              onClick={() => handleDelete(app.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-b-lg transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      {app.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-500 mt-2">{app.notes}</p>
                      )}
                    </motion.div>
                  ))}
                  {column.apps.length === 0 && (
                    <div className="text-center py-8 text-slate-600 text-sm">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12 text-slate-600 dark:text-slate-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No applications yet. Start applying to companies!</p>
        </div>
      )}
    </div>
  );
};

export default Applications;