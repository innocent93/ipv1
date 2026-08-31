import { useReadingProgress } from '../hooks/useReadingProgress';
export default function ReadingProgressBar() {
  const progress = useReadingProgress();
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
      <div className="h-full bg-accent-500 transition-all duration-150 ease-out" style={{ width: `${progress}%` }}
        role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress" />
    </div>
  );
}
