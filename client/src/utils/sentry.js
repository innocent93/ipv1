import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  if (!import.meta.env.VITE_SENTRY_DSN) return;

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_RELEASE || 'ipmc-client@1.0.0',
    beforeSend(event) {
      // Don't send PII
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },
  });
};

export { Sentry };
