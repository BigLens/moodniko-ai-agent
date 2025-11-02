export type MoodType =
  | "happy"
  | "sad"
  | "anxious"
  | "calm"
  | "energetic"
  | "tired"
  | "stressed"
  | "content"
  | "frustrated"
  | "excited";

export type ContentType =
  | "books"
  | "music"
  | "videos"
  | "podcasts"
  | "articles"
  | "movies"
  | "meditation"
  | "activities";

export interface MoodEntry {
  id?: string;
  userId: string;
  mood: MoodType;
  intensity: number;
  notes?: string;
  timestamp: string;
}

export interface ContentRecommendation {
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  author?: string;
  duration?: string;
}

export interface MoodAnalysis {
  userId: string;
  period: string;
  trends: Array<{
    mood: MoodType;
    frequency: number;
    averageIntensity: number;
  }>;
  commonTriggers: string[];
  recommendations: string[];
}

export interface MoodnikoAPIResponse {
  recommendations: ContentRecommendation[];
  mood: MoodType;
  contentType: ContentType;
}
