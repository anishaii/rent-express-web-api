export default function Loading() {
  return (
    <div className="px-6 sm:px-14 py-10">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}