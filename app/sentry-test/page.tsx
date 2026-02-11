'use client';

import * as Sentry from '@sentry/nextjs';

export default function SentryTestPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sentry Integration Test</h1>
      <p className="text-gray-600">Click the buttons below to verify Sentry is working.</p>

      <div className="flex flex-wrap gap-4">
        <button
          className="btn-primary"
          onClick={() => {
            throw new Error('Test frontend error from Sales Forecast Tool');
          }}
        >
          Throw Frontend Error
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            Sentry.captureMessage('Test message from Sales Forecast Tool');
            alert('Sentry test message sent! Check your Sentry dashboard.');
          }}
        >
          Send Test Message
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            try {
              const obj: Record<string, unknown> = {};
              (obj as { nested: { deep: { value: string } } }).nested.deep.value;
            } catch (e) {
              Sentry.captureException(e);
              alert('Sentry test exception captured! Check your Sentry dashboard.');
            }
          }}
        >
          Capture Test Exception
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            console.error('Sentry console error test from Sales Forecast Tool');
            alert('Console error sent! Check Sentry for captured console log.');
          }}
        >
          Test Console Capture
        </button>
      </div>

      <div className="card mt-8">
        <h2 className="text-lg font-semibold mb-2">What to check in Sentry:</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li><strong>Issues</strong> - Look for &quot;Test frontend error&quot; and &quot;TypeError&quot;</li>
          <li><strong>Session Replay</strong> - You should see a replay of this page visit</li>
          <li><strong>Performance</strong> - Page load traces should appear</li>
        </ul>
      </div>
    </div>
  );
}
