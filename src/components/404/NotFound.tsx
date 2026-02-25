"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

interface NotFoundProps {
  // Add any props if needed in the future
}

export default function NotFound({}: NotFoundProps = {}) {
  const router = useRouter();

  const handleGoHome = (): void => {
    router.push("/");
  };

  const handleGoBack = (): void => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC44Ii8+Cjwvc3ZnPgo=')] bg-repeat animate-pulse"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* 404 Text with animation */}
        <div className="relative mb-8">
          <h1
            className="text-9xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent animate-pulse"
            role="heading"
            aria-level={1}
          >
            404
          </h1>
          <div
            className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full animate-bounce"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
            aria-hidden="true"
          />
        </div>

        {/* Message */}
        <div className="text-center mb-12 max-w-md">
          <h2 className="text-2xl font-semibold mb-4">
            Lost in{" "}
            <span className="relative">
              <span className="text-yellow-400 font-bold">SPACE</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-full"></span>
            </span>
            ?
          </h2>
          <p className="text-gray-300 mb-2">
            Hmm, looks like that page doesn&apos;t exist.
          </p>
          <p className="text-sm text-gray-400">
            The movie you&apos;re looking for has drifted into the void...
          </p>
        </div>

        {/* Astronaut and Planet Illustration */}
        <div
          className="relative w-80 h-80 mb-12"
          role="img"
          aria-label="Astronaut floating in space near a planet"
        >
          {/* Planet */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-2xl relative">
              <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
              <div
                className="absolute top-8 left-8 w-8 h-8 bg-blue-400 rounded-full opacity-50"
                aria-hidden="true"
              ></div>
              <div
                className="absolute bottom-12 right-10 w-6 h-6 bg-purple-400 rounded-full opacity-50"
                aria-hidden="true"
              ></div>
            </div>
          </div>

          {/* Astronaut */}
          <div
            className="absolute top-8 right-8 w-16 h-16 bg-white rounded-full shadow-lg animate-spin"
            style={{ animationDuration: "8s" }}
            aria-hidden="true"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
            </div>
          </div>

          {/* Orbit ring */}
          <div
            className="absolute inset-0 border-2 border-gray-600 border-dashed rounded-full animate-spin"
            style={{ animationDuration: "20s" }}
            aria-hidden="true"
          ></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Go to home page"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </button>
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Additional floating elements */}
        <div
          className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
          aria-hidden="true"
        />
        <div
          className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-40 left-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-20 right-10 w-4 h-4 bg-red-400 rounded-full animate-pulse"
          style={{ animationDelay: "3s" }}
          aria-hidden="true"
        />
      </div>

      {/* Shooting star animation */}
      <div
        className="absolute top-20 right-10 w-1 h-1 bg-white rounded-full animate-ping"
        style={{ animationDuration: "3s" }}
        aria-hidden="true"
      />
    </div>
  );
}
