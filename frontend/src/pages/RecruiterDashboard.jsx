import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Briefcase, Users, Calendar, Award, CheckCircle, ChevronRight, Hourglass } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.companyId) {
      loadRecruiterData();
    }
  }, [user]);

  const loadRecruiterData = async () => {
    try {
      const [compRes, jobsRes, appsRes, intRes] = await Promise.all([
        API.get(`/api/recruiter/company/${user.companyId}`),
        API.get(`/api/recruiter/jobs/company/${user.companyId}`),
        API.get(`/api/recruiter/applicants/company/${user.companyId}`),
        API.get(`/api/recruiter/interviews/company/${user.companyId}`)
      ]);

      setCompany(compRes.data);
      setJobs(jobsRes.data);
      setApplicants(appsRes.data);
      setInterviews(intRes.data.filter(i => i.status === 'SCHEDULED'));
    } catch (err) {
      console.error('Failed to load recruiter dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Calculate status counts
  const pendingCount = applicants.filter(a => a.status === 'APPLIED' || a.status === 'UNDER_REVIEW').length;
  const shortlistedCount = applicants.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length;
  const selectedCount = applicants.filter(a => a.status === 'SELECTED').length;

  return (
    <div className="space-y-6">
      
      {/* Verification Warning Alert */}
      {company && !company.isApproved && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-2xl flex items-start gap-3 shadow-lg">
          <Hourglass className="h-6 w-6 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="font-semibold text-slate-200 text-sm">Company Profile Awaiting Approval</h4>
            <p className="text-xs text-slate-400 mt-1">
              Your company credentials are under review by the Admin Cell. While waiting, you can update your company profile details. Postings will be visible to students once approved.
            </p>
          </div>
        </div>
      )}

      {/* Header Profile card */}
      <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
        <div className="h-16 w-16 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center font-extrabold text-indigo-400 text-2xl">
          {company ? company.companyName[0].toUpperCase() : 'C'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-200">{company?.companyName || 'Register Company'}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{company?.industry || 'Industry'} • {company?.website || 'Website'}</p>
          <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 ${company?.isApproved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            {company?.isApproved ? 'APPROVED RECRUITER' : 'APPROVAL PENDING'}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider font-semibold">Job Postings</p>
            <h3 className="text-2xl font-bold mt-0.5">{jobs.length}</h3>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider font-semibold">New Applicants</p>
            <h3 className="text-2xl font-bold mt-0.5">{pendingCount}</h3>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider font-semibold">Interviews Set</p>
            <h3 className="text-2xl font-bold mt-0.5">{interviews.length}</h3>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider font-semibold">Placed Offers</p>
            <h3 className="text-2xl font-bold mt-0.5">{selectedCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Postings Summary */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="font-bold text-slate-200">Active Job Postings</h3>
            <Link to="/recruiter/post-job" className="text-xs text-primary-400 font-bold hover:text-primary-300">
              + Post New
            </Link>
          </div>
          
          <div className="space-y-3">
            {jobs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No jobs posted yet.
              </div>
            ) : (
              jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between gap-4 hover:border-slate-800 transition-colors">
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">{job.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">{job.location} • {job.packageAmount} LPA • Apply by {new Date(job.deadline).toLocaleDateString()}</p>
                  </div>
                  <Link 
                    to={`/recruiter/applicants?jobId=${job.id}`}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming interviews list */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-200">Pending Interviews</h3>
          <div className="space-y-3">
            {interviews.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No upcoming interviews scheduled.
              </div>
            ) : (
              interviews.slice(0, 3).map((i) => (
                <div key={i.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-xs text-slate-200 truncate max-w-[150px]">{i.studentName}</span>
                    <span className="text-[8px] font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">{i.mode}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{i.jobTitle}</p>
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-900 flex justify-between">
                    <span>{new Date(i.date).toLocaleDateString()}</span>
                    <span>{i.time}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecruiterDashboard;