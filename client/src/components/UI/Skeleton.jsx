export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-primary-900 rounded-2xl p-6 border border-gray-100 dark:border-primary-800 animate-pulse">
      <div className="h-8 w-3/4 bg-gray-200 dark:bg-primary-800 rounded mb-4" />
      <div className="h-4 w-full bg-gray-200 dark:bg-primary-800 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-200 dark:bg-primary-800 rounded mb-2" />
      <div className="h-4 w-4/6 bg-gray-200 dark:bg-primary-800 rounded" />
    </div>
  );
}

export function SkeletonBlogCard() {
  return (
    <div className="bg-white dark:bg-primary-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-primary-800 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-primary-800" />
      <div className="p-6">
        <div className="h-4 w-20 bg-gray-200 dark:bg-primary-800 rounded mb-3" />
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-primary-800 rounded mb-3" />
        <div className="h-4 w-full bg-gray-200 dark:bg-primary-800 rounded mb-2" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-primary-800 rounded" />
      </div>
    </div>
  );
}

export function SkeletonServiceCard() {
  return (
    <div className="bg-gray-50 dark:bg-primary-900 rounded-2xl p-8 border border-gray-100 dark:border-primary-800 animate-pulse">
      <div className="h-12 w-12 bg-gray-200 dark:bg-primary-800 rounded-xl mb-4" />
      <div className="h-6 w-2/3 bg-gray-200 dark:bg-primary-800 rounded mb-3" />
      <div className="h-4 w-full bg-gray-200 dark:bg-primary-800 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-200 dark:bg-primary-800 rounded" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-primary-800 rounded" style={{ width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative py-20 md:py-28 bg-primary-950 overflow-hidden animate-pulse">
      <div className="container-custom">
        <div className="h-4 w-32 bg-primary-800 rounded mb-4" />
        <div className="h-12 md:h-16 w-3/4 bg-primary-800 rounded mb-6" />
        <div className="h-6 w-1/2 bg-primary-800 rounded" />
      </div>
    </div>
  );
}
