"use client";

import Link from "next/link";
import { useAuth } from "@/app/(system)/context/authContext";

export default function Navbar({ onCreateUser }: { onCreateUser?: () => void }) {
  const { user, logout } = useAuth();

  const isHRAdmin = user?.roles?.some(role =>
    role === "HR Admin" || role === "System Admin"
  );

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo – Click to go to /home */}
          <Link href="/home">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:opacity-80 transition">
              HR Management System
            </h1>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Profile Button */}
            <Link href="/profile">
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                Profile
              </button>
            </Link>

            {/* Create User – HR Admin Only */}
            {isHRAdmin && onCreateUser && (
              <button
                onClick={onCreateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create User
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
