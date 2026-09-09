export function DashboardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="font-display text-2xl text-heading">{title}</h1>
      {action}
    </div>
  );
}
