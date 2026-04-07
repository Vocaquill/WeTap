import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Отримуємо текст пошуку з URL

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">
          Результати пошуку для: <span className="text-red-500">"{query}"</span>
        </h1>
        <p className="text-zinc-400 text-sm">Знайдено 12 фільмів</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div className="aspect-[2/3] bg-zinc-800 rounded-xl border border-zinc-700 hover:border-red-500 transition-colors cursor-pointer group overflow-hidden">
          <div className="h-full flex items-center justify-center text-zinc-500 group-hover:scale-105 transition-transform">
            Poster Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
