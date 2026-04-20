import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { STORAGE_KEYS } from '../utils';
import type { FlightEntry, WrongBookItem } from '../types';

function isFlightEntry(value: unknown): value is FlightEntry {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const row = value as Partial<FlightEntry>;
  return (
    typeof row.id === 'number' &&
    typeof row.destination_japanese === 'string' &&
    typeof row.route === 'string' &&
    typeof row.departure_flight_number === 'string' &&
    typeof row.return_route === 'string' &&
    typeof row.return_flight_number === 'string' &&
    typeof row.category === 'string' &&
    typeof row.source === 'string'
  );
}

function readWrongBook(): WrongBookItem[] {
  const raw = localStorage.getItem(STORAGE_KEYS.wrongBook);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item): WrongBookItem | null => {
        if (!item || typeof item !== 'object') {
          return null;
        }

        const candidate = item as Partial<WrongBookItem>;
        const entriesSafe = Array.isArray(candidate.entries) ? candidate.entries.filter(isFlightEntry) : [];
        if (typeof candidate.destination !== 'string' || entriesSafe.length === 0) {
          return null;
        }

        return {
          destination: candidate.destination,
          expectedDeparture: Array.isArray(candidate.expectedDeparture)
            ? candidate.expectedDeparture.filter((v): v is string => typeof v === 'string')
            : entriesSafe.map((entry) => entry.departure_flight_number),
          expectedReturn: Array.isArray(candidate.expectedReturn)
            ? candidate.expectedReturn.filter((v): v is string => typeof v === 'string')
            : entriesSafe.map((entry) => entry.return_flight_number),
          entries: entriesSafe,
          timestamp: typeof candidate.timestamp === 'string' ? candidate.timestamp : new Date().toISOString(),
        };
      })
      .filter((item): item is WrongBookItem => item !== null);
  } catch {
    return [];
  }
}

export function WrongBookPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<WrongBookItem[]>(readWrongBook());

  const sorted = useMemo(
    () => [...items].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [items],
  );

  function sync(next: WrongBookItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEYS.wrongBook, JSON.stringify(next));
  }

  function removeItem(target: WrongBookItem) {
    const next = items.filter((item) => item.destination !== target.destination);
    sync(next);
  }

  function clearAll() {
    sync([]);
  }

  function practiceWrong(item: WrongBookItem) {
    localStorage.setItem(STORAGE_KEYS.recentMode, 'both');
    navigate('/quiz', {
      state: {
        customQuestions: [{ destination: item.destination, entries: item.entries }],
      },
    });
  }

  function practiceAllWrong() {
    if (sorted.length === 0) return;
    navigate('/quiz', {
      state: {
        customQuestions: sorted.map((item) => ({
          destination: item.destination,
          entries: item.entries,
        })),
      },
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-xl font-black">Wrong Book</h1>
        <p className="mt-1 text-sm text-slate-600">Practice only wrong questions and maintain your list.</p>
      </Card>

      {sorted.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">No wrong questions saved.</p>
        </Card>
      ) : (
        sorted.map((item) => (
          <Card key={item.destination} className="space-y-2">
            <p className="text-lg font-black">{item.destination}</p>
            <p className="text-sm">出発: {item.expectedDeparture.join(', ')}</p>
            <p className="text-sm">到着: {item.expectedReturn.join(', ')}</p>
            <div className="mt-2 flex gap-2">
              <AppButton fullWidth={false} className="flex-1" onClick={() => practiceWrong(item)}>
                Practice
              </AppButton>
              <AppButton fullWidth={false} className="flex-1" tone="danger" onClick={() => removeItem(item)}>
                Remove
              </AppButton>
            </div>
          </Card>
        ))
      )}

      <div className="space-y-2">
        <AppButton tone="secondary" onClick={practiceAllWrong} disabled={sorted.length === 0}>
          Practice only wrong questions
        </AppButton>
        <AppButton tone="danger" onClick={clearAll} disabled={sorted.length === 0}>
          Clear all
        </AppButton>
        <Link to="/">
          <AppButton tone="neutral">Back Home</AppButton>
        </Link>
      </div>
    </div>
  );
}
