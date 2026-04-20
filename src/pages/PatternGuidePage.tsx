import { Link } from 'react-router-dom';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { patternGuideSections } from '../data/patternGuide';

export function PatternGuidePage() {
  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold">便名の規則性</h1>
      </Card>

      {patternGuideSections.map((section) => (
        <Card key={section.title}>
          <h2 className="text-lg font-bold">{section.title}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {section.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          {section.example && <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">Example: {section.example}</p>}
        </Card>
      ))}

      <Link to="/">
        <AppButton tone="neutral">Back Home</AppButton>
      </Link>
    </div>
  );
}
