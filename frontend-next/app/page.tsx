'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, FileUp, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">BrainHire AI</p>
        <h1>Recruiter AI Dashboard for job-to-candidate matching.</h1>
        <p className="hero-text">
          Build job briefs, upload candidate dossiers, score applicants with Gemini-powered ranking, and visualize shortlist reasoning in one recruiter experience.
        </p>
        <div className="hero-actions">
          <Link href="/dashboard" className="btn btn-primary">
            Open Dashboard <ArrowRight size={18} />
          </Link>
          <Link href="/upload" className="btn btn-secondary">
            New Job & Upload <FileUp size={18} />
          </Link>
        </div>
      </div>
      <div className="hero-panel">
        <div className="panel-card">
          <span className="label">AI Matching</span>
          <h2>Job-to-candidate scoring</h2>
          <p>Automated ranking with reasoning and shortlisted candidate insights.</p>
        </div>
        <div className="panel-card accent">
          <span className="label">Visualize Intelligence</span>
          <h2>Shortlist data</h2>
          <p>See why each candidate is ranked with live AI reasoning output.</p>
        </div>
      </div>
    </section>
  );
}
