import React from 'react';
import { Code, Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Code className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">HackBoards</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your ultimate directory for discovering hackathon platforms worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#featured" className="text-gray-400 hover:text-white transition-colors">Featured Platforms</a></li>
              <li><a href="#all-platforms" className="text-gray-400 hover:text-white transition-colors">All Platforms</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Submit Platform</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI & Machine Learning</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blockchain & Web3</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Student Hackathons</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Corporate Challenges</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hackathon Tips</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Team Building</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Project Ideas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 HackBoards. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for the developer community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;