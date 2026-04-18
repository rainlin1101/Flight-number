import { FormEvent, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import entries from '../data/questions.json';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import {
  buildQuestions,
  getDepartureAnswers,
  getReturnAnswers,
  isAnswerSetCorrect,
  normalizeInput,
  shuffleArray,
  STORAGE_KEYS,
} from '../utils';
import type { FlightEntry, QuizQuestion, ScoreSummary, WrongBookItem } from '../types';

interface QuizState {
  current: number;
  correctCount: number;
}

interface QuizPageState {
  customQuestions?: QuizQuestion[];
}

const typedEntries = entries as FlightEntry[];

export function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
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
    current: 0,
    correctCount: 0,
  });

  const question = questions[quizState.current];

  const [departureInputs, setDepartureInputs] = useState<string[]>(Array(question?.entries.length ?? 1).fill(''));
  const [returnInputs, setReturnInputs] = useState<string[]>(Array(question?.entries.length ?? 1).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!question) {
    return <Card>No questions available.</Card>;
  }

  const departureAnswers = getDepartureAnswers(question.entries);
  const returnAnswers = getReturnAnswers(question.entries);

  const routeCodes = question.entries.map((entry) => {
    const origin = entry.route.split('-')[0] ?? 'HND';
    const dest = entry.route.split('-')[1] ?? '';
    return `${origin} ↔ ${dest}`;
  });

  function submitAnswer(e: FormEvent) {
    e.preventDefault();
    const normalizedDeparture = departureInputs.map(normalizeInput);
    const normalizedReturn = returnInputs.map(normalizeInput);

    const departureCorrect = isAnswerSetCorrect(departureAnswers, normalizedDeparture);
    const returnCorrect = isAnswerSetCorrect(returnAnswers, normalizedReturn);
    const correct = departureCorrect && returnCorrect;

    setSubmitted(true);
    setIsCorrect(correct);

    if (!correct) {
      const wrongBookRaw = localStorage.getItem(STORAGE_KEYS.wrongBook);
      const existing = wrongBookRaw ? (JSON.parse(wrongBookRaw) as WrongBookItem[]) : [];
      const item: WrongBookItem = {
        destination: question.destination,
        expectedDeparture: departureAnswers,
        expectedReturn: returnAnswers,
        entries: question.entries,
        timestamp: new Date().toISOString(),
      };
      const deduped = [item, ...existing.filter((record) => record.destination !== item.destination)];
      localStorage.setItem(STORAGE_KEYS.wrongBook, JSON.stringify(deduped));
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
        },
      });
      return;
    }

    const nextLength = questions[next].entries.length;
    setQuizState((prev) => ({
      ...prev,
      current: next,
    }));
    setDepartureInputs(Array(nextLength).fill(''));
    setReturnInputs(Array(nextLength).fill(''));
    setSubmitted(false);
    setIsCorrect(null);
  }

  const progress = Math.round(((quizState.current + 1) / questions.length) * 100);

  return (
    <div className="space-y-4 pb-4">
      <Card className="bg-gradient-to-br from-white via-white to-lime-50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-600">
              Flight Number Practice
            </p>
            <p className="text-sm font-semibold text-slate-600">全 {questions.length} 問</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-500">
              Progress {quizState.current + 1} / {questions.length}
            </p>
            <div className="mt-2 h-3 rounded-full bg-slate-200">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-lime-400 to-sky-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-slate-900">羽田 ↔ {question.destination}</h2>
          <p className="rounded-2xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800">{routeCodes.join(' / ')}</p>
        </div>
      </Card>

      <Card>
        <form className="space-y-5" onSubmit={submitAnswer}>
          <div className="space-y-2">
            <p className="text-sm font-black tracking-wide text-slate-700">出発</p>
            {departureInputs.map((value, index) => (
              <label key={`dep-${question.destination}-${index}`} className="block">
                <span className="flex items-center rounded-2xl border border-lime-200 bg-lime-50 px-3 py-3 shadow-inner focus-within:border-lime-500">
                  <span className="mr-2 font-black text-slate-700">NH</span>
                  <input
                    value={value}
                    onChange={(event) =>
                      setDepartureInputs((prev) => {
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
                        if (form) form.requestSubmit();
                      }
                    }}
                    className="w-full bg-transparent text-lg font-semibold outline-none"
                    placeholder="219"
                    disabled={submitted}
                  />
                </span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-black tracking-wide text-slate-700">到着</p>
            {returnInputs.map((value, index) => (
              <label key={`ret-${question.destination}-${index}`} className="block">
                <span className="flex items-center rounded-2xl border border-sky-200 bg-sky-50 px-3 py-3 shadow-inner focus-within:border-sky-500">
                  <span className="mr-2 font-black text-slate-700">NH</span>
                  <input
                    value={value}
                    onChange={(event) =>
                      setReturnInputs((prev) => {
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
                        if (form) form.requestSubmit();
                      }
                    }}
                    className="w-full bg-transparent text-lg font-semibold outline-none"
                    placeholder="220"
                    disabled={submitted}
                  />
                </span>
              </label>
            ))}
          </div>

          {!submitted ? (
            <AppButton type="submit">Check</AppButton>
          ) : (
            <AppButton type="button" onClick={nextQuestion} tone="secondary">
              Next
            </AppButton>
          )}
        </form>

        {submitted && (
          <div
            className={`mt-4 rounded-2xl border p-3 text-sm ${
              isCorrect
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            <p className="text-base font-black">{isCorrect ? 'Correct' : 'Incorrect'}</p>
            <p className="mt-1">出発: {departureAnswers.join(', ')}</p>
            <p className="mt-1">到着: {returnAnswers.join(', ')}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
