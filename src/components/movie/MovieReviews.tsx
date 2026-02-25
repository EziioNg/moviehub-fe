"use client";

import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  total: number;
}

interface MovieReviewsProps {
  movieId: string;
  averageRating?: number;
  totalReviews?: number;
}

export default function MovieReviews({
  movieId,
  averageRating = 8.5,
  totalReviews = 1234,
}: MovieReviewsProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: "1",
      author: "John Doe",
      rating: 9,
      date: "2024-01-15",
      content:
        "Absolutely mind-blowing! The cinematography and storyline are exceptional. Nolan at his finest.",
      helpful: 234,
      total: 245,
    },
    {
      id: "2",
      author: "Sarah Smith",
      rating: 8,
      date: "2024-01-10",
      content:
        "Great movie with complex plot. Might need to watch twice to fully understand everything.",
      helpful: 156,
      total: 178,
    },
    {
      id: "3",
      author: "Mike Johnson",
      rating: 10,
      date: "2024-01-08",
      content:
        "A masterpiece! The acting, direction, and music all come together perfectly.",
      helpful: 89,
      total: 92,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating / 2)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <section className="py-12 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Reviews Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reviews
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(averageRating * 2)}
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {averageRating}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({totalReviews.toLocaleString()} reviews)
              </span>
            </div>
          </div>

          <button className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {(showAllReviews ? reviews : reviews.slice(0, 2)).map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {review.author}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          {renderStars(review.rating * 2)}
                        </div>
                        <span>•</span>
                        <span>
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {review.content}
                  </p>

                  {/* Helpful Buttons */}
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">
                        Helpful ({review.helpful})
                      </span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">
                        Not Helpful ({review.total - review.helpful})
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {reviews.length > 2 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {showAllReviews
                ? "Show Less"
                : `Show All ${reviews.length} Reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
