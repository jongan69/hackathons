import { HackathonBoard } from '../types/hackathon';

export const hackathonBoards: HackathonBoard[] = [
  {
    id: 'devpost',
    name: 'Devpost',
    website: 'https://devpost.com/',
    description: 'The premier platform for hackathons and developer competitions worldwide. Host and discover amazing hackathons.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    featured: true,
    tags: ['Popular', 'Established', 'Community'],
    userBase: '1M+ developers'
  },
  {
    id: 'devfolio',
    name: 'Devfolio',
    website: 'https://devfolio.co/discover',
    description: 'Discover exciting hackathons and build amazing projects. A modern platform for the next generation of developers.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    featured: true,
    tags: ['Modern', 'Developer-friendly', 'Innovation'],
    userBase: '500K+ developers'
  },
  {
    id: 'superteam',
    name: 'Superteam Earn',
    website: 'https://earn.superteam.fun/',
    description: 'Crypto and Web3 focused hackathons and bounties. Perfect for blockchain enthusiasts and crypto developers.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    featured: true,
    tags: ['Web3', 'Crypto', 'Blockchain'],
    userBase: '100K+ crypto devs'
  },
  {
    id: 'x-search',
    name: 'X (Twitter) Search',
    website: 'https://x.com/search?q=hackathon%20filter%3Alinks%20-filter%3Areplies&f=live&src=typed_query',
    description: 'Live search results for hackathon announcements and links on X (Twitter). Real-time discovery of new hackathons.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    featured: true,
    tags: ['Real-time', 'Social Media', 'Live Updates'],
    userBase: 'Twitter users'
  },
  {
    id: 'hackathon-com',
    name: 'Hackathon.com',
    website: 'https://hackathon.com',
    description: 'Platform listing hackathons from all over the world, searchable by location, date, and theme.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: false,
    tags: ['Curated', 'Searchable', 'Organized']
  },
  {
    id: 'hackalist',
    name: 'Hackalist',
    website: 'https://hackalist.org',
    description: 'Community-driven database of upcoming hackathons worldwide. Maintained via GitHub contributions.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    tags: ['Community', 'Open Source', 'GitHub']
  },
  {
    id: 'mlh',
    name: 'Major League Hacking',
    website: 'https://mlh.io',
    description: 'Official student hackathon league listing 200+ seasonal hackathons globally. Focus on college events.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: false,
    tags: ['Student', 'College', 'Official']
  },
  {
    id: 'hack-club',
    name: 'Hack Club Hackathons',
    website: 'https://hackathons.hackclub.com',
    description: 'Curated list of high school hackathons (779 events across 30 US states + 22 countries).',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    tags: ['High School', 'Student', 'Global']
  },
  {
    id: 'unstop',
    name: 'Unstop',
    website: 'https://unstop.com',
    description: 'Global student competition platform (formerly Dare2Compete) hosting hackathons, quizzes, case contests, etc.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    tags: ['Student', 'Competition', 'India-based']
  },
  {
    id: 'hackerearth',
    name: 'HackerEarth',
    website: 'https://hackerearth.com/challenges/hackathon',
    description: 'Developer platform with coding challenges and hackathons. Source top talents by conducting best-in-class hackathons.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    tags: ['Developer', 'Talent', 'Corporate']
  },
  {
    id: 'hack2skill',
    name: 'Hack2Skill',
    website: 'https://hack2skill.com',
    description: 'Innovation platform for companies and institutes. Claims 5 million+ Innovators, 10,000+ institutes worldwide.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    tags: ['Innovation', 'Corporate', 'Large Scale']
  },
  {
    id: 'angelhack',
    name: 'AngelHack',
    website: 'https://angelhack.com',
    description: 'Global hackathon organizer with startup focus. Events calendar of in-person and online hackathons.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: false,
    tags: ['Startup', 'Entrepreneurship', 'Global']
  },
  {
    id: 'lablab-ai',
    name: 'LabLab.ai',
    website: 'https://lablab.ai',
    description: 'Community platform for AI-focused hackathons. Hosts large AI/ML hackathons worldwide.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: false,
    tags: ['AI', 'Machine Learning', 'Technology']
  },
  {
    id: 'reskilll',
    name: 'Reskilll',
    website: 'https://reskilll.com/allhacks',
    description: 'Portal listing mainly Indian hackathons and coding contests. Harnessing creativity of tech enthusiasts.',
    region: 'India',
    virtualInPerson: 'Both',
    openSubmissions: true,
    tags: ['India', 'Coding', 'Regional']
  },
  {
    id: 'challenge-gov',
    name: 'Challenge.gov',
    website: 'https://challenge.gov',
    description: 'U.S. federal government official prize/challenge portal. Lists open innovation challenges for public good.',
    region: 'USA',
    virtualInPerson: 'Virtual',
    openSubmissions: true,
    tags: ['Government', 'Public Good', 'USA']
  },
  {
    id: 'topcoder',
    name: 'TopCoder',
    website: 'https://topcoder.com/challenges',
    description: 'Competitive programming platform hosting coding competitions and hackathons. Well-known in developer community.',
    region: 'Global',
    virtualInPerson: 'Virtual',
    openSubmissions: false,
    tags: ['Competitive', 'Programming', 'Established']
  },
  {
    id: 'innocentive',
    name: 'InnoCentive',
    website: 'https://innocentive.com',
    description: 'Crowdsourced innovation platform with various challenges. Often used by companies and government.',
    region: 'Global',
    virtualInPerson: 'Virtual',
    openSubmissions: false,
    tags: ['Innovation', 'Crowdsourced', 'Corporate']
  }
];