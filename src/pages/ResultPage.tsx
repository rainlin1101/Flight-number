import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import type { ScoreSummary } from '../types';

interface ResultState {
  summary: ScoreSummary;
}

export function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultState | undefined;

  if (!state?.summary) {
    return (
      <Card>
        <p className="text-sm">No result available.</p>
        <div className="mt-3">
          <Link to="/">
            <AppButton tone="neutral">Back Home</AppButton>
          </Link>
        </div>
      </Card>
    );
  }

  const { summary } = state;

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold">Result Summary</h1>
        <div className="mt-3 space-y-1 text-sm">
          <p>Total questions: {summary.total}</p>
          <p>Correct answers: {summary.correct}</p>
          <p>Wrong answers: {summary.wrong}</p>
          <p>Accuracy: {summary.accuracy}%</p>
        </div>
      </Card>

      <Card>
        <div className="space-y-2">
          <AppButton onClick={() => navigate('/quiz')}>Retry</AppButton>
          <Link to="/wrong-book">
            <AppButton tone="neutral">Review Wrong Book</AppButton>
          </Link>
          <Link to="/">
            <AppButton tone="neutral">Back Home</AppButton>
          </Link>
        </div>
      </Card>
    </div>
  );
}
