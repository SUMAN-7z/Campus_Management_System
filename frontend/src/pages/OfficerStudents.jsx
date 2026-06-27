import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Check, X, FileText, ShieldAlert, CheckCircle2, Search, XCircle } from 'lucide-react';

const OfficerStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get('/api/officer/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load students list', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async (id, currentStatus) => {
    setUpdatingId(id);
    setMessage({ text: '', type: '' });
    try {
      await API.put(`/api/officer/students/${id}/verify?status=${!currentStatus}`);
      
      // Update local state list
      setStudents(prev => 
        prev.map(s => s.id === id ? { ...s, isVerified: !currentStatus } : s)
      );
      setMessage({ 
        text: `Student profile ${!currentStatus ? 'verified' : 'unverified'} successfully!`, 
        type: 'success' 
      });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Verification update failed.', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase()) ||
    (student.branch && student.branch.toLowerCase().includes(search.toLowerCase())) ||
    (student.skills && student.skills.toLowerCase().includes(search.toLowerCase()))
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
        <h2 className="text-xl font-bold text-slate-200">Verify Student Profiles</h2>
        
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search by name, branch, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Table view */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4">Student Details</th>
                <th className="px-6 py-4">Academic Record</th>
                <th className="px-6 py-4">Key Skills</th>
                <th className="px-6 py-4">CV Document</th>
                <th className="px-6 py-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 text-xs font-medium">
                    No registered student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="table-row text-slate-300">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200 text-xs">{s.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{s.email} • {s.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>{s.department} - <span className="font-semibold">{s.branch || 'N/A'}</span></div>
                      <div className="text-[10px] text-slate-500 mt-0.5">CGPA: <span className="font-bold text-slate-300">{s.cgpa || 'N/A'}</span> • Batch: {s.passingYear || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] text-slate-400 max-w-[200px] truncate" title={s.skills}>
                        {s.skills || <span className="italic text-slate-600">No skills set</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {s.resumePath ? (
                        <a 
                          href={`http://localhost:8080${s.resumePath}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-primary-400 hover:text-primary-300 font-bold"
                        >
                          <FileText className="h-3.5 w-3.5" /> Download PDF
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">Pending Upload</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleVerifyToggle(s.id, s.isVerified)}
                        disabled={updatingId === s.id}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          s.isVerified 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                      >
                        {s.isVerified ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Verified (Revoke)
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5 animate-pulse" /> Verify Profile
                          </>
                        )}
                      </button>
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

export default OfficerStudents;