export interface Message {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
    reactions?: string[];
    isNew?: boolean;
    isAudio?: boolean;
    audioUrl?: string;
    audioDuration?: number;
  }