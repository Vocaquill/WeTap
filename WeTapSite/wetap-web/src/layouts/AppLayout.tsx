import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer' // Імпортуємо наш новий футер
import PageTransition from '../components/PageTransition';

function AppLayout() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleSidebar = () => setIsOpen(!isOpen)
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-black text-white"> {/* Змінив на bg-black для кращого контрасту */}
      <Sidebar isOpen={isOpen} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />

        <div className="p-6 flex-grow">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default AppLayout
