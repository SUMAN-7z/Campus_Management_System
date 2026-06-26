import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Users, Building2, Briefcase, FileText, Award, Percent, 
  TrendingUp, ArrowUpRight, DollarSign 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

const OfficerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/api/officer/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard statistics', err);
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

  // Pre-configured colors for chart slices
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-slate-200">System Analytics & Reports</h2>
        <span className="text-xs text-slate-500 font-semibold">Live Server Metrics</span>
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
        
        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <Users className="h-5 w-5" />
            <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">Total</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Students</p>
          <h3 className="text-xl font-extrabold">{stats?.totalStudents}</h3>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <Building2 className="h-5 w-5" />
            <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full">Partn</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Companies</p>
          <h3 className="text-xl font-extrabold">{stats?.totalCompanies}</h3>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <Briefcase className="h-5 w-5" />
            <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Job Posts</p>
          <h3 className="text-xl font-extrabold">{stats?.totalJobs}</h3>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <FileText className="h-5 w-5" />
            <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">Submi</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Applications</p>
          <h3 className="text-xl font-extrabold">{stats?.totalApplications}</h3>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <Percent className="h-5 w-5" />
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">Rate</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Placement %</p>
          <h3 className="text-xl font-extrabold text-emerald-400">{stats?.placementPercentage}%</h3>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <Award className="h-5 w-5" />
            <span className="text-[10px] font-bold bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full">HR</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Recruiters</p>
          <h3 className="text-xl font-extrabold">{stats?.totalRecruiters}</h3>
        </div>

      </div>

      {/* Package Statistics Panel */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
          <DollarSign className="h-4.5 w-4.5 text-primary-400" /> Salary Package Range (LPA)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Highest Package Offered</span>
            <h4 className="text-xl font-extrabold text-primary-400">{stats?.maxPackage || '0.00'} LPA</h4>
          </div>
          <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Average Package Offered</span>
            <h4 className="text-xl font-extrabold text-emerald-400">{stats?.avgPackage || '0.00'} LPA</h4>
          </div>
          <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Minimum Package Offered</span>
            <h4 className="text-xl font-extrabold text-indigo-400">{stats?.minPackage || '0.00'} LPA</h4>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Branch placements */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200">Placed Count by Branch</h3>
          <div className="h-64">
            {stats?.branchWisePlacement?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs font-semibold">No placed records recorded.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.branchWisePlacement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="branch" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                  <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Company Hiring Distribution */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200">Hiring Shares by Company</h3>
          <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-4">
            {stats?.companyWiseHiring?.length === 0 ? (
              <div className="flex items-center justify-center text-slate-500 text-xs font-semibold">No hired records recorded.</div>
            ) : (
              <>
                <div className="w-full sm:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.companyWiseHiring}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="company"
                      >
                        {stats?.companyWiseHiring.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-1/2 space-y-1.5 flex flex-col justify-center">
                  {stats?.companyWiseHiring.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-[11px] text-slate-300 truncate max-w-[150px]">{item.company}: <span className="font-bold text-slate-100">{item.count}</span></span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chart 3: Monthly Placement Trend */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-slate-200">Monthly Selection Volume Trends</h3>
          <div className="h-64">
            {stats?.monthlyPlacementTrend?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs font-semibold">No placement statistics recorded across months yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyPlacementTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Area type="monotone" dataKey="count" stroke="#6366f1" fillOpacity={0.15} fill="#6366f1" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OfficerDashboard;