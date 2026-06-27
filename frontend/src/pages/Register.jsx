import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Award, User, Briefcase, Mail, Lock, Phone, AlertCircle, Building2 } from 'lucide-react';

const Register = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'ROLE_STUDENT') {
        navigate('/student/dashboard');
      } else if (user.role === 'ROLE_RECRUITER') {
        navigate('/recruiter/dashboard');
      } else if (user.role === 'ROLE_OFFICER' || user.role === 'ROLE_ADMIN') {
        navigate('/officer/dashboard');
      }
    }
  }, [user, navigate]);

  // Form Fields
  const [role, setRole] = useState('STUDENT'); // STUDENT or RECRUITER
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Recruiter fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      setError('Please fill in all standard fields');
      return;
    }

    if (role === 'RECRUITER' && !companyName) {
      setError('Company name is required for recruiter registration');
      return;
    }

    setError('');
    setSubmitting(true);

    const payload = {
      email,
      password,
      role,
      name,
      phone,
      ...(role === 'RECRUITER' && { companyName, industry, website })
    };

    try {
      const loggedUser = await register(payload);
      if (loggedUser.role === 'ROLE_STUDENT') {
        navigate('/student/dashboard');
      } else if (loggedUser.role === 'ROLE_RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-2xl">
          <Award className="h-10 w-10 text-primary-500" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
          Create Placement Account
        </h2>
        <p className="text-sm text-slate-400">
          Sign up to apply for job postings or recruit university students.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl space-y-6">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl flex items-start text-xs">
              <AlertCircle className="h-4.5 w-4.5 mr-2 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Role selector buttons */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950 p-1 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => { setRole('STUDENT'); setError(''); }}
              className={`flex items-center justify-center py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                role === 'STUDENT'
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="h-4 w-4 mr-2" /> STUDENT
            </button>
            <button
              type="button"
              onClick={() => { setRole('RECRUITER'); setError(''); }}
              className={`flex items-center justify-center py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                role === 'RECRUITER'
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="h-4 w-4 mr-2" /> RECRUITER
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="block w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="block w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Phone
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="block w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars (letter & digit)"
                  className="block w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* Recruiter-specific company inputs */}
            {role === 'RECRUITER' && (
              <div className="space-y-4 pt-2 border-t border-slate-800/80">
                <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Company Information</h4>
                
                <div>
                  <label htmlFor="companyName" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Company Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <input
                      id="companyName"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Google India"
                      className="block w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="industry" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Industry
                    </label>
                    <input
                      id="industry"
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Technology"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Website URL
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://google.com"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all shadow-lg shadow-primary-500/20 glow-btn"
              >
                {submitting ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;