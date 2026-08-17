export function Loading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-24 text-brand-500">
      <div className="animate-spin h-6 w-6 border-2 border-brand-300 border-t-brand-700 rounded-full mr-3" />
      {label}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="text-center py-16 text-brand-400">{message}</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="text-center py-16 text-red-500">{message}</div>;
}
