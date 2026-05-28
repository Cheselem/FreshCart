/**
 * Single inline-SVG icon component. Keeps the bundle dependency-free —
 * lucide-react is fine in real life but we want a stand-alone codebase.
 */
import clsx from "clsx";

type Name =
  | "search" | "cart" | "user" | "menu" | "x" | "check" | "chevron-down"
  | "chevron-right" | "plus" | "minus" | "trash" | "leaf" | "truck"
  | "shield" | "clock" | "credit-card" | "google" | "star" | "filter"
  | "package" | "spark";

const PATHS: Record<Name, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.5l2.4 12.6a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.7L21.5 7H6.5" />
      <circle cx="10" cy="21" r="1.5" />
      <circle cx="18" cy="21" r="1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  menu: (<><path d="M4 7h16M4 12h16M4 17h16" /></>),
  x: (<><path d="M6 6l12 12M18 6L6 18" /></>),
  check: (<><path d="M5 12l4.5 4.5L19 7" /></>),
  "chevron-down": (<><path d="M6 9l6 6 6-6" /></>),
  "chevron-right": (<><path d="M9 6l6 6-6 6" /></>),
  plus: (<><path d="M12 5v14M5 12h14" /></>),
  minus: (<><path d="M5 12h14" /></>),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <path d="M9 7V4h6v3" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 21c0-8 6-14 16-15-1 10-7 16-15 16" />
      <path d="M5 21c2-6 6-10 12-12" />
    </>
  ),
  truck: (
    <>
      <rect x="2" y="7" width="13" height="10" rx="1" />
      <path d="M15 10h4l3 3v4h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="18" cy="18" r="1.6" />
    </>
  ),
  shield: (<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  "credit-card": (
    <>
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  google: (
    <>
      <path d="M21.6 11.1c0-.7-.06-1.4-.18-2.1H12v4h5.4c-.23 1.2-.93 2.2-2 2.9v2.4h3.2c1.87-1.7 2.95-4.2 2.95-7.2z" fill="#4285F4" stroke="none" />
      <path d="M12 21c2.7 0 4.96-.9 6.6-2.4l-3.2-2.5c-.9.6-2.05.95-3.4.95-2.6 0-4.8-1.75-5.6-4.1H3.1v2.55C4.74 18.6 8.1 21 12 21z" fill="#34A853" stroke="none" />
      <path d="M6.4 12.95A5.4 5.4 0 0 1 6.1 11c0-.68.12-1.34.3-1.95V6.5H3.1A8.99 8.99 0 0 0 2.05 11c0 1.45.35 2.83.95 4.05l3.4-2.1z" fill="#FBBC05" stroke="none" />
      <path d="M12 5.9c1.47 0 2.78.5 3.82 1.5l2.83-2.83C16.95 2.95 14.7 2 12 2 8.1 2 4.74 4.4 3.1 7.7l3.4 2.55C7.2 7.9 9.4 5.9 12 5.9z" fill="#EA4335" stroke="none" />
    </>
  ),
  star: (<><path d="M12 3l2.9 5.9 6.6 1-4.8 4.6 1.1 6.4L12 18l-5.8 3 1.1-6.4-4.8-4.6 6.6-1z" /></>),
  filter: (<><path d="M4 5h16l-6.4 8v6l-3.2-1.5V13z" /></>),
  package: (
    <>
      <path d="M12 3l9 4v10l-9 4-9-4V7z" />
      <path d="M3 7l9 4 9-4M12 11v10" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.8,
}: {
  name: Name;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx("shrink-0", className)}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
