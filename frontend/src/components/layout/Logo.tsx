export function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect
        x="6"
        y="6"
        width="28"
        height="28"
        rx="2"
        stroke="var(--primary)"
        strokeWidth="1.4"
        transform="rotate(45 20 20)"
      />
      <rect x="6" y="6" width="28" height="28" rx="2" stroke="var(--accent)" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="2.6" fill="var(--primary)" />
    </svg>
  );
}
