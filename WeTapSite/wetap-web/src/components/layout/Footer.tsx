import { Github, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  const developers = [
    { name: 'DmitroKozachok', url: 'https://github.com/DmitroKozachok' },
    { name: 'Spehereuz', url: 'https://github.com/Spehereuz' },
    { name: 'QKosm0naftQ', url: 'https://github.com/QKosm0naftQ' },
    { name: 'PiterTimch', url: 'https://github.com/PiterTimch' },
  ];

  return (
    <footer className="mt-auto border-t border-white/5 bg-zinc-950/50 backdrop-blur-sm px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">

          <div className="space-y-4 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">
              NEXT<span style={{ color: '#FF2D7A' }}>PLAY</span>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              Найкращий досвід перегляду відео онлайн. Твій власний сервіс у кишені.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Навігація</h3>
            <ul className="space-y-2 text-sm text-zinc-500 font-bold">
              <li><Link to="/" className="hover:text-[#FF2D7A] transition-colors">Головна</Link></li>
              <li><Link to="/search" className="hover:text-[#FF2D7A] transition-colors">Пошук відео</Link></li>
              <li><Link to="/account" className="hover:text-[#FF2D7A] transition-colors">Особистий кабінет</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Авторам</h3>
            <ul className="space-y-2 text-sm text-zinc-500 font-bold">
              <li><Link to="/channel/create" className="hover:text-[#FF2D7A] transition-colors">Створити канал</Link></li>
              <li><Link to="/studio" className="hover:text-[#FF2D7A] transition-colors">Творча студія</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Розробники</h3>
            <ul className="space-y-2 text-sm text-zinc-500 font-bold">
              {developers.map((dev) => (
                <li key={dev.name}>
                  <Link
                    to={dev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#FF2D7A] transition-colors"
                  >
                    <Code2 size={14} className="text-zinc-600 shrink-0" />
                    <span>{dev.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Репозиторій</h3>
            <div>
              <Link
                to="https://github.com/Vocaquill/WeTap"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 p-3 bg-zinc-900 rounded-xl hover:bg-[#FF2D7A] transition-all text-zinc-400 hover:text-white group"
                aria-label="GitHub Repository"
              >
                <Github size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">GitHub</span>
              </Link>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
            © {currentYear} NEXTPLAY. ВСІ ПРАВА ЗАХИЩЕНІ.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
