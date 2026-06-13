export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar component goes here later */}
      <div className="flex-1">{children}</div>
    </div>
  );
}