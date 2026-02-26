interface AdminLoadingStateProps {
  label?: string;
}

export function AdminLoadingState({ label = "Loading..." }: AdminLoadingStateProps) {
  return (
    <div className="flex items-center justify-center h-60 text-secondary text-sm">
      {label}
    </div>
  );
}
