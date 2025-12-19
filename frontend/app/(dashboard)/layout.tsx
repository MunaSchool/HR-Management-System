"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/employee-profile/me");
        setUser(response.data);
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      router.push("/login");
    } catch (error) {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const isHR = user?.systemRoles?.some(
    (role: any) => role.roleName === "HR_ADMIN" || role.roleName === "HR_MANAGER"
  );
  const isManager = user?.systemRoles?.some(
    (role: any) => role.roleName === "DEPARTMENT_HEAD"
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-800 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                href="/profile"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === "/profile"
                    ? "text-white border-b-2 border-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                My Profile
              </Link>
              {isManager && (
                <Link
                  href="/team"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === "/team"
                      ? "text-white border-b-2 border-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  My Team
                </Link>
              )}
              {isHR && (
                <>
                  <Link
                    href="/hr-admin"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      pathname === "/hr-admin"
                        ? "text-white border-b-2 border-white"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    HR Admin
                  </Link>
                  <Link
                    href="/change-requests"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      pathname === "/change-requests"
                        ? "text-white border-b-2 border-white"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Change Requests
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-400">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-neutral-400 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
