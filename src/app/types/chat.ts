export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userType: 'student' | 'mentor';
  message: string;
  timestamp: number;
  type: 'text' | 'image' | 'video' | 'poll' | 'gif';
  mediaUrl?: string;
  pollData?: PollData;
  region?: string;
  college?: string;
  isEdited?: boolean;
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  votedUsers: string[]; // User IDs who have voted
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface SlowModeSettings {
  enabled: boolean;
  interval: number; // seconds between messages
  lastMessageTime: Record<string, number>; // userId -> timestamp
}
