'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import type { DashboardSummary } from '../../lib/types';
import { ArrowRight, Users, Sparkles, ListChecks } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/jobs/dashboard/summary', { auth: true })
      .then((data) => setSummary(data as DashboardSummary))
      .catch((err) => setError(err.message || 'Unable to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Recruiter Dashboard</p>
          <h2>Live pipeline summary</h2>
        </div>
        <Link href="/upload" className="btn btn-primary">
          New job intake <ArrowRight size={16} />
        </Link>
      </div>

      {loading && <div className="card">Loading dashboard...</div>}
      {error && <div className="card badge badge-danger">{error}</div>}

      {summary ? (
        <div className="grid-3">
          <div className="card">
            <p className="eyebrow">Total Roles</p>
            <h3>{summary.stats.totalJobs}</h3>
            <div className="badge badge-success">
              <Sparkles size={16} /> Active roles
            </div>
          </div>
          <div className="card">
            <p className="eyebrow">Candidates Processed</p>
            <h3>{summary.stats.totalCandidates}</h3>
            <div className="badge badge-success">
              <Users size={16} /> Talent evaluated
            </div>
          </div>
          <div className="card">
            <p className="eyebrow">Shortlist Strength</p>
            <h3>{summary.stats.topMatches}</h3>
            <div className="badge badge-success">
              <ListChecks size={16} /> Strong matches
            </div>
          </div>
        </div>
      ) : null}

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Job intake</p>
            <h2>Recently created roles</h2>
          </div>
        </div>
        {summary?.jobSummaries.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Applicants</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {summary.jobSummaries.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.applicants}</td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/job/${job._id}`} className="btn btn-secondary">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No active roles yet. Add a new job to start candidate scoring.</p>
        )}
      </div>
    </section>
  );
}
