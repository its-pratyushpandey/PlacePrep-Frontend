import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Play, Send, Loader2, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

const MockInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [activeInterview, setActiveInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    role: '',
    difficulty: 'medium'
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await api.get('/mock-interviews');
      setInterviews(response.data);
    } catch (error) {
      toast.error('Failed to load interviews');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/mock-interviews', formData);
      toast.success('Mock interview created!');
      setActiveInterview(response.data);
      setCurrentQuestionIndex(0);
      setShowForm(false);
      fetchInterviews();
    } catch (error) {
      toast.error('Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    setLoading(true);
    try {
      const question = activeInterview.questions[currentQuestionIndex];
      await api.post(`/mock-interviews/${activeInterview.id}/answer`, {
        question_id: question.id,
        answer: answer
      });
      
      toast.success('Answer submitted!');
      setAnswer('');
      
      if (currentQuestionIndex < activeInterview.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        await api.post(`/mock-interviews/${activeInterview.id}/complete`);
        toast.success('Interview completed!');
        setActiveInterview(null);
        setCurrentQuestionIndex(0);
        fetchInterviews();
      }
    } catch (error) {
      toast.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  if (activeInterview) {
    const question = activeInterview.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeInterview.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto" data-testid="mock-interview-session">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-1">
                  {activeInterview.company_name}
                </h2>
                <p className="text-gray-600">{activeInterview.role}</p>
              </div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-sm">
                Question {currentQuestionIndex + 1}/{activeInterview.questions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-600">{question.type}</span>
              <span className={`px-2 py-1 text-xs rounded border font-medium ${
                question.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                question.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {question.difficulty}
              </span>
            </div>
            <div className="glass-panel p-6">
              <p className="text-lg text-gray-900 leading-relaxed">{question.question}</p>
            </div>
          </div>

          {/* Answer Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              data-testid="interview-answer-input"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 min-h-[200px] resize-none"
              placeholder="Type your answer here..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmitAnswer}
              disabled={loading || !answer.trim()}
              data-testid="submit-answer-button"
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : currentQuestionIndex < activeInterview.questions.length - 1 ? (
                <Send className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {loading ? 'Submitting...' : currentQuestionIndex < activeInterview.questions.length - 1 ? 'Submit & Next' : 'Complete Interview'}
            </button>
            <button
              onClick={() => {
                setActiveInterview(null);
                setCurrentQuestionIndex(0);
                setAnswer('');
              }}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-lg transition-colors"
            >
              Exit Interview
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="mock-interview-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Mock Interviews</h1>
          <p className="text-gray-600">Practice with AI-generated interview questions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          data-testid="create-interview-button"
          className="btn-primary flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Interview
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
          data-testid="create-interview-form"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  data-testid="interview-company-input"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="Google"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  data-testid="interview-role-input"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  data-testid="interview-difficulty-select"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={loading} data-testid="submit-interview-button" className="btn-primary disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Interview'}
              </button>
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

      {/* Past Interviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interviews.map((interview, index) => (
          <motion.div
            key={interview.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6"
            data-testid={`past-interview-${index}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white mb-1">
                  {interview.company_name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{interview.role}</p>
              </div>
              {interview.completed && interview.overall_score !== null && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{interview.overall_score.toFixed(0)}%</p>
                  <p className="text-xs text-slate-600 dark:text-slate-500">Score</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 text-xs rounded border font-medium ${interview.completed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {interview.completed ? 'Completed' : 'In Progress'}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-500">
                {interview.questions.length} questions
              </span>
            </div>
          </motion.div>
        ))}
        {interviews.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-600">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No mock interviews yet. Start your first interview!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;