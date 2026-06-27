import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Award,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const RecruiterPostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: "",
    description: "",
    packageAmount: "",
    jobType: "Full-time",
    location: "",
    skillsRequired: "",
    minCgpa: "",
    batchYear: new Date().getFullYear(),
    deadline: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !job.title ||
      !job.description ||
      !job.packageAmount ||
      !job.location ||
      !job.skillsRequired ||
      !job.minCgpa ||
      !job.deadline
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await API.post("/api/recruiter/jobs", {
        ...job,
        companyId: user.companyId,
        packageAmount: parseFloat(job.packageAmount),
        minCgpa: parseFloat(job.minCgpa),
        batchYear: parseInt(job.batchYear),
      });
      navigate("/recruiter/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-2">
        Publish Job Posting
      </h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 text-xs">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="glass-panel p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Job Title
            </label>
            <input
              name="title"
              type="text"
              required
              value={job.title}
              onChange={handleChange}
              placeholder="e.g. Associate Software Engineer"
              className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Job Description
            </label>
            <textarea
              name="description"
              rows="4"
              required
              value={job.description}
              onChange={handleChange}
              placeholder="Outline roles, responsibilities, reporting parameters, and company details..."
              className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Job Type
              </label>
              <select
                name="jobType"
                value={job.jobType}
                onChange={handleChange}
                className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Job Location
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <input
                  name="location"
                  type="text"
                  required
                  value={job.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore, Remote"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Package (LPA)
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                  <DollarSign className="h-4.5 w-4.5" />
                </div>
                <input
                  name="packageAmount"
                  type="number"
                  step="0.1"
                  required
                  value={job.packageAmount ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Min CGPA Criteria
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                  <Award className="h-4.5 w-4.5" />
                </div>
                <input
                  name="minCgpa"
                  type="number"
                  step="0.01"
                  min="0.00"
                  max="10.00"
                  required
                  value={job.minCgpa ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. 7.5"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Target Batch Year
              </label>
              <input
                name="batchYear"
                type="number"
                required
                value={job.batchYear ?? ""}
                onChange={handleChange}
                placeholder="2026"
                className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Skills Required
            </label>
            <input
              name="skillsRequired"
              type="text"
              required
              value={job.skillsRequired}
              onChange={handleChange}
              placeholder="Java, SQL, REST APIs (comma separated)"
              className="mt-1.5 block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Application Deadline
            </label>
            <div className="mt-1.5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                <Calendar className="h-4.5 w-4.5" />
              </div>
              <input
                name="deadline"
                type="date"
                required
                value={job.deadline}
                onChange={handleChange}
                className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="pt-3 text-right">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2.5 px-6 rounded-xl text-xs transition-all shadow-lg shadow-primary-500/20 glow-btn"
            >
              {submitting ? "Publishing..." : "Publish Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterPostJob;