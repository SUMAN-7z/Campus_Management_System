import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { FileText, Calendar, Filter, User, GraduationCap, Award, Phone, CheckCircle, Mail, Clock } from 'lucide-react';

const RecruiterApplicants = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetJobId = searchParams.get('jobId');

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(targetJobId || 'all');
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Modal details
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('UNDER_REVIEW');
  const [remarks, setRemarks] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Interview Modal details
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewMode, setInterviewMode] = useState('ONLINE');
  const [meetingLink, setMeetingLink] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user && user.companyId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        API.get(`/api/recruiter/jobs/company/${user.companyId}`),
        API.get(`/api/recruiter/applicants/company/${user.companyId}`)
      ]);

      setJobs(jobsRes.data);
      setApplicants(appsRes.data);
    } catch (err) {
      console.error('Failed to load applicant list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId === 'all') {
      setFilteredApplicants(applicants);
    } else {
      setFilteredApplicants(applicants.filter(a => a.jobId.toString() === selectedJobId.toString()));
    }
  }, [selectedJobId, applicants]);

  const openStatusChange = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setRemarks(app.remarks || '');
    setShowStatusModal(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setStatusUpdating(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await API.put(`/api/recruiter/applications/${selectedApp.id}/status`, {
        status: newStatus,
        remarks
      });
      // Update local state list
      setApplicants(prev => prev.map(a => a.id === selectedApp.id ? res.data : a));
      setShowStatusModal(false);
      setMessage({ text: 'Application status updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Status update failed.', type: 'error' });
    } finally {
      setStatusUpdating(false);
    }
  };

  const openInterviewScheduling = (app) => {
    setSelectedApp(app);
    setInterviewDate('');
    setInterviewTime('');
    setMeetingLink('');
    setInterviewMode('ONLINE');
    setShowInterviewModal(true);
  };

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewDate || !interviewTime) return;

    setScheduling(true);
    setMessage({ text: '', type: '' });
    try {
      await API.post('/api/recruiter/interviews', {
        applicationId: selectedApp.id,
        date: interviewDate,
        time: interviewTime + ':00', // pad seconds
        mode: interviewMode,
        meetingLink: interviewMode === 'ONLINE' ? meetingLink : ''
      });
      
      // Update status locally (scheduling changes status to INTERVIEW_SCHEDULED)
      setApplicants(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'INTERVIEW_SCHEDULED' } : a));
      setShowInterviewModal(false);
      setMessage({ text: 'Interview scheduled and email alert mock dispatched!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to schedule interview.', type: 'error' });
    } finally {
      setScheduling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SELECTED': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'SHORTLISTED': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'INTERVIEW_SCHEDULED': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'UNDER_REVIEW': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      default: return 'bg-slate-800 text-slate-400 border border-slate-700';
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
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-slate-200">Candidates & Applicants</h2>
        
        {/* Job filtering dropdown */}
        <div className="flex items-center gap-2 max-w-xs w-full">
          <Filter className="h-4 w-4 text-slate-500 shrink-0" />
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="block w-full py-1.5 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Vacancies</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Applicants List */}
      {filteredApplicants.length === 0 ? (
        <div className="glass-panel text-center py-20 rounded-2xl text-slate-500 text-sm font-semibold">
          No candidates have applied for this vacancy yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredApplicants.map((app) => (
            <div key={app.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">{app.studentName}</h3>
                    <p className="text-[10px] text-primary-400 font-semibold mt-0.5">{app.jobTitle}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(app.status)}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Branch: {app.studentBranch}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Current CGPA: <span className="font-semibold text-slate-200">{app.studentCgpa}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Phone: {app.studentPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Email: {app.studentEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {app.remarks && (
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-900 text-[11px] text-slate-400">
                    <span className="font-bold text-[9px] text-slate-500 uppercase block mb-1">Remarks Summary</span>
                    "{app.remarks}"
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/60">
                {app.resumePath ? (
                  <a
                    href={`http://localhost:8080${app.resumePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 text-center bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold py-2 rounded-xl text-xs transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5" /> View CV
                  </a>
                ) : (
                  <span className="text-center py-2 text-slate-500 text-xs italic">No CV Uploaded</span>
                )}

                <button
                  onClick={() => openStatusChange(app)}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-primary-400 font-semibold py-2 rounded-xl text-xs transition-colors"
                >
                  Manage Status
                </button>

                {app.status !== 'SELECTED' && app.status !== 'REJECTED' && (
                  <button
                    onClick={() => openInterviewScheduling(app)}
                    className="bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2 rounded-xl text-xs transition-colors"
                  >
                    Set Interview
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Change Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-200 text-base">Update Candidate Status</h3>
            <p className="text-xs text-slate-400 mt-1">Student: <span className="font-semibold text-slate-300">{selectedApp?.studentName}</span></p>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Hiring Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                >
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="SHORTLISTED">SHORTLISTED</option>
                  <option value="SELECTED">SELECTED (OFFER EXTENDED)</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">HR Remarks / Feedback</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows="3"
                  placeholder="Provide feedback details or remarks..."
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusUpdating}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  {statusUpdating ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-200 text-base">Schedule Interview Round</h3>
            <p className="text-xs text-slate-400 mt-1">Student: <span className="font-semibold text-slate-300">{selectedApp?.studentName}</span></p>

            <form onSubmit={handleInterviewSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Time</label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Interview Mode</label>
                <select
                  value={interviewMode}
                  onChange={(e) => setInterviewMode(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                >
                  <option value="ONLINE">ONLINE (VIDEO CALL)</option>
                  <option value="OFFLINE">OFFLINE (IN PERSON)</option>
                </select>
              </div>

              {interviewMode === 'ONLINE' && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Video Meeting Link</label>
                  <input
                    type="url"
                    required={interviewMode === 'ONLINE'}
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  {scheduling ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecruiterApplicants;