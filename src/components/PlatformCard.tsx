import React from 'react';
import { ExternalLink, Globe, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import { HackathonBoard } from '../types/hackathon';

interface PlatformCardProps {
  board: HackathonBoard;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ board }) => {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Both': return 'bg-green-100 text-green-800';
      case 'Virtual': return 'bg-blue-100 text-blue-800';
      case 'In-Person': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex-1">{board.name}</h3>
          <div className="flex items-center gap-2">
            {board.openSubmissions ? (
              <CheckCircle className="w-5 h-5 text-green-500" title="Open Submissions" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" title="Curated Only" />
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 leading-relaxed text-sm">{board.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 text-sm">{board.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(board.virtualInPerson)}`}>
              {board.virtualInPerson}
            </span>
          </div>
        </div>
        
        {board.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {board.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <a
            href={board.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 text-sm"
          >
            Visit Site
            <ExternalLink className="w-4 h-4" />
          </a>
          <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-600">
            {board.openSubmissions ? 'Open' : 'Curated'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformCard;