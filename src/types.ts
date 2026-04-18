export type QuizMode = 'departure' | 'return';

export interface FlightEntry {
  id: number;
  destination_japanese: string;
  route: string;
  departure_flight_number: string;
  return_route: string;
  return_flight_number: string;
  category: string;
  source: string;
}

export interface QuizQuestion {
  destination: string;
  entries: FlightEntry[];
}

export interface WrongBookItem {
  mode: QuizMode;
  destination: string;
  expected: string[];
  entries: FlightEntry[];
  timestamp: string;
}

export interface ScoreSummary {
  mode: QuizMode;
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
  completedAt: string;
}

export interface AppSettings {
  shuffle: boolean;
}
