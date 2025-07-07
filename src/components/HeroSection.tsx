import React from 'react';
import { Code, Zap, Globe, Users } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 flex justify-center space-x-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Code className="w-8 h-8 text-blue-300" />
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Zap className="w-8 h-8 text-purple-300" />
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Globe className="w-8 h-8 text-indigo-300" />
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Users className="w-8 h-8 text-pink-300" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Epic</span>
            <br />
            Hackathons
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your ultimate directory of hackathon platforms worldwide. From AI competitions to blockchain bounties, 
            find the perfect platform to showcase your skills and win amazing prizes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore Platforms
            </button>
            <button 
              onClick={() => document.getElementById('all-platforms')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
            >
              Browse All Boards
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-blue-300 mb-2">16+</div>
              <div className="text-blue-100">Hackathon Platforms</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-purple-300 mb-2">Global</div>
              <div className="text-purple-100">Worldwide Coverage</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-indigo-300 mb-2">All Types</div>
              <div className="text-indigo-100">Virtual & In-Person</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;