import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { AppButton } from '../components/AppButton';
import { STORAGE_KEYS, buildQuestions } from '../utils';
import type { ScoreSummary, FlightEntry } from '../types';
import entries from '../data/questions.json';

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

const typedEntries = entries as FlightEntry[];
const destinationQuestionCount = buildQuestions(typedEntries).length;

export function HomePage() {
  const navigate = useNavigate();
  const lastScore = getLastScore();

  function goQuiz() {
    localStorage.setItem(STORAGE_KEYS.recentMode, 'both');
    navigate('/quiz');
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2 py-1">
        <h1 className="text-[2.55rem] font-black leading-tight tracking-tight">ANA Flight Number Practice（HND）</h1>
        <p className="text-lg text-slate-600">Japanese destination → ANA flight number</p>
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

      <Card className="space-y-2">
        <h2 className="text-xl font-black text-slate-700">Recent Score</h2>
        {lastScore ? (
          <div className="space-y-1 text-[2rem] leading-tight text-slate-800">
            <p>
              Correct: {lastScore.correct}/{lastScore.total}
            </p>
            <p>Accuracy: {lastScore.accuracy}%</p>
            <p className="text-base text-slate-500">{new Date(lastScore.completedAt).toLocaleString()}</p>
          </div>
        ) : (
          <p className="text-base text-slate-500">No recent score yet.</p>
        )}
      </Card>

      <Card>
        <p className="text-sm font-semibold text-slate-500">Question Pool</p>
        <p className="mt-1 text-base font-bold text-slate-700">
          {typedEntries.length} flight entries / {destinationQuestionCount} destination questions
        </p>
      </Card>
    </div>
  );
}
