export interface HackathonBoard {
  id: string;
  name: string;
  website: string;
  description: string;
  region: string;
  virtualInPerson: 'Virtual' | 'In-Person' | 'Both';
  openSubmissions: boolean;
  featured?: boolean;
  logo?: string;
  tags?: string[];
  userBase?: string;
}