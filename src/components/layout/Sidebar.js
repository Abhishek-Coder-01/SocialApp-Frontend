import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Rss, LogOut, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { cn, getInitials } from '../../lib/utils';

const NAV_ITEMS = [
  { to: '/feed', label: 'Feed', icon: Rss },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out. See you soon! 👋');
    navigate('/');
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 flex-shrink-0">
      <div className="sticky top-20 space-y-1">
        {/* Profile card */}
        <div className="card p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0',
              'bg-gradient-to-br from-orange-500 to-red-500'
            )}>
              {getInitials(user?.username || '').slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="card p-2 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => cn(
                'nav-link',
                isActive && 'active'
              )}
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                    isActive
                      ? 'bg-primary text-white shadow-glow-primary'
                      : 'bg-light-elevated dark:bg-dark-elevated text-slate-500 dark:text-slate-400'
                  )}>
                    <Icon size={16} />
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="h-px bg-light-border dark:bg-dark-border my-1" />

          <button
            onClick={handleLogout}
            className="w-full nav-link text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-400">
              <LogOut size={16} />
            </div>
            <span>Sign out</span>
          </button>
        </nav>

        {/* Branding tag */}
        <div className="px-3 py-2 flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary opacity-60" />
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            SocialApp v2.0
          </span>
        </div>
      </div>
    </aside>
  );
}
