import { Card } from '@/components/atoms';

export function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="p-4 animate-pulse">
          <div className="flex items-start gap-3">
            {/* Avatar circle */}
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />

            <div className="flex-1 space-y-2">
              {/* Name */}
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />

              {/* Skills */}
              <div className="flex gap-2">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
