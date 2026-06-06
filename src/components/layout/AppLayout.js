import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import ServerStatusBanner from '../ServerStatusBanner';

// Pages where sidebar should show
const SIDEBAR_ROUTES = ['/feed'];
// Pages where navbar should show (always, except maybe some modals in future)
const AUTH_PAGES = ['/login', '/signup'];

export default function AppLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const isAuthPage = AUTH_PAGES.includes(pathname);
  const showSidebar = isAuthenticated && SIDEBAR_ROUTES.includes(pathname);

  if (isAuthPage) {
    // Auth pages: full-screen, no nav
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <ServerStatusBanner />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <ServerStatusBanner />
      <Navbar />
      {showSidebar ? (
        <div className="max-w-6xl mx-auto flex gap-6 px-4 pt-6 pb-10">
          <Sidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      ) : (
        <main>{children}</main>
      )}
    </div>
  );
}
