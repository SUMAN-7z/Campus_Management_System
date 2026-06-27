import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Calendar, Clock, Video, FileText, CheckCircle, Award, User, MessageSquare } from 'lucide-react';

const RecruiterInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback Modal details
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInt, setSelectedInt] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('COMPLETED');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user && user.companyId) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      const res = await API.get(`/api/recruiter/interviews/company/${user.companyId}`);
      setInterviews(res.data);
    } catch (err) {
      console.error('Failed to load company interviews', err);
    } finally {
      setLoading(false);
    }
  };

  const openFeedbackChange = (interview) => {
    setSelectedInt(interview);
    setFeedback(interview.feedback || '');
    setStatus(interview.status);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await API.put(`/api/recruiter/interviews/${selectedInt.id}/feedback`, {
        feedback,
        status
      });
      // Update local state list
      setInterviews(prev => prev.map(i => i.id === selectedInt.id ? res.data : i));
      setShowFeedbackModal(false);
      setMessage({ text: 'Interview feedback saved successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to submit feedback.', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'RESCHEDULED': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default: return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'; // SCHEDULED
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-slate-200">Scheduled Interview Rounds</h2>
        <span className="text-xs text-slate-500 font-semibold">{interviews.length} Total Rounds</span>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Interviews Grid */}
      {interviews.length === 0 ? (
        <div className="glass-panel text-center py-20 rounded-2xl text-slate-500 text-sm font-semibold">
          No interviews scheduled yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map((i) => (
            <div key={i.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">{i.studentName}</h3>
                    <p className="text-[10px] text-primary-400 font-semibold mt-0.5">{i.jobTitle}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${getStatusColor(i.status)}`}>
                    {i.status}
                  </span>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Date: {new Date(i.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Time: {i.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Mode: <span className="font-semibold text-slate-200">{i.mode}</span></span>
                  </div>
                </div>

                {i.feedback && (
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-900 text-[11px] text-slate-400">
                    <span className="font-bold text-[9px] text-slate-500 uppercase block mb-1">Feedback Summary</span>
                    "{i.feedback}"
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => openFeedbackChange(i)}
                  className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-primary-400 font-semibold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="h-4 w-4" /> Log Feedback & Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-200 text-base">Record Feedback</h3>
            <p className="text-xs text-slate-400 mt-1">Student: <span className="font-semibold text-slate-300">{selectedInt?.studentName}</span></p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Interview Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                >
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="RESCHEDULED">RESCHEDULED</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Interviewer Remarks</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="4"
                  required
                  placeholder="Summarize candidate performance, technical coding feedback, communication rating, etc..."
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  {updating ? 'Saving...' : 'Save Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecruiterInterviews;