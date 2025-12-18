// app/performance/layout.tsx
'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/(system)/context/authContext';
import { isHRAdmin, isManager } from '@/app/utils/roleCheck';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart, 
  AlertCircle,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  ArrowLeft
} from 'lucide-react';

export default function PerformanceLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect if not authenticated
  if (!loading && !user) {
    router.push('/auth/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get navigation items based on user role
  // Update the getNavItems() function:

  const getNavItems = () => {
    if (!user) return [];

    const isHR = isHRAdmin(user);
    const isMgr = isManager(user);
    const isRegularEmployee = !isHR && !isMgr;

    if (isRegularEmployee) {
      return [
        { href: '/performance/employeeDashboard', label: 'Dashboard', icon: <Home size={20} /> },
        { href: '/performance/reviews', label: 'My Reviews', icon: <FileText size={20} /> },
        { href: '/performance/employeeDisputes', label: 'My Disputes', icon: <AlertCircle size={20} /> },
      ];
    }

    if (isMgr && !isHR) {
      return [
        { href: '/performance/assignments', label: 'Evaluations', icon: <FileText size={20} /> },
        { href: '/performance/team', label: 'Team', icon: <Users size={20} /> },
      ];
    }

    // HR Admin
    return [
      { href: '/performance/adminDashboard', label: 'Dashboard', icon: <Home size={20} /> },
      { href: '/performance/templates', label: 'Templates', icon: <FileText size={20} /> },
      { href: '/performance/cycles', label: 'Cycles', icon: <Users size={20} /> },
      { href: '/performance/adminDisputes', label: 'Disputes', icon: <AlertCircle size={20} /> },
      { href: '/performance/analytics', label: 'Analytics', icon: <BarChart size={20} /> },
    ];
  };

  const isActive = (path: string) => pathname?.startsWith(path);

  const navItems = getNavItems();
  const userName = user?.email?.split('@')[0] || 'User';
  const userRole = user?.roles?.[0] || user?.userType || 'Employee';

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden mr-3"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/performance" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-md">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800 hidden sm:inline">
                  Performance
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/home" 
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Link>
              
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <div className="bg-gray-100 p-2 rounded-full">
                  <UserIcon size={16} className="text-gray-600" />
                </div>
                <div className="text-right">
                  <p className="font-medium">{userName}</p>
                  <p className="text-gray-500 text-xs">{userRole}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t py-3">
              <div className="flex flex-col space-y-2">
                <Link
                  href="/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Home</span>
                </Link>
                
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                <div className="flex items-center justify-between px-3 py-2 border-t mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <UserIcon size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{userName}</p>
                      <p className="text-gray-500 text-xs">{userRole}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}