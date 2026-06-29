import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import StudioSidebar from '../components/layout/StudioSidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';

function StudioLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-theme-bg text-zinc-100 antialiased font-sans">
      <StudioSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 flex flex-col min-w-0 bg-theme-bg">
        <Header />

        <div className="px-2 py-1 flex-grow">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default StudioLayout;
