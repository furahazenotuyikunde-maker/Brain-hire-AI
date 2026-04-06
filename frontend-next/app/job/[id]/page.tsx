'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import type { JobDetail, CVAnalysis } from '../../../lib/types';
import { ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [cvs, setCvs] = useState<CVAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const jobId = Array.isArray(id) ? id[0] : id;
    Promise.all([
      apiFetch(`/api/jobs/${jobId}`),
      apiFetch(`/api/cvs/job/${jobId}`, { auth: true }),
    ])
      .then(([jobData, cvsData]) => {
        setJob(jobData as JobDetail);
        setCvs(cvsData as CVAnalysis[]);
      })
      .catch((err) => {
        setError(err.message || 'Could not load job details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="card">Loading job details…</div>;
  }

  if (error) {
    return <div className="card badge badge-danger">{error}</div>;
  }

  return (
    <section className="page-section">
      <Link href="/dashboard" className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} /> Back to dashboard
      </Link>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Role details</p>
          <h2>{job?.title}</h2>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <p className="eyebrow">Job brief</p>
          <p style={{ color: '#475569', whiteSpace: 'pre-wrap' }}>{job?.description}</p>
        </div>
        <div className="card">
          <p className="eyebrow">Candidate shortlist</p>
          <p style={{ marginBottom: '1rem', color: '#475569' }}>
            Sorted by Gemini scoring and reasoning.
          </p>
          <span className="badge badge-success">
            <Zap size={16} /> {cvs.length} candidates
          </span>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Score</th>
              <th>Reasoning</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cvs.map((cv) => (
              <tr key={cv._id}>
                <td>{cv.candidateName || 'Anonymous'}</td>
                <td>{cv.score}</td>
                <td>{cv.analysis?.reasoning || 'No reasoning available'}</td>
                <td>
                  <span
                    className={`badge-pill ${cv.score && cv.score >= 75 ? 'badge-success' : cv.score && cv.score >= 50 ? 'badge-warning' : 'badge-danger'}`}
                  >
                    {cv.status || 'analyzed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Shortlist reasoning</p>
            <h2>Why candidates were matched</h2>
          </div>
          <Link href="/results" className="btn btn-secondary">
            Review report
          </Link>
        </div>
        {cvs.slice(0, 3).map((cv) => (
          <div key={cv._id} className="card" style={{ marginBottom: '1rem' }}>
            <h3>{cv.candidateName || 'Candidate'}</h3>
            <p style={{ color: '#475569' }}>{cv.analysis?.reasoning}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
              {(cv.analysis?.matchedKeywords || []).slice(0, 6).map((keyword) => (
                <span key={keyword} className="badge badge-success">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
