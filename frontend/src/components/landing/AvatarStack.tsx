export function AvatarStack({ count = 5 }: { count?: number }) {
  return (
    <div className="flex">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="-me-3 h-8 w-8 rounded-full border-2 border-bg bg-gradient-to-br from-primary to-accent"
          style={{ zIndex: count - i }}
        />
      ))}
    </div>
  );
}
