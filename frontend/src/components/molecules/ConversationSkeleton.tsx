export function ConversationSkeleton() {
  return (
    <div
      className="divide-y divide-border"
      aria-busy="true"
      aria-label="Chargement des conversations"
    >
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
          {/* Avatar circle */}
          <div className="h-12 w-12 rounded-full bg-gray-200" />

          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              {/* Name */}
              <div className="h-4 w-24 bg-gray-200 rounded" />
              {/* Date */}
              <div className="h-3 w-10 bg-gray-200 rounded" />
            </div>
            {/* Message snippet */}
            <div className="h-3 w-full bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
