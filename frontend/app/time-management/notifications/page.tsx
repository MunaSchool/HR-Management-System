"use client";

import { useAuth } from "@/app/(system)/context/authContext";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface Notification {
  _id: string;
  type: string;
  message: string;
}

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function getUserNotifs() {
      try {
        const res = await axios.get<{ message: string; data: Notification[] }>(
          `http://localhost:4000/time-management/notification-log/employee/${user?.userid}`,
          { withCredentials: true }
        );
        setNotifications(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getUserNotifs();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">No notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/time-management"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              &larr; Back to Dashboard
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Notifications 🔔
            </h2>
            <Link href="./notifications/send">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Send
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
  href="/time-management/clock-in-out"
  className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer block"
>
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
    Clock In / Clock Out
  </h3>
  <p className="text-gray-600 dark:text-gray-400">
    Record your daily working hours
  </p>
</Link>

            {notifications.map((notif) => (
              <DashboardCard
                key={notif._id}
                title={notif.type}
                description={notif.message}
                link={`./notifications/${notif._id}`}
              />

              
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer block"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 truncate">{description}</p>
    </Link>
    
  );
}
