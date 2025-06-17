export interface Solution {
  id: string;
  challenge: string;
  groupName: string;
  studentName: string;
  what: string;
  why: string;
  how: string;
  timestamp: string;
  workshopId: string;
}

export interface Workshop {
  id: string;
  name: string;
  createdAt: string;
  solutions: Solution[];
  activeChallenges: string[];
  customChallenges: string[];
}
