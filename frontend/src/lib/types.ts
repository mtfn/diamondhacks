export interface ChallengeSet {
  challenge_set_id: number;
  challenges: Challenge[];
  desc: string;
}

export interface Challenge {
  description: string;
  id: number;
  name: string;
}

export interface SessionEntry {
  cmd: string;
  stderr: string;
  stdout: string;
}

export interface ChatEntry {
  role: 'user' | 'assistant';
  message: string;
  emoji?: string;
}