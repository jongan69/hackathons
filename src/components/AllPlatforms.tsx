import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { hackathonBoards } from '../data/hackathonBoards';
import PlatformCard from './PlatformCard';

const AllPlatforms: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [openSubmissionsOnly, setOpenSubmissionsOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(hackathonBoards.map(board => board.region))];
    return ['All', ...uniqueRegions];
  }, []);

  const types = useMemo(() => {
    const uniqueTypes = [...new Set(hackathonBoards.map(board => board.virtualInPerson))];
    return ['All', ...uniqueTypes];
  }, []);

  const filteredBoards = useMemo(() => {
    return hackathonBoards.filter(board => {
      const matchesSearch = board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          board.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          board.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesRegion = selectedRegion === 'All' || board.region === selectedRegion;
      const matchesType = selectedType === 'All' || board.virtualInPerson === selectedType;
      const matchesSubmissions = !openSubmissionsOnly || board.openSubmissions;
      
      return matchesSearch && matchesRegion && matchesType && matchesSubmissions;
    });
  }, [searchQuery, selectedRegion, selectedType, openSubmissionsOnly]);

  return (
    <section id="all-platforms" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">All Hackathon Platforms</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive directory of hackathon platforms from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search platforms..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Region Filter */}
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Open Submissions Toggle */}
          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="openSubmissions"
              checked={openSubmissionsOnly}
              onChange={(e) => setOpenSubmissionsOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="openSubmissions" className="text-gray-700 font-medium">
              Show only platforms with open submissions
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredBoards.length} of {hackathonBoards.length} platforms
          </p>
        </div>

        {/* Platforms Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}>
          {filteredBoards.map((board) => (
            <PlatformCard key={board.id} board={board} />
          ))}
        </div>

        {filteredBoards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No platforms found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllPlatforms;