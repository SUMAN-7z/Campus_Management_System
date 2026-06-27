import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar, Clock, MapPin, Award, CheckCircle, FileText, PlusCircle, AlertCircle } from 'lucide-react';

const OfficerDrives = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form details
  const [showForm, setShowForm] = useState(false);
  const [newDrive, setNewDrive] = useState({
    driveName: '', companyId: '', date: '', time: '',
    venue: '', eligibilityCriteria: '', registrationDeadline: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Results Modal details
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [resultsDetails, setResultsDetails] = useState('');
  const [publishing, setPublishing] = useState(false);

  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [drivesRes, compRes] = await Promise.all([
        API.get('/api/officer/drives'),
        API.get('/api/officer/companies')
      ]);

      setDrives(drivesRes.data);
      setCompanies(compRes.data.filter(c => c.isApproved));
    } catch (err) {
      console.error('Failed to load drive coordination data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newDrive.driveName || !newDrive.companyId || !newDrive.date || !newDrive.time || !newDrive.venue || !newDrive.registrationDeadline) {
      setMessage({ text: 'Please fill in all required fields', type: 'error' });
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await API.post('/api/officer/drives', {
        ...newDrive,
        companyId: parseInt(newDrive.companyId),
        time: newDrive.time + ':00' // pad seconds
      });
      setDrives(prev => [res.data, ...prev]);
      setShowForm(false);
      setNewDrive({
        driveName: '', companyId: '', date: '', time: '',
        venue: '', eligibilityCriteria: '', registrationDeadline: ''
      });
      setMessage({ text: 'Placement drive scheduled and broadcast notifications sent!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to schedule drive.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const openResultsPublish = (drive) => {
    setSelectedDrive(drive);
    setResultsDetails('');
    setShowResultsModal(true);
  };

  const handleResultsSubmit = async (e) => {
    e.preventDefault();
    if (!resultsDetails) return;

    setPublishing(true);
    setMessage({ text: '', type: '' });
    try {
      await API.post(`/api/officer/drives/${selectedDrive.id}/results`, {
        results: resultsDetails
      });
      
      // Update status locally
      setDrives(prev => 
        prev.map(d => d.id === selectedDrive.id ? { ...d, status: 'COMPLETED' } : d)
      );
      setShowResultsModal(false);
      setMessage({ text: 'Drive results published and system alerts dispatched!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to publish results.', type: 'error' });
    } finally {
      setPublishing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'ONGOING': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'; // UPCOMING
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
        <h2 className="text-xl font-bold text-slate-200">Placement Drive Schedules</h2>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5"
        >
          <PlusCircle className="h-4 w-4" /> {showForm ? 'View Drives List' : 'Schedule New Drive'}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {showForm ? (
        /* Create Drive Form */
        <div className="glass-panel p-6 rounded-2xl max-w-xl mx-auto">
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Drive Name</label>
              <input
                type="text"
                required
                value={newDrive.driveName}
                onChange={(e) => setNewDrive(prev => ({ ...prev, driveName: e.target.value }))}
                placeholder="e.g. Google India Pool Campus Recruitment"
                className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Recruiting Company</label>
              <select
                required
                value={newDrive.companyId}
                onChange={(e) => setNewDrive(prev => ({ ...prev, companyId: e.target.value }))}
                className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
              >
                <option value="">Select Company</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Drive Date</label>
                <input
                  type="date"
                  required
                  value={newDrive.date}
                  onChange={(e) => setNewDrive(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Drive Time</label>
                <input
                  type="time"
                  required
                  value={newDrive.time}
                  onChange={(e) => setNewDrive(prev => ({ ...prev, time: e.target.value }))}
                  className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Venue</label>
                <input
                  type="text"
                  required
                  value={newDrive.venue}
                  onChange={(e) => setNewDrive(prev => ({ ...prev, venue: e.target.value }))}
                  placeholder="e.g. Auditorium / Block C / Online"
                  className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Registration Deadline</label>
                <input
                  type="date"
                  required
                  value={newDrive.registrationDeadline}
                  onChange={(e) => setNewDrive(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                  className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Academic Criteria Details</label>
              <textarea
                value={newDrive.eligibilityCriteria}
                onChange={(e) => setNewDrive(prev => ({ ...prev, eligibilityCriteria: e.target.value }))}
                rows="2"
                placeholder="e.g. MCA, B.Tech CSE (passing year 2026) with CGPA >= 7.5 and no active backlogs."
                className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="pt-3 text-right">
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2.5 px-6 rounded-xl text-xs transition-all shadow-lg shadow-primary-500/20 glow-btn"
              >
                {submitting ? 'Scheduling...' : 'Confirm and Publish Drive'}
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* Drives List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drives.length === 0 ? (
            <div className="glass-panel text-center py-20 rounded-2xl text-slate-500 text-sm font-semibold col-span-2">
              No placement drives scheduled currently.
            </div>
          ) : (
            drives.map((drive) => (
              <div key={drive.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-200 text-sm">{drive.driveName}</h3>
                      <p className="text-[10px] text-primary-400 font-semibold mt-0.5">{drive.companyName}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(drive.status)}`}>
                      {drive.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed italic">Eligibility: {drive.eligibilityCriteria || 'Not specified'}</p>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-850 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span>{new Date(drive.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span>{drive.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span>{drive.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-slate-500" />
                      <span>Register by {new Date(drive.registrationDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {drive.status !== 'COMPLETED' && (
                  <div className="pt-2 border-t border-slate-850">
                    <button
                      onClick={() => openResultsPublish(drive)}
                      className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-primary-400 font-semibold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="h-4 w-4" /> Publish Drive Outcomes
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Publish Results Modal */}
      {showResultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-200 text-base">Publish Hiring Outcomes</h3>
            <p className="text-xs text-slate-400 mt-1">Drive: <span className="font-semibold text-slate-300">{selectedDrive?.driveName}</span></p>

            <form onSubmit={handleResultsSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Hired Students / Result Summary</label>
                <textarea
                  value={resultsDetails}
                  onChange={(e) => setResultsDetails(e.target.value)}
                  rows="5"
                  required
                  placeholder="e.g. Total 5 Students selected: John Doe (MCA), Alice Smith (B.Tech)..."
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResultsModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  {publishing ? 'Publishing...' : 'Publish Outcomes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OfficerDrives;