import { Search, X } from 'lucide-react';
import { useRef } from 'react';
import { cn } from 'src/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn('mx-auto w-full max-w-2xl px-4', className)}>
      <div className="relative -mt-6 rounded-xl border border-border bg-card shadow-lg">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a request..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full rounded-xl bg-transparent pl-12 pr-10 text-base outline-none placeholder:text-muted-foreground"
        />
        {value && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
