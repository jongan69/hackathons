import React from 'react';
import { Terminal, Github } from 'lucide-react';

interface Props {
  generatedAt: string;
}

/**
 * Deliberately small. Every link here goes somewhere real -- the previous
 * version shipped a dozen placeholder `href="#"` links, which reads as
 * abandoned and is a genuine accessibility problem.
 */
const Footer: React.FC<Props> = ({ generatedAt }) => {
  const stamp = new Date(generatedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  });

  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-signal" aria-hidden="true" />
            <span className="font-bold text-white">Hackathons Board</span>
          </div>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            An open index of hackathons, rebuilt automatically several times a day.
            Listings link straight to the organizer — we never sit in between.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-slate-500 md:items-end">
          <a
            href="https://github.com/jongan69/hackathons"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-signal"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            Source &amp; data on GitHub
          </a>
          <span className="font-mono text-xs">Last ingest: {stamp} UTC</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
