"use client"
import { useAuth } from "../(system)/context/authContext"
import { usePathname } from "next/navigation"

export default function Navbar(){
    const {user,logout} = useAuth()
    const pathname = usePathname()
    
    const handleLogout = async () => {
      await logout();
    };
    
    // Don't show navbar on login/register pages or home (home has its own header)
    if (pathname === "/login" || pathname === "/register" || pathname === "/home") {
      return null;
    }
    
    if(!user){
      return null;
    }

    return(
      <nav className="bg-slate-900/90 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-slate-100">
                HR Management System
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-200">
                Welcome, {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
}