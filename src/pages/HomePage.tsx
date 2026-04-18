import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { AppButton } from '../components/AppButton';
import { STORAGE_KEYS } from '../utils';
import type { ScoreSummary } from '../types';

function getLastScore(): ScoreSummary | null {
  const raw = localStorage.getItem(STORAGE_KEYS.lastScore);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ScoreSummary;
  } catch {
    return null;
  }
}

export function HomePage() {
  const navigate = useNavigate();
  const lastScore = getLastScore();
  function goQuiz() {
    localStorage.setItem(STORAGE_KEYS.recentMode, 'both');
    navigate('/quiz');
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2 py-2">
        <h1 className="text-2xl font-bold">ANA Flight Number Practice（HND）</h1>
        <p className="text-sm text-slate-600">Japanese destination → ANA flight number</p>
      </header>

      <Card>
        <div className="space-y-3">
          <AppButton onClick={goQuiz}>便名練習</AppButton>
          <Link to="/wrong-book">
            <AppButton tone="neutral">Wrong Book</AppButton>
          </Link>
          <Link to="/guide">
            <AppButton tone="neutral">Pattern Guide</AppButton>
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Recent Score</h2>
        {lastScore ? (
          <div className="space-y-1 text-sm">
            <p>
              Correct: {lastScore.correct}/{lastScore.total}
            </p>
            <p>Accuracy: {lastScore.accuracy}%</p>
            <p className="text-xs text-slate-500">{new Date(lastScore.completedAt).toLocaleString()}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No recent score yet.</p>
        )}
      </Card>
    </div>
  );
}
