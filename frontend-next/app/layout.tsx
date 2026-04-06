import './globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'BrainHire AI Recruiter Dashboard',
  description: 'Next.js recruiter portal for AI-powered candidate matching and shortlisting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Navbar />
          <main className="page-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
