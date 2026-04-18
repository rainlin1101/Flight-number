import { FormEvent, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import entries from '../data/questions.json';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { buildQuestions, getAnswers, isAnswerSetCorrect, modeLabel, normalizeInput, shuffleArray, STORAGE_KEYS } from '../utils';
import type { FlightEntry, QuizMode, ScoreSummary, WrongBookItem } from '../types';

interface QuizState {
  mode: QuizMode;
  current: number;
  correctCount: number;
  wrongItems: WrongBookItem[];
}

const typedEntries = entries as FlightEntry[];

interface QuizPageState {
  customQuestions?: { destination: string; entries: FlightEntry[] }[];
}

export function QuizPage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mode = params.mode === 'return' ? 'return' : 'departure';
  const pageState = location.state as QuizPageState | undefined;

  const questions = useMemo(() => {
    const grouped = pageState?.customQuestions?.length ? pageState.customQuestions : buildQuestions(typedEntries);
    const settingsRaw = localStorage.getItem(STORAGE_KEYS.settings);
    let shuffle = true;
    if (settingsRaw) {
      try {
        shuffle = JSON.parse(settingsRaw).shuffle !== false;
      } catch {
        shuffle = true;
      }
    }
    return shuffle ? shuffleArray(grouped) : grouped;
  }, [pageState?.customQuestions]);

  const [quizState, setQuizState] = useState<QuizState>({
    mode,
    current: 0,
    correctCount: 0,
    wrongItems: [],
  });
  const [inputs, setInputs] = useState<string[]>(Array(questions[0]?.entries.length ?? 1).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const question = questions[quizState.current];

  if (!question) {
    return <Card>No questions available.</Card>;
  }

  const expectedAnswers = getAnswers(question.entries, quizState.mode);
  const routes = question.entries.map((entry) =>
    quizState.mode === 'departure' ? entry.route : entry.return_route,
  );

  function submitAnswer(e: FormEvent) {
    e.preventDefault();
    const normalized = inputs.map(normalizeInput);
    const correct = isAnswerSetCorrect(expectedAnswers, normalized);
    setSubmitted(true);
    setIsCorrect(correct);

    if (!correct) {
      const wrongBookRaw = localStorage.getItem(STORAGE_KEYS.wrongBook);
      const existing = wrongBookRaw ? (JSON.parse(wrongBookRaw) as WrongBookItem[]) : [];
      const item: WrongBookItem = {
        mode: quizState.mode,
        destination: question.destination,
        expected: expectedAnswers,
        entries: question.entries,
        timestamp: new Date().toISOString(),
      };
      const deduped = [item, ...existing.filter((record) => !(record.mode === item.mode && record.destination === item.destination))];
      localStorage.setItem(STORAGE_KEYS.wrongBook, JSON.stringify(deduped));

      setQuizState((prev) => ({
        ...prev,
        wrongItems: [...prev.wrongItems, item],
      }));
      return;
    }

    setQuizState((prev) => ({
      ...prev,
      correctCount: prev.correctCount + 1,
    }));
  }

  function nextQuestion() {
    const next = quizState.current + 1;
    if (next >= questions.length) {
      const total = questions.length;
      const correct = quizState.correctCount + (isCorrect ? 1 : 0);
      const summary: ScoreSummary = {
        mode: quizState.mode,
        total,
        correct,
        wrong: total - correct,
        accuracy: Math.round((correct / total) * 100),
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.lastScore, JSON.stringify(summary));

      navigate('/result', {
        state: {
          summary,
          mode: quizState.mode,
        },
      });
      return;
    }

    setQuizState((prev) => ({
      ...prev,
      current: next,
    }));
    setInputs(Array(questions[next].entries.length).fill(''));
    setSubmitted(false);
    setIsCorrect(null);
  }

  const progress = Math.round(((quizState.current + 1) / questions.length) * 100);

  return (
    <div className="space-y-4">
      <Card>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{modeLabel(quizState.mode)}</p>
          <div>
            <p className="text-xs text-slate-500">
              Progress {quizState.current + 1} / {questions.length}
            </p>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{question.destination}</h2>
        </div>
      </Card>

      <Card>
        <form className="space-y-3" onSubmit={submitAnswer}>
          {inputs.map((value, index) => (
            <label key={`${question.destination}-${index}`} className="block">
              <span className="mb-1 block text-xs text-slate-500">Answer {index + 1}</span>
              <span className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-500">
                <span className="mr-2 font-semibold text-slate-600">NH</span>
                <input
                  value={value}
                  onChange={(event) =>
                    setInputs((prev) => {
                      const next = [...prev];
                      next[index] = event.target.value.replace(/\D/g, '');
                      return next;
                    })
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !submitted) {
                      event.preventDefault();
                      const form = event.currentTarget.form;
                      if (form) {
                        form.requestSubmit();
                      }
                    }
                  }}
                  className="w-full bg-transparent text-lg outline-none"
                  placeholder="861"
                  disabled={submitted}
                />
              </span>
            </label>
          ))}

          {!submitted ? (
            <AppButton type="submit">Submit</AppButton>
          ) : (
            <AppButton type="button" onClick={nextQuestion} tone="secondary">
              Next
            </AppButton>
          )}
        </form>

        {submitted && (
          <div
            className={`mt-4 rounded-xl p-3 text-sm ${
              isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            <p className="font-semibold">{isCorrect ? 'Correct' : 'Incorrect'}</p>
            <p className="mt-1">Correct answers: {expectedAnswers.join(', ')}</p>
            <p className="mt-1 text-xs">Route info: {routes.join(', ')}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
