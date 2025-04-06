export interface ChallengeSet {
  challenge_set_id: number;
  challenges: Challenge[];
  desc: string;
}

export interface Challenge {
  desc: string;
  id: number;
  name: string;
}

export interface SessionEntry {
  cmd: string;
  stderr: string;
  stdout: string;
}