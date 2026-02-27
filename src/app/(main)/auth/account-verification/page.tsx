"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Film } from "lucide-react";
import { verifyEmail } from "@/lib/api";

export default function VerificationPage() {
  const searchParams = useSearchParams();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const hasVerified = useRef(false);
  useEffect(() => {
    if (email && token && !hasVerified.current) {
      hasVerified.current = true;
      verifyAccount();
    }
  }, [email, token]);

  const verifyAccount = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await verifyEmail({ email, token });
      // console.log("response from verification: ", response);

      if (response) {
        setVerified(true);
      } else {
        setError(
          response.data?.message || "Verification failed. Please try again.",
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If missing email or token, show 404
  if (!email || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Film className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">
              404 - Page Not Found
            </h1>
            <p className="text-gray-300 mb-6">
              Invalid verification link. Please check your email and try again.
            </p>
            <Link
              href="/auth/register"
              className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Back to Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="w-16 h-16 bg-red-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-3xl font-bold text-white mb-4">Verifying...</h1>
            <p className="text-gray-300">
              Please wait while we verify your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 9"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Email Verified!
            </h1>
            <p className="text-gray-300 mb-6">
              Your email{" "}
              <span className="text-green-400 font-semibold">{email}</span> has
              been successfully verified.
            </p>
            <p className="text-gray-400 mb-6">
              You can now log in to your account.
            </p>
            <Link
              href={`/auth/login?verifiedEmail=${encodeURIComponent(email)}`}
              className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l6 6"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Verification Failed
            </h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="space-y-4">
              <Link
                href="/auth/register"
                className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Back to Register
              </Link>
              <Link
                href="/auth/login"
                className="bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Try Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial state - show verification prompt
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-black flex items-center justify-center p-4">
      <div className="text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <Film className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Verify Your Email
          </h1>
          <p className="text-gray-300 mb-6">
            Click the button below to verify your email address:
          </p>
          <p className="text-gray-400 mb-6">
            <span className="text-red-400 font-semibold">{email}</span>
          </p>
          <button
            onClick={verifyAccount}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify Email"
            )}
          </button>
          <div className="mt-6 text-center">
            <Link
              href="/auth/register"
              className="text-gray-400 hover:text-red-300 transition-colors"
            >
              Back to Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
