"use client";

import { useRouter } from "next/navigation";
import { Construction, Clock, ArrowLeft, Mail } from "lucide-react";

export default function UnavailablePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-200 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 md:px-8 lg:px-16 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-6 rounded-full">
              <Construction className="w-16 h-16 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-2 rounded-full animate-pulse">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Page Under Development
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          This feature is currently being built and will be available soon!
        </p>

        {/* Description */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            What's happening here?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Our team is working hard to bring you this amazing feature. We're
            adding the final touches to ensure you get the best experience
            possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Development in progress</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Testing phase</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Coming soon</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <span>Home Page</span>
          </button>
        </div>

        {/* Contact Info */}
        {/* <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="text-sm">
              Questions? Contact us at{" "}
              <a
                href="mailto:support@moviehub.com"
                className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
              >
                support@moviehub.com
              </a>
            </span>
          </div>
        </div> */}

        {/* Footer Note */}
        <div className="mt-8 text-xs text-gray-500 dark:text-gray-500">
          <p>
            Thank you for your patience! We're excited to share this feature
            with you soon.
          </p>
        </div>
      </div>
    </div>
  );
}
