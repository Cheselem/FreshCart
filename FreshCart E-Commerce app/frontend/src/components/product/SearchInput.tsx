"use client";
import { Icon } from "@/components/ui/Icon";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: Props) {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-stone-400">
        <Icon name="search" size={18} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search produce, pantry, bakery…"}
        aria-label="Search catalog"
        className="input pl-10 pr-10"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-2 my-auto grid h-6 w-6 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          aria-label="Clear search"
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
