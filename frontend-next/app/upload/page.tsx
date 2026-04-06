'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (!selected) return;
    setFiles(Array.from(selected));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !description || files.length === 0) {
      setStatus('Provide a job brief and at least one candidate dossier.');
      return;
    }

    setLoading(true);
    setStatus('Creating job and uploading dossiers...');

    try {
      const job = await apiFetch('/api/jobs', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ title, description, skills: [], qualifications: [] }),
      });

      const analysisResults = [];
      for (const file of files) {
        const form = new FormData();
        form.append('cv', file);
        form.append('jobId', job._id);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cvs/upload`, {
          method: 'POST',
          body: form,
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token') || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        analysisResults.push(await response.json());
      }

      const formatted = {
        jobTitle: title,
        totalAnalyzed: analysisResults.length,
        candidates: analysisResults.map((item: any) => ({
          candidateName: item.candidateName || item.fileName,
          score: item.score || 0,
          reasoning: item.analysis?.reasoning || 'No reasoning available',
          matchedKeywords: item.analysis?.matchedKeywords || [],
          status: item.status || 'analyzed',
          email: `${item.candidateName?.toLowerCase().replace(/\s/g, '.')}@candidate.ai`,
        })),
      };

      window.localStorage.setItem('latest_results', JSON.stringify(formatted));
      router.push('/results');
    } catch (error: any) {
      setStatus(error.message || 'Candidate upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Job intake</p>
          <h2>Upload role brief and candidate dossiers</h2>
        </div>
      </div>

      <div className="card">
        <form className="field-group" onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Role title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior AI Recruiter" />
          </div>
          <div className="field-group">
            <label>Job description</label>
            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Paste the job brief here" />
          </div>
          <div className="field-group">
            <label>Candidate dossiers</label>
            <input className="input" type="file" multiple accept=".pdf,.txt" onChange={handleFiles} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Uploading dossiers…' : 'Start AI Shortlist'}
          </button>
          {status && <p style={{ color: '#475569', marginTop: '1rem' }}>{status}</p>}
        </form>
      </div>
    </section>
  );
}
