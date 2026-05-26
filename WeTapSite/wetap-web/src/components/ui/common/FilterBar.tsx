import { X, Search, Link2 } from 'lucide-react';
import { InputField } from '../../form/InputField';
import { Button } from '../../form/Button';

interface FilterBarProps<T> {
  searchParams: T;
  onSearchChange: <K extends keyof T>(key: K, value: T[K]) => void;
  onReset: () => void;
}

const EXCLUDED_KEYS = ['page', 'itemPerPage', 'sortBy', 'q'];

export function FilterBar<T extends Record<string, any>>({
  searchParams,
  onSearchChange,
  onReset,
}: FilterBarProps<T>) {
  const activeKeys = Object.keys(searchParams).filter(
    (key) => !EXCLUDED_KEYS.includes(key)
  );

  const hasActiveFilters = activeKeys.some((key) => !!searchParams[key]);

  const getFieldConfig = (key: string) => {
    switch (key.toLowerCase()) {
      case 'name':
      case 'title':
        return {
          placeholder: 'Пошук за назвою...',
          icon: <Search size={18} />,
          inputClassName: 'text-zinc-200 border-zinc-800 bg-zinc-900 focus:border-red-600/50',
          wrapperClassName: 'flex-[2] min-w-[240px]',
        };
      case 'slug':
        return {
          placeholder: 'Фільтр по slug...',
          icon: <Link2 size={16} />,
          inputClassName: 'text-xs text-zinc-400 font-mono italic border-zinc-800 bg-zinc-900 focus:border-red-600/50',
          wrapperClassName: 'flex-1 min-w-[180px]',
        };
      default:
        return {
          placeholder: `Пошук за ${key}...`,
          icon: <Search size={18} />,
          inputClassName: 'text-zinc-200 border-zinc-800 bg-zinc-900 focus:border-red-600/50',
          wrapperClassName: 'flex-1 min-w-[180px]',
        };
    }
  };

  return (
    <div className="bg-zinc-950 p-4 rounded-[2rem] border border-zinc-800 flex flex-wrap items-center gap-4 shadow-xl">
      {activeKeys.map((key) => {
        const config = getFieldConfig(key);
        return (
          <InputField
            key={key}
            value={searchParams[key] || ''}
            onChange={(e) => onSearchChange(key as any, e.target.value as any)}
            placeholder={config.placeholder}
            icon={config.icon}
            type="text"
            inputClassName={config.inputClassName}
            wrapperClassName={config.wrapperClassName}
          />
        );
      })}

      {hasActiveFilters && (
        <Button
          type="button"
          variant="secondary"
          className="w-12 h-12 p-0 flex items-center justify-center rounded-xl animate-in fade-in zoom-in duration-300"
          onClick={onReset}
        >
          <X size={20} />
        </Button>
      )}
    </div>
  );
}
