'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Search } from 'lucide-react';
import type { AnalysisResult } from '../../lib/types';

export default function ResultsPage() {
  const [results, setResults] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('latest_results');
    if (stored) {
      setResults(JSON.parse(stored) as AnalysisResult);
    }
  }, []);

  if (!results) {
    return (
      <section className="page-section">
        <div className="card">
          <p className="eyebrow">No analysis found</p>
          <h2>Upload a role briefing to generate shortlist insights.</h2>
          <Link href="/upload" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Start a new scan
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">AI Shortlist</p>
          <h2>Candidate reasoning report</h2>
        </div>
      </div>

      <div className="card">
        <p style={{ color: '#475569' }}>Matched role: {results.jobTitle}</p>
        <p style={{ marginTop: '1rem' }}>
          Processed {results.totalAnalyzed} dossiers. Click any shortlisted candidate for reasoning and match details.
        </p>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Score</th>
              <th>Reasoning</th>
              <th>Match quality</th>
            </tr>
          </thead>
          <tbody>
            {results.candidates.map((candidate, index) => (
              <tr key={`${candidate.candidateName}-${index}`}>
                <td>{candidate.candidateName}</td>
                <td>{candidate.score}</td>
                <td>{candidate.reasoning}</td>
                <td>
                  <span className={`badge-pill ${candidate.score >= 90 ? 'badge-success' : candidate.score >= 75 ? 'badge-warning' : 'badge-danger'}`}>
                    {candidate.score >= 90 ? 'Strong Hire' : candidate.score >= 75 ? 'Hire' : 'Review'}
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
            <p className="eyebrow">Reasoning spotlight</p>
            <h2>Why each candidate was matched</h2>
          </div>
          <span className="badge badge-success">
            <Search size={16} /> AI-driven review
          </span>
        </div>
        {results.candidates.map((candidate, index) => (
          <div key={`${candidate.candidateName}-${index}`} className="card" style={{ marginTop: '1rem' }}>
            <h3>{candidate.candidateName}</h3>
            <p style={{ color: '#475569' }}>{candidate.reasoning}</p>
            <div style={{ marginTop: '0.75rem' }}>
              {(candidate.matchedKeywords || []).map((keyword) => (
                <span key={keyword} className="badge badge-success" style={{ marginRight: '0.5rem' }}>
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
