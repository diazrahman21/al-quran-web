interface SurahBadgeProps {
  number: number;
  size?: 32 | 36;
}

export default function SurahBadge({ number, size = 36 }: SurahBadgeProps) {
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 36 36">
        <rect x="8" y="8" width="20" height="20" rx="2" fill="none" stroke="var(--gold)" strokeWidth="1.25" />
        <rect
          x="8"
          y="8"
          width="20"
          height="20"
          rx="2"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.25"
          transform="rotate(45 18 18)"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-semibold text-gold"
        style={{ fontSize: size === 36 ? 11 : 10 }}
      >
        {number}
      </span>
    </span>
  );
}
