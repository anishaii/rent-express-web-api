export default function Loading() {
  return (
    <div className="px-14 py-8">
      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="h-44 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-100 rounded animate-pulse" />
                <div className="h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}