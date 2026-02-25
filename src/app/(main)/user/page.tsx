"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bookmark,
  PlayCircle,
  History,
  Settings,
  User,
  LogOut,
  Home,
  Film,
} from "lucide-react";
import { getUserBookmarks } from "@/lib/api";

// Define movie interface for bookmarks
interface BookmarkMovie {
  _id: string;
  title: string;
  movieImage: string;
  year?: number;
  rating?: number;
  genre?: string[];
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("bookmarks");
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const menuItems = [
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: Bookmark,
      href: "/user?tab=bookmarks",
    },
    {
      id: "continue",
      label: "Continue Watching",
      icon: PlayCircle,
      href: "/user?tab=continue",
    },
    {
      id: "history",
      label: "Watch History",
      icon: History,
      href: "/user?tab=history",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/user?tab=settings",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "bookmarks":
        return <BookmarksContent />;
      case "continue":
        return <ContinueWatchingContent />;
      case "history":
        return <WatchHistoryContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <BookmarksContent />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-800 transition-colors duration-200">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-200 dark:bg-slate-700 min-h-screen border-r border-slate-300 dark:border-slate-600 transition-colors duration-200">
          {/* User Profile */}
          <div className="p-6 border-b border-slate-300 dark:border-slate-600 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
                }
                alt={user?.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white transition-colors duration-200">
                  {user?.username}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 capitalize transition-colors duration-200">
                  {user?.role}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 transition-colors duration-200">
                  {user?.email}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 transition-colors duration-200">
                  Member since{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-red-600 text-white"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-slate-300 dark:border-slate-600 space-y-2 transition-colors duration-200">
              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors duration-200"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
}

function BookmarksContent() {
  const [bookmarks, setBookmarks] = useState<BookmarkMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const response = await getUserBookmarks(user._id);
        setBookmarks(response || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load bookmarks",
        );
        addToast("Failed to load bookmarks", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user?._id, addToast]);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white transition-colors duration-200">
          My Bookmarks
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-300 dark:bg-slate-600 h-64 rounded-lg mb-3 transition-colors duration-200" />
              <div className="bg-slate-300 dark:bg-slate-600 h-4 rounded transition-colors duration-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white transition-colors duration-200">
          My Bookmarks
        </h2>
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4 transition-colors duration-200">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white transition-colors duration-200">
        My Bookmarks
      </h2>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 transition-colors duration-200">
            No bookmarks yet. Start adding movies to your bookmarks!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark._id}
              className="cursor-pointer group"
              onClick={() => router.push(`/movie/${bookmark._id}`)}
            >
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img
                  src={bookmark.movieImage}
                  alt={bookmark.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
              <h3 className="font-medium text-slate-900 dark:text-white transition-colors duration-200 group-hover:text-red-600 dark:group-hover:text-red-400">
                {bookmark.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-200">
                {bookmark.year}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContinueWatchingContent() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white transition-colors duration-200">
        Continue Watching
      </h2>
      <div className="text-center py-12">
        <Film className="w-16 h-16 text-slate-500 dark:text-slate-400 mx-auto mb-4 transition-colors duration-200" />
        <p className="text-slate-600 dark:text-slate-400 transition-colors duration-200">
          No movies in progress
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 transition-colors duration-200 mt-2">
          Start watching a movie to see it here
        </p>
      </div>
    </div>
  );
}

function WatchHistoryContent() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white transition-colors duration-200">
        Watch History
      </h2>
      <div className="text-center py-12">
        <History className="w-16 h-16 text-slate-500 dark:text-slate-400 mx-auto mb-4 transition-colors duration-200" />
        <p className="text-slate-600 dark:text-slate-400 transition-colors duration-200">
          No watch history yet
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 transition-colors duration-200 mt-2">
          Movies you watch will appear here
        </p>
      </div>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white transition-colors duration-200">
        Settings
      </h2>
      <div className="text-center py-12">
        <Settings className="w-16 h-16 text-slate-500 dark:text-slate-400 mx-auto mb-4 transition-colors duration-200" />
        <p className="text-slate-600 dark:text-slate-400 transition-colors duration-200">
          Settings coming soon
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 transition-colors duration-200 mt-2">
          Manage your account preferences here
        </p>
      </div>
    </div>
  );
}
