// app/performance/components/PerformanceNavbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Calendar, Users, TrendingUp, AlertCircle, Settings, User } from 'lucide-react';
import { useAuth } from '@/app/(system)/context/authContext';

interface PerformanceNavbarProps {
  user: any;
}

export default function PerformanceNavbar({ user }: PerformanceNavbarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isHR = user?.roles?.includes('HR_MANAGER') || user?.roles?.includes('HR_ADMIN') || user?.roles?.includes('SYSTEM_ADMIN');
  const isManager = user?.roles?.includes('DEPARTMENT_HEAD');

  const navItems = [
    { name: 'Dashboard', href: '/performance', icon: Home },
    { name: 'Cycles', href: '/performance/cycles', icon: Calendar },
    { name: 'Templates', href: '/performance/templates', icon: FileText },
  ];

  if (isHR) {
    navItems.push(
      { name: 'HR Dashboard', href: '/performance/hr', icon: Users },
      { name: 'Disputes', href: '/performance/hr/disputes', icon: AlertCircle },
      { name: 'Analytics', href: '/performance/analytics', icon: TrendingUp }
    );
  } else if (isManager) {
    navItems.push(
      { name: 'Manager Dashboard', href: '/performance/manager', icon: Users },
      { name: 'My Team', href: '/performance/manager/assignments', icon: Users }
    );
  } else {
    navItems.push(
      { name: 'My Appraisals', href: '/performance/employee', icon: FileText },
      { name: 'Disputes', href: '/performance/employee/disputes', icon: AlertCircle }
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Performance</span>
            </div>
            
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href !== '/performance' && pathname?.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } transition`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{user?.name || user?.email}</span>
                <span className="text-xs text-gray-500">
                  {isHR ? 'HR Manager' : isManager ? 'Department Head' : 'Employee'}
                </span>
              </div>
              
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  
                  {/* Dropdown Menu */}
                  <div className="relative group">
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block border">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      
                      <div className="border-t my-1"></div>
                      
                      <button
                        onClick={logout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/performance' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}