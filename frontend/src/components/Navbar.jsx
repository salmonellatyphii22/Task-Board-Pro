
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  LayoutDashboard,
  Kanban,
  FolderKanban,
  History,
  Users,
  LogOut,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = (role, className = 'w-4 h-4') => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className={className} />;
      case 'manager':
        return <Briefcase className={className} />;
      default:
        return <UserCheck className={className} />;
    }
  };

  const isActive = (path) =>
    location.pathname === path ||
    (path !== '/dashboard' &&
      path !== '/workspaces' &&
      location.pathname.startsWith(path));

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/workspaces', label: 'Workspaces', icon: FolderKanban },
    { path: '/activity-logs', label: 'Activity Log', icon: History }
  ];

  if (user?.role === 'admin') {
    navLinks.push({
      path: '/users',
      label: 'User Management',
      icon: Users
    });
  }

  const roleStyles = {
    admin: 'bg-[#70432F]/40 text-[#D9B895] border-[#A66B43]/50',
    manager: 'bg-[#573729]/50 text-[#C18A5B] border-[#A66B43]/50',
    employee: 'bg-[#40251D] text-[#D9B895] border-[#70432F]/60'
  };

  const getRoleStyle = () =>
    roleStyles[user?.role] || roleStyles.employee;

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-[#21130F]/95 backdrop-blur-xl border-b border-[#70432F]/50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-16">

            {/* Brand Logo */}
            <div className="flex items-center gap-8">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 group"
              >
                <div className="p-2 rounded-xl bg-gradient-to-tr from-[#70432F] via-[#A66B43] to-[#C18A5B] shadow-lg shadow-[#70432F]/30 group-hover:scale-105 transition-transform duration-300">
                  <Kanban className="w-5 h-5 text-white" />
                </div>

                <div className="flex flex-col">
                  <span className="font-extrabold text-lg text-[#F5E9DC] tracking-tight leading-tight">
                    TaskBoard
                    <span className="text-[#C18A5B]">Pro</span>
                  </span>

                  <span className="text-[10px] font-semibold text-[#BBA795] tracking-widest uppercase">
                    Team Workflow
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-[#70432F]/50 text-[#F5E9DC] border border-[#C18A5B]/50 shadow-sm'
                          : 'text-[#BBA795] hover:text-[#F5E9DC] hover:bg-[#40251D]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          active
                            ? 'text-[#D9B895]'
                            : 'text-[#A68A78]'
                        }`}
                      />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Desktop User Profile and Logout */}
            <div className="hidden md:flex items-center gap-4">

              <div className="flex items-center gap-3 border-r border-[#70432F]/50 pr-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md border ${getRoleStyle()}`}
                  title={`${user?.name} (${user?.role})`}
                >
                  {getRoleIcon(user?.role, 'w-4 h-4')}
                </div>

                <div className="text-left">
                  <p className="text-xs font-bold text-[#F5E9DC] leading-none mb-1">
                    {user?.name}
                  </p>

                  <p className="text-[11px] font-bold text-[#C18A5B] capitalize leading-none">
                    {user?.role}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#BBA795] hover:text-[#E6A092] hover:bg-[#702F28]/30 border border-transparent hover:border-[#B96A57]/30 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Header Actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[#40251D] text-[#D9B895] hover:bg-[#573729] hover:text-[#F5E9DC] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden">

          {/* Background Overlay */}
          <div
            className="fixed inset-0 top-16 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Menu */}
          <div className="fixed inset-x-0 top-16 z-50 bg-[#2B1913] border-b border-[#70432F]/60 px-4 pt-3 pb-6 space-y-3 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">

            {/* Mobile User Profile */}
            <div className="flex items-center justify-between pb-3 border-b border-[#70432F]/50">
              <div className="flex items-center gap-2.5">

                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md border ${getRoleStyle()}`}
                >
                  {getRoleIcon(user?.role, 'w-4 h-4')}
                </div>

                <div>
                  <p className="text-sm font-bold text-[#F5E9DC] leading-none mb-1">
                    {user?.name}
                  </p>

                  <p className="text-xs font-semibold text-[#C18A5B] capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-[#70432F]/50 text-[#F5E9DC] border border-[#C18A5B]/50'
                        : 'text-[#BBA795] hover:text-[#F5E9DC] hover:bg-[#40251D]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#D9B895]" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Logout */}
            <div className="pt-2 border-t border-[#70432F]/40">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#E6A092] bg-[#702F28]/25 border border-[#B96A57]/30 hover:bg-[#702F28]/40 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
