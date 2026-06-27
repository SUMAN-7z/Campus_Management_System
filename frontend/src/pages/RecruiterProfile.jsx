import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Building2, Mail, Phone, Globe, MapPin, FileText, CheckCircle } from 'lucide-react';

const RecruiterProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    companyName: '', industry: '', hrName: '', email: '',
    phone: '', website: '', address: '', description: '', isApproved: false
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user && user.companyId) {
      fetchCompanyProfile();
    }
  }, [user]);

  const fetchCompanyProfile = async () => {
    try {
      const res = await API.get(`/api/recruiter/company/${user.companyId}`);
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to load company profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await API.put(`/api/recruiter/company/${user.companyId}`, profile);
      setProfile(res.data);
      setMessage({ text: 'Company profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Profile update failed.', type: 'error' });
    } finally {
      setUpdating(false);
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
    <div className="space-y-6 max-w-3xl mx-auto">
      
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-slate-200">Company Information</h2>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${profile.isApproved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
          {profile.isApproved ? 'Approved Recruiter' : 'Awaiting Approval'}
        </span>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="glass-panel p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Company Name</label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                  <Building2 className="h-4.5 w-4.5" />
                </div>
                <input
                  name="companyName"
                  type="text"
                  required
                  value={profile.companyName}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Industry</label>
              <input
                name="industry"
                type="text"
                required
                value={profile.industry}
                onChange={handleChange}
                placeholder="e.g. Technology, Finance"
                className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">HR Contact Person</label>
              <input
                name="hrName"
                type="text"
                required
                value={profile.hrName}
                onChange={handleChange}
                className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">HR Direct Email</label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  name="email"
                  type="email"
                  disabled
                  value={profile.email}
                  className="block w-full pl-9 pr-3 py-2 bg-slate-950/50 border border-slate-800/80 rounded-lg text-xs text-slate-500 cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">HR Contact Phone</label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <input
                  name="phone"
                  type="text"
                  required
                  value={profile.phone}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Company Website URL</label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <input
                  name="website"
                  type="url"
                  required
                  value={profile.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Company Description</label>
            <textarea
              name="description"
              rows="3"
              required
              value={profile.description}
              onChange={handleChange}
              placeholder="Provide a summary of company services, work environment, and domain expertise..."
              className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Office Address</label>
            <textarea
              name="address"
              rows="2"
              required
              value={profile.address}
              onChange={handleChange}
              className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="pt-3 text-right">
            <button
              type="submit"
              disabled={updating}
              className="bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2 px-6 rounded-xl text-xs transition-all shadow-lg shadow-primary-500/20 glow-btn"
            >
              {updating ? 'Saving...' : 'Update Corporate Profile'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default RecruiterProfile;