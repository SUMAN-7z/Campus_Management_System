import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FileText, Calendar, Building2, CheckCircle, Search } from 'lucide-react';

const OfficerApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/api/officer/applications');
      setApps(res.data);
    } catch (err) {
      console.error('Failed to load applications log', err);
    } finally {
      setLoading(false);
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

  const filteredApps = apps.filter(app =>
    app.studentName.toLowerCase().includes(search.toLowerCase()) ||
    app.companyName.toLowerCase().includes(search.toLowerCase()) ||
    app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
    app.status.toLowerCase().includes(search.toLowerCase())
  );

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
        <h2 className="text-xl font-bold text-slate-200">System Applications Log</h2>
        
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search by student, company, job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Table view */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4">Student Candidate</th>
                <th className="px-6 py-4">Branch & CGPA</th>
                <th className="px-6 py-4">Target vacancy details</th>
                <th className="px-6 py-4">CV Reference</th>
                <th className="px-6 py-4">Status & Applied Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 text-xs font-medium">
                    No student applications submitted yet.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="table-row text-slate-300">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200 text-xs">{app.studentName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{app.studentEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>{app.studentBranch}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Score: <span className="font-bold text-slate-300">{app.studentCgpa}</span></div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-semibold text-slate-200">{app.jobTitle}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-slate-600" />
                        {app.companyName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {app.resumePath ? (
                        <a 
                          href={`http://localhost:8080${app.resumePath}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-primary-400 hover:text-primary-300 font-bold"
                        >
                          <FileText className="h-3.5 w-3.5" /> Download PDF
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">No resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                        <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default OfficerApplications;