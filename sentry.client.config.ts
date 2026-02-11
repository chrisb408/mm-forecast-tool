import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://00f4bb8141df69cab16e49ffdb93fdd0@o4510869776367617.ingest.us.sentry.io/4510869801271296',
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
  ],
});
