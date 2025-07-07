import React from 'react';
import { ExternalLink, Star, Users, Globe } from 'lucide-react';
import { hackathonBoards } from '../data/hackathonBoards';

const FeaturedPlatforms: React.FC = () => {
  const featuredBoards = hackathonBoards.filter(board => board.featured);

  return (
    <section id="featured" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Platforms</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The most popular and trusted hackathon platforms used by millions of developers worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBoards.map((board) => (
            <div
              key={board.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{board.name}</h3>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <Star className="w-4 h-4" />
                    Featured
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">{board.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">{board.region}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{board.userBase}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {board.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <a
                  href={board.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Visit Platform
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlatforms;