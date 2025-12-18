"use client";

import { useAuth } from "../(system)/context/authContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  const goHome = () => {
    router.push("/home");
  };

  if (!user) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  const displayName = user.firstName ? user.firstName : user.email;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              HR Management System
            </h1>

            <button
              onClick={goHome}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            >
              🏠 Home
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300">
              Welcome, {displayName}
            </span>

            <button
              onClick={goToProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              My Profile
            </button>

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
