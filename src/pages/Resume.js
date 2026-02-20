import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Loader2, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

const Resume = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/resume/history');
      setAnalyses(response.data);
    } catch (error) {
      toast.error('Failed to load resume analyses');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post(`/resume/analyze?target_role=${encodeURIComponent(targetRole)}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Resume analyzed successfully!');
      setSelectedFile(null);
      fetchAnalyses();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to analyze resume');
    } finally {
      setUploading(false);
    }
  };

  const latestAnalysis = analyses[0];

  return (
    <div className="space-y-6" data-testid="resume-page">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">Resume Analyzer</h1>
        <p className="text-slate-600 dark:text-slate-400">Upload your resume for AI-powered analysis and optimization</p>
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
        data-testid="resume-upload-section"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">Upload Your Resume</h2>
            <p className="text-slate-600 dark:text-slate-400">Get instant ATS score and improvement suggestions</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                data-testid="target-role-input"
                className="w-full px-4 py-2 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-white"
                placeholder="Software Engineer"
              />
            </div>

            <div>
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
                  <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                    {selectedFile ? (
                      <span className="text-primary">{selectedFile.name}</span>
                    ) : (
                      <span><span className="font-semibold">Click to upload</span> or drag and drop</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-500">PDF files only</p>
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  data-testid="resume-file-input"
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              data-testid="upload-resume-button"
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Latest Analysis */}
      {latestAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
          data-testid="latest-analysis"
        >
          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-6">Latest Analysis</h2>

          {/* ATS Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="col-span-1">
              <div className="text-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">ATS Score</p>
                <p className={`text-4xl font-heading font-bold mb-1 ${
                  latestAnalysis.ats_score >= 80 ? 'text-green-400' :
                  latestAnalysis.ats_score >= 60 ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {latestAnalysis.ats_score.toFixed(0)}%
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-500">Out of 100</p>
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              {/* Keyword Gaps */}
              {latestAnalysis.keyword_gaps.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <h3 className="font-medium text-slate-900 dark:text-white">Keyword Gaps</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {latestAnalysis.keyword_gaps.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-lg">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {latestAnalysis.missing_skills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <h3 className="font-medium text-slate-900 dark:text-white">Missing Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {latestAnalysis.missing_skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suggestions */}
          {latestAnalysis.suggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-slate-900 dark:text-white">Improvement Suggestions</h3>
              </div>
              <div className="space-y-3">
                {latestAnalysis.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-bold">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 flex-1">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Analysis History */}
      {analyses.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
          data-testid="analysis-history"
        >
          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-4">Analysis History</h2>
          <div className="space-y-3">
            {analyses.slice(1).map((analysis, index) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{analysis.filename}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-500">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{analysis.ats_score.toFixed(0)}%</p>
                  <p className="text-xs text-slate-600 dark:text-slate-500">ATS Score</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {loading && analyses.length === 0 && (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default Resume;