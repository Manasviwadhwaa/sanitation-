export type Status = 'GREEN' | 'AMBER' | 'RED';

export interface Facility {
  id: string;
  name: string;
  location: string;
  status: Status;
  cleanliness: number;
  occupancy: number;
  waitTime: string;
  rushPrediction?: string;
  types: ('M' | 'F' | 'U' | 'A')[];
}

export interface Chapter {
  title: string;
  subtitle: string;
  description: string;
  icon: string; // Lucide icon name or similar
}
