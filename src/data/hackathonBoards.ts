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
    ingested: true
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
    // Verified 2026-07-25: the site itself states it is no longer maintained.
    // Kept for the historical archive, but must never be presented as live.
    description: 'Archive only — no longer updated. Historical record of hackathons from 2014-2025, useful for research but not for finding current events.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: false,
    tags: ['Archive', 'Inactive', 'Historical']
  },
  {
    id: 'mlh',
    name: 'Major League Hacking',
    website: 'https://mlh.com/seasons',
    description: 'Official student hackathon league listing 200+ seasonal hackathons globally. Focus on college events.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: false,
    tags: ['Student', 'College', 'Official'],
    ingested: true
  },
  {
    id: 'hackclub',
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
    website: 'https://lablab.ai/event',
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
  },
  {
    id: 'eventbrite',
    name: 'Eventbrite',
    website: 'https://eventbrite.com/d/online/hackathon/',
    description: 'Global events platform hosting many hackathons. Search their Science & Tech section for hackathon events worldwide.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    tags: ['Events', 'Ticketing', 'Local']
  },
  {
    id: 'hackster-io',
    name: 'Hackster.io',
    website: 'https://hackster.io/contests',
    description: 'Community platform for hardware and IoT projects that frequently runs hackathons and contests. Focus on hardware hackers.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    tags: ['Hardware', 'IoT', 'Engineering']
  },
  {
    id: 'hackathons-near-me',
    name: 'HackathonsNear.Me',
    website: 'https://hackathonsnear.me',
    description: 'Location-based hackathon search engine for in-person events. Search by city or address to find local hackathons on a map.',
    region: 'USA',
    virtualInPerson: 'In-Person',
    openSubmissions: true,
    tags: ['Location-based', 'Local', 'Map Search']
  },
  {
    id: 'hackatrack',
    name: 'HackaTrack',
    website: 'https://hackatrack.net',
    description: 'Curated directory of in-person hackathons in Europe. Lists the coolest on-site hackathon events across EU countries.',
    region: 'Europe',
    virtualInPerson: 'In-Person',
    openSubmissions: false,
    tags: ['Europe', 'In-Person', 'Curated']
  },
  {
    id: 'openhackathons',
    name: 'OpenHackathons.org',
    website: 'https://openhackathons.org',
    description: 'Global hackathon directory and resource site. Worldwide directory for coding competitions and challenges by region and theme.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    tags: ['Directory', 'Global', 'Resource']
  },
  {
    id: 'bemyapp',
    name: 'BeMyApp',
    website: 'https://bemyapp.com',
    description: 'Full-service hackathon platform and organizer. Complete solution supporting corporate and community hackathons of any size.',
    region: 'Global',
    virtualInPerson: 'Both',
    openSubmissions: true,
    tags: ['Corporate', 'Full-service', 'Professional']
  }
];