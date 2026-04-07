import { Github, Instagram, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-zinc-950/50 backdrop-blur-sm px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="space-y-4 col-span-1 md:col-span-1">
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">
              COUNTER<span className="text-red-600">WATCH</span>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Найкращий досвід перегляду кіно онлайн. Твій власний кінотеатр у кишені.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Навігація</h3>
            <ul className="space-y-2 text-sm text-zinc-500 font-bold">
              <li><Link to="/" className="hover:text-red-500 transition-colors">Головна</Link></li>
              <li><Link to="/catalog" className="hover:text-red-500 transition-colors">Каталог</Link></li>
              <li><Link to="/top" className="hover:text-red-500 transition-colors">Топ фільмів</Link></li>
              <li>
                <a
                  href="https://social.mtdv.me/videos/qugmbbq9LK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  Секрет - не натискати
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Підтримка</h3>
            <ul className="space-y-2 text-sm text-zinc-500 font-bold">
              <li><Link to="/faq" className="hover:text-red-500 transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-red-500 transition-colors">Конфіденційність</Link></li>
              <li><Link to="/contacts" className="hover:text-red-500 transition-colors">Контакти</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Ми в мережі</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-zinc-900 rounded-xl hover:bg-red-600 transition-all text-zinc-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-zinc-900 rounded-xl hover:bg-red-600 transition-all text-zinc-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-zinc-900 rounded-xl hover:bg-red-600 transition-all text-zinc-400 hover:text-white">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
            © {currentYear} COUNTERWATCH. ВСІ ПРАВА ЗАХИЩЕНІ.
          </p>
          <div className="flex items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer group">
            <Mail size={14} className="group-hover:text-red-500 transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">support@counterwatch.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
