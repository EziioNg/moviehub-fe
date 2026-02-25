"use client";

import { useState } from "react";
import {
  ChevronDown,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
} from "lucide-react";

interface FooterLink {
  label: string;
  href?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  const [selectedCountry, setSelectedCountry] = useState("🇺🇸 US");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const countries = [
    "🇺🇸 US",
    "🇬🇧 GB",
    "🇫🇷 FR",
    "🇩🇪 DE",
    "🇮🇹 IT",
    "🇵🇹 PT",
    "🇪🇸 ES",
  ];

  const footerSections: FooterSection[] = [
    {
      title: "Company",
      links: [
        { label: "About" },
        { label: "Careers" },
        { label: "Our Culture" },
        { label: "Giving" },
        { label: "Press Room" },
        { label: "Partners" },
        { label: "Plex Gear" },
        { label: "The Plex Blog" },
        { label: "Advertise with Us" },
      ],
    },
    {
      title: "Go Premium",
      links: [
        { label: "Plans" },
        { label: "Plex Labs" },
        { label: "Get Perks" },
      ],
    },
    {
      title: "Downloads",
      links: [
        { label: "Plex Media Server" },
        { label: "Plex" },
        { label: "Plexamp" },
        { label: "Plex Photos" },
        { label: "Plex Dash" },
        { label: "Where to Watch" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Finding Help" },
        { label: "Support Library" },
        { label: "Community Forums" },
        { label: "Community Guidelines" },
        { label: "Billing Questions" },
        { label: "Status" },
        { label: "Bug Bounty" },
        { label: "CordCutter" },
        { label: "Get in Touch" },
      ],
    },
    {
      title: "Watch Free",
      links: [
        { label: "Discover on Plex" },
        { label: "TV Channel Finder" },
        { label: "What to Watch" },
        { label: "What to Watch on Netflix" },
        { label: "What to Watch on Hulu" },
        { label: "A24 collection" },
        { label: "Movies Database" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, label: "Instagram" },
    { icon: Facebook, label: "Facebook" },
    { icon: Twitter, label: "Twitter" },
    { icon: Linkedin, label: "LinkedIn" },
    { icon: Youtube, label: "YouTube" },
  ];

  return (
    <footer
      className={`${className} text-gray-600 dark:text-gray-300 transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Logo and Country Selector */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-start space-y-4">
              <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>

              {/* Simple Country Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="text-gray-900 dark:text-white">
                    {selectedCountry}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""} text-gray-900 dark:text-white`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute bottom-full mb-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
                    {countries.map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-900 dark:text-white"
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-gray-900 dark:text-white font-semibold">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href || "#"}
                      className="text-sm hover:text-red-600 dark:hover:text-red-500 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {" "}
                2025 Movie Streaming App
              </span>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                Privacy & Legal
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                Ad Choices
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                Accessibility
              </a>
              <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition-colors">
                Manage Cookies
              </button>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <social.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
