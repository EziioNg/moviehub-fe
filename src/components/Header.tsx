"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  User,
  ChevronDown,
  Film,
  Tv,
  HomeIcon,
  Book,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBox from "@/components/SearchBox";
import { categoriesCache } from "@/lib/categoriesCache";

interface HeaderProps {
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  hasDropdown?: boolean;
  dropdownContent?: React.ReactNode;
}

export default function Header({ className }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const { user } = useAuth();

  // Define category interface
  interface Category {
    _id: string;
    name: string;
  }

  // Scroll effect
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 20;
      setScrolled(isScrolled);
      lastScrollY = currentScrollY;
    };

    // Add scroll listener with options for better performance
    const scrollOptions = { passive: true, capture: false };
    window.addEventListener("scroll", handleScroll, scrollOptions);

    // Check initial scroll state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll, scrollOptions);
    };
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use cache instead of direct API call
        const categoriesData = await categoriesCache.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Dropdown content components
  const genresDropdown = (
    <div className="py-4">
      <div className="grid grid-cols-3 gap-4 px-4">
        {categories.slice(0, 6).map((category, index) => (
          <button
            key={index}
            onClick={() =>
              router.push(
                `/category/${category.name === "Feature" ? "featured" : category.name.toLowerCase()}`,
              )
            }
            className="text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {category.name === "Feature" ? "Featured" : category.name}
            </div>
          </button>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-600 mt-4 pt-4 px-4">
        <button
          // onClick={() => router.push("/movies")}
          onClick={() => router.push("/category/featured")}
          className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
        >
          Browse All Genres →
        </button>
      </div>
    </div>
  );

  const navItems: NavItem[] = [
    { name: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    {
      name: "Movies",
      href: "/movies",
      hasDropdown: true,
      dropdownContent: genresDropdown,
      icon: <Film className="w-4 h-4" />,
    },
    {
      name: "TV Shows",
      href: "/unavailable",
      icon: <Tv className="w-4 h-4" />,
    },
    {
      name: "Watchlist",
      href: "/unavailable",
      icon: <Book className="w-4 h-4" />,
    },
  ];

  const handleDropdownEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(itemName);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleDropdownContentEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
  };

  return (
    <>
      <header
        className={`
          ${className} 
          fixed top-0 left-0 right-0 z-50 
          transition-all duration-300 ease-in-out
          ${
            scrolled
              ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-gray-200/50 dark:border-slate-700/50"
              : "bg-white dark:bg-slate-900 shadow-sm"
          }
        `}
      >
        <div className="px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors md:hidden"
              >
                <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>

              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  MovieHub
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() =>
                      item.hasDropdown && handleDropdownEnter(item.name)
                    }
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() =>
                        !item.hasDropdown && router.push(item.href)
                      }
                      className="flex items-center space-x-2 text-gray-900 dark:text-white font-medium hover:text-red-600 dark:hover:text-red-500 transition-colors py-2"
                    >
                      {item.icon && (
                        <span className="flex-shrink-0">{item.icon}</span>
                      )}
                      <span>{item.name}</span>
                      {item.hasDropdown && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  </div>
                ))}
              </nav>
            </div>

            {/* Right side - Search, Theme Toggle, and Profile */}
            <div className="flex items-center space-x-4">
              {/* Search Box - Desktop */}
              <div className="hidden md:block w-64">
                <SearchBox placeholder="Search movies, shows..." />
              </div>

              {/* Mobile Search Button */}
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors md:hidden">
                <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              <button
                onClick={() => {
                  if (user) {
                    router.push("/user");
                  } else {
                    router.push("/auth/login");
                  }
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <User className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Overlays */}
        <AnimatePresence mode="wait">
          {activeDropdown && (
            <motion.div
              key={activeDropdown}
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
                scale: { type: "spring", stiffness: 300, damping: 25 },
              }}
              className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 shadow-xl border-t border-gray-200 dark:border-gray-700"
              onMouseEnter={handleDropdownContentEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.15 }}
              >
                {
                  navItems.find((item) => item.name === activeDropdown)
                    ?.dropdownContent
                }
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 shadow-xl"
            >
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-8">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <Film className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    MovieHub
                  </span>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        router.push(item.href);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-900 dark:text-white font-medium flex items-center space-x-3"
                    >
                      {item.icon && (
                        <span className="flex-shrink-0">{item.icon}</span>
                      )}
                      <span>{item.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
