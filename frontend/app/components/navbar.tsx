"use client"
import { useAuth } from "../(system)/context/authContext"

export default function Navbar(){
    const {user,logout} = useAuth()
      const handleLogout = async () => {
    await logout();
  };
  if(!user){
    return(
        <> Loading ...</>
    )
  }

    return(
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                HR Management System
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300">
                Welcome, {user.name || user.email}
              </span>
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
    )
}