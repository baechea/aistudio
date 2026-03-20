
export enum Difficulty {
  EASY = '하',
  MEDIUM = '중',
  HARD = '상',
}

export interface Question {
  id: string;
  content: string;
  image?: string; // URL or Base64 string for image-based questions
  answer: string;
  options?: string[]; // Array of 4 strings for Multiple Choice
  explanation: string;
  category: string; // '객관식' | '주관식'
  difficulty: Difficulty;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface TestResult {
  total: number;
  correct: number;
  date: number;
}

export interface HallOfFameEntry {
  id: string;
  name: string;
  date: number;
  score: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  aiReply?: string; // AI Reply content
  createdAt: number;
}

export interface Notice {
  id: string;
  content: string;
  createdAt: number;
}

export interface CalendarEvent {
  id: string;
  date: string; // Format: 'YYYY-MM-DD'
  title: string;
  type: 'event' | 'holiday' | 'exam';
  color?: string; // 'blue' | 'red' | 'green' | 'purple' | 'yellow'
}

export type ViewState = 'DASHBOARD' | 'QUESTIONS' | 'COMMUNITY' | 'TEST' | 'WRONG_NOTES' | 'ADMIN';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
