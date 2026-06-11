interface Props {
  size?: number;
  className?: string;
}

// Iconic Pokémon "shiny" sparkle mark — a large four-pointed star burst with a
// small accent sparkle, matching the shiny indicator used in the games rather
// than a generic ★.
export function ShinyIcon({ size = 16, className }: Props) {
  return (
    <svg
      viewBox="0 0 28 28"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* large sparkle */}
      <path d="M11 4c.7 6.3 2.7 8.3 9 9-6.3.7-8.3 2.7-9 9-.7-6.3-2.7-8.3-9-9 6.3-.7 8.3-2.7 9-9Z" />
      {/* small accent sparkle */}
      <path d="M22 3c.3 2.7 1.3 3.7 4 4-2.7.3-3.7 1.3-4 4-.3-2.7-1.3-3.7-4-4 2.7-.3 3.7-1.3 4-4Z" />
    </svg>
  );
}
