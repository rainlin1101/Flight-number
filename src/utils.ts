import type { FlightEntry, QuizMode, QuizQuestion } from './types';

export const STORAGE_KEYS = {
  wrongBook: 'ana_flight_quiz_wrong_book',
  lastScore: 'ana_flight_quiz_last_score',
  settings: 'ana_flight_quiz_settings',
  recentMode: 'ana_flight_quiz_recent_mode',
} as const;

export function shuffleArray<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function normalizeInput(value: string): string {
  const numeric = value.trim().replace(/\s+/g, '').replace(/\D/g, '');
  return numeric ? `NH${numeric}` : '';
}

export function getAnswers(entries: FlightEntry[], mode: QuizMode): string[] {
  return entries.map((entry) =>
    mode === 'departure' ? entry.departure_flight_number : entry.return_flight_number,
  );
}

export function buildQuestions(entries: FlightEntry[]): QuizQuestion[] {
  const grouped = new Map<string, FlightEntry[]>();

  for (const entry of entries) {
    const key = entry.destination_japanese;
    const existing = grouped.get(key);
    if (existing) {
      existing.push(entry);
    } else {
      grouped.set(key, [entry]);
    }
  }

  return Array.from(grouped.entries()).map(([destination, rows]) => ({
    destination,
    entries: rows,
  }));
}

export function isAnswerSetCorrect(expected: string[], inputs: string[]): boolean {
  if (expected.length !== inputs.length) {
    return false;
  }

  const expectedSorted = [...expected].sort();
  const inputSorted = [...inputs].sort();

  return expectedSorted.every((answer, index) => answer === inputSorted[index]);
}

export function modeLabel(mode: QuizMode): string {
  return mode === 'departure' ? 'Departure from HND' : 'Return to HND';
}
