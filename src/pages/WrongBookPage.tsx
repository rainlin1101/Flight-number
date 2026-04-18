import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { STORAGE_KEYS } from '../utils';
import type { WrongBookItem } from '../types';

function readWrongBook(): WrongBookItem[] {
  const raw = localStorage.getItem(STORAGE_KEYS.wrongBook);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as WrongBookItem[];
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
    const next = items.filter((item) => !(item.mode === target.mode && item.destination === target.destination));
    sync(next);
  }

  function clearAll() {
    sync([]);
  }

  function practiceWrong(item: WrongBookItem) {
    localStorage.setItem(STORAGE_KEYS.recentMode, item.mode);
    navigate(`/quiz/${item.mode}`, {
      state: {
        customQuestions: [{ destination: item.destination, entries: item.entries }],
      },
    });
  }

  function practiceAllWrong() {
    if (sorted.length === 0) return;
    const mode = sorted[0].mode;
    const filtered = sorted.filter((item) => item.mode === mode);
    navigate(`/quiz/${mode}`, {
      state: {
        customQuestions: filtered.map((item) => ({
          destination: item.destination,
          entries: item.entries,
        })),
      },
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold">Wrong Book</h1>
        <p className="mt-1 text-sm text-slate-600">Practice only wrong questions and maintain your list.</p>
      </Card>

      {sorted.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">No wrong questions saved.</p>
        </Card>
      ) : (
        sorted.map((item) => (
          <Card key={`${item.mode}-${item.destination}`}>
            <p className="text-lg font-semibold">{item.destination}</p>
            <p className="mt-1 text-xs text-slate-500">Mode: {item.mode === 'departure' ? 'Departure' : 'Return'}</p>
            <p className="mt-1 text-sm">Answers: {item.expected.join(', ')}</p>
            <div className="mt-3 flex gap-2">
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
