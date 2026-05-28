import clsx from "clsx";

type Tone = "emerald" | "lime" | "stone" | "red" | "amber";

const tones: Record<Tone, string> = {
  emerald: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  lime:    "bg-lime-100 text-emerald-900 ring-lime-300",
  stone:   "bg-stone-100 text-stone-700 ring-stone-200",
  red:     "bg-red-50 text-red-700 ring-red-200",
  amber:   "bg-amber-50 text-amber-800 ring-amber-200",
};

export function Badge({
  tone = "stone",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
