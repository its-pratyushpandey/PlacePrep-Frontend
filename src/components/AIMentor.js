import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'sonner';

const AIMentor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai-mentor/chat', {
        message: input,
        session_id: sessionId
      });

      if (!sessionId) {
        setSessionId(response.data.session_id);
      }

      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get response from AI Mentor');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        data-testid="ai-mentor-toggle"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary-hover rounded-full shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center justify-center transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] glass-card flex flex-col"
            data-testid="ai-mentor-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-slate-900">AI Mentor</h3>
                  <p className="text-xs text-slate-600">Your placement strategist</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                data-testid="ai-mentor-close"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin" data-testid="ai-mentor-messages">
              {messages.length === 0 && (
                <div className="text-center text-slate-600 mt-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary/50" />
                  <p className="text-sm">Ask me anything about your placement preparation!</p>
                </div>
              )}
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  data-testid="ai-mentor-input"
                  className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/50 text-slate-900 placeholder-slate-400 text-sm transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  data-testid="ai-mentor-send"
                  className="p-2 bg-primary hover:bg-primary-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIMentor;