import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import PageTransition from '../components/layout/PageTransition';

function AppLayout() {
  const [isOpen, setIsOpen] = useState(true); // Для макету краще тримати замовчуванням true
  const toggleSidebar = () => setIsOpen(!isOpen)
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#121213] text-zinc-100 antialiased font-sans">
      {/* Сайдбар ліворуч */}
      <Sidebar isOpen={isOpen} />

      {/* Основна контентна зона праворуч */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#121213]">
        <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />

        {/* Контент сторінки з точними відступами як на скриншоті */}
        <div className="px-2 py-1 flex-grow">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </div>

        <Footer />
      </main>
    </div>
  )
}

export default AppLayout;
