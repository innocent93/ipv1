import { useEffect, useRef } from 'react';

export default function RecaptchaV3({ onVerify, action = 'submit' }) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (!siteKey) return;

    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.onload = () => { scriptLoaded.current = true; };
      document.head.appendChild(script);
    }

    const timer = setTimeout(() => {
      if (window.grecaptcha && scriptLoaded.current) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action }).then((token) => {
            onVerify(token);
          });
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [action, onVerify]);

  return null;
}
