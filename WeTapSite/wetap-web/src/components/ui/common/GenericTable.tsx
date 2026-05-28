import { Edit2, Trash2, Loader2, ArrowUpDown } from 'lucide-react';
import { Button } from '../../form/Button';
import { APP_ENV } from "../../../env";
import type { IColumnConfig } from '../../../types/Additional/IColumnConfig';

interface GenericTableProps<T> {
  data: T[] | undefined;
  columns?: IColumnConfig<T>[]; 
  isFetching?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  sortBy?: string;
  onSortChange?: (key: string | undefined) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function GenericTable<T extends { id: string | number }>({
  data,
  columns: customColumns,
  isFetching = false,
  isError = false,
  emptyMessage = 'Даних не знайдено',
  sortBy,
  onSortChange,
  onEdit,
  onDelete,
}: GenericTableProps<T>) {
  const getAutoColumns = (): IColumnConfig<T>[] => {
    if (!data || data.length === 0) return [];

    const firstItem = data[0];
    const keys = Object.keys(firstItem);

    return keys.map((key) => {
      const lowerKey = key.toLowerCase();

      switch (lowerKey) {
        case 'id':
          return {
            key,
            label: 'ID',
            headerClassName: 'w-24 text-center',
            className: 'text-center text-zinc-600 font-mono text-xs italic',
            render: (item: any) => `#${item[key]}`,
          };

        case 'image':
        case 'avatarimage':
          return {
            key,
            label: lowerKey === 'image' ? "Прев'ю" : "Аватар",
            headerClassName: 'w-28',
            render: (item: any) => (
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-inner group-hover:border-zinc-700 transition-colors">
                {item[key] ? (
                  <img
                    src={APP_ENV.IMAGES_400_URL + item[key]}
                    alt="Preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700 uppercase text-[10px] font-black">No Pic</div>
                )}
              </div>
            ),
          };

        case 'name':
        case 'title':
          return {
            key,
            label: lowerKey === 'name' ? 'Назва жанру' : 'Назва',
            sortable: true,
            sortKey: lowerKey,
            render: (item: any) => (
              <span className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                {item[key]}
              </span>
            ),
          };

        case 'slug':
          return {
            key,
            label: 'Slug',
            sortable: true,
            sortKey: 'slug',
            render: (item: any) => (
              <span className="px-3 py-1 bg-zinc-900 text-zinc-500 rounded-lg text-xs font-mono border border-zinc-800">
                /{item[key]}
              </span>
            ),
          };

        default:
          return {
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            render: (item: any) => (
              <span className="font-medium text-zinc-300">
                {String(item[key] ?? '')}
              </span>
            ),
          };
      }
    });
  };

  const activeColumns = customColumns || getAutoColumns();

  const hasActions = !!onEdit || !!onDelete;
  const colSpan = activeColumns.length + (hasActions ? 1 : 0);

  const handleSortClick = (column: IColumnConfig<T>) => {
    if (!column.sortable || !onSortChange) return;
    const key = column.sortKey || String(column.key);
    if (sortBy === key) {
      onSortChange(undefined);
    } else {
      onSortChange(key);
    }
  };

  return (
    <div className="overflow-hidden bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl relative">
      {isFetching && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center animate-in fade-in duration-300">
          <Loader2 className="animate-spin text-red-600" size={40} />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900/50 text-zinc-500 text-[11px] uppercase tracking-[0.2em] font-black">
            <tr>
              {activeColumns.map((col) => {
                const isSortable = !!col.sortable && !!onSortChange;
                const sortKey = col.sortKey || String(col.key);
                const isActiveSort = sortBy === sortKey;

                return (
                  <th
                    key={String(col.key)}
                    className={`p-5 ${col.headerClassName || ''} ${
                      isSortable
                        ? 'cursor-pointer hover:text-zinc-200 select-none transition-colors group/header'
                        : ''
                    }`}
                    onClick={() => isSortable && handleSortClick(col)}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.label}
                      {isSortable && (
                        <ArrowUpDown
                          size={12}
                          className={`transition-all duration-300 ${
                            isActiveSort
                              ? 'text-red-500 opacity-100 scale-110'
                              : 'opacity-30 group-hover/header:opacity-75'
                          }`}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
              {hasActions && <th className="p-5 text-right w-28">Дії</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-900">
            {isError ? (
              <tr>
                <td colSpan={colSpan} className="p-20 text-center text-red-500 font-bold">
                  Помилка завантаження даних
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="p-20 text-center text-zinc-600 italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-900/40 transition-all group"
                >
                  {activeColumns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`p-5 ${col.className || ''}`}
                    >
                      {col.render ? (
                        col.render(item)
                      ) : (
                        <span className="font-medium text-zinc-300">
                          {String((item as any)[col.key] ?? '')}
                        </span>
                      )}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-10 h-10 p-0 rounded-xl hover:border-zinc-700"
                            onClick={() => onEdit(item)}
                          >
                            <Edit2 size={16} />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-10 h-10 p-0 rounded-xl hover:bg-red-950/40 text-zinc-500 hover:text-red-500 hover:border-red-950/40"
                            onClick={() => onDelete(item)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
