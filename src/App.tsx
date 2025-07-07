import React from 'react';
import HeroSection from './components/HeroSection';
import FeaturedPlatforms from './components/FeaturedPlatforms';
import AllPlatforms from './components/AllPlatforms';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedPlatforms />
      <AllPlatforms />
      <Footer />
    </div>
  );
}

export default App;