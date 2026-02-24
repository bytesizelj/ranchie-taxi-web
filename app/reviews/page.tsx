'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, MessageCircle, MapPin, Quote, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const googleReviews = [
  {
    name: 'Michael Hall',
    date: 'February 2026',
    rating: 5,
    text: 'Excellent experience. He turned up in good time, greeted us pleasantly and loaded our luggage into the vehicle for us. He drove carefully to the ferry terminal and assisted us in finding the right ferry. The vehicle was clean and comfortable. Would definitely use again.',
    route: 'Ferry Terminal Transfer',
    verified: true,
  },
  {
    name: 'Maggie Bahraini',
    date: 'September 2025',
    rating: 5,
    text: 'Ranchie has been my driver for a while now. He is trustworthy, efficient, always on time, and a very kind caring man. Considering other drivers I have had, he is truly one of the best. Thank you Ranchie!',
    route: 'Regular Client',
    verified: true,
  },
  {
    name: 'Ghasi Phillips-Bell',
    date: 'September 2025',
    rating: 5,
    text: 'Ranchie has provided exceptional taxi services to my family for years. He is reliable, trustworthy, and responsible. If he is not available, he will try to connect you with another trustworthy driver. And my kids love him!',
    route: 'Family Service',
    verified: true,
  },
];

const otherReviews = [
  {
    name: 'Sarah M.',
    date: 'January 2025',
    rating: 5,
    text: 'Excellent service! Ranchie was waiting for us at the airport even though our flight was delayed. Very professional and knows all the best routes. The car was clean and comfortable. Highly recommend!',
    route: 'Airport to Villa Beach',
  },
  {
    name: 'Michael R.',
    date: 'January 2025',
    rating: 5,
    text: 'Best taxi service in SVG! Always on time and fair prices. Ranchie gave us great recommendations for restaurants and beaches. We used his service throughout our vacation.',
    route: 'Multiple trips around the island',
  },
  {
    name: 'Lisa T.',
    date: 'December 2024',
    rating: 5,
    text: "Very reliable service. I use Ranchie Taxi for all my business trips to Kingstown. Always arrives early and gets me there safely. Couldn't ask for better service!",
    route: 'Arnos Vale to Kingstown',
  },
  {
    name: 'David & Emma',
    date: 'December 2024',
    rating: 5,
    text: 'Fantastic island tour! Ranchie showed us hidden gems we would never have found on our own. His knowledge of local history and culture made the trip extra special. 10/10!',
    route: 'Full Island Tour',
  },
  {
    name: 'Jennifer K.',
    date: 'November 2024',
    rating: 5,
    text: 'Safe, punctual, and friendly service. As a solo female traveler, I felt completely safe. Ranchie was professional and respectful. Will definitely use again on my next visit!',
    route: 'Bequia Ferry to Hotel',
  },
];

export default function ReviewsPage() {
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const nextFeatured = () => setFeaturedIndex((prev) => (prev + 1) % googleReviews.length);
  const prevFeatured = () => setFeaturedIndex((prev) => (prev - 1 + googleReviews.length) % googleReviews.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % googleReviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div
        className="min-h-screen pb-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.65)), url('/images/reviews.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-extrabold flex-1 text-black">
              Customer <span className="text-orange-600">Reviews</span>
            </h1>
            <a
              href="tel:17844932354"
              className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 hover:bg-orange-100 transition-colors"
            >
              <Phone size={18} />
            </a>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-6">

          {/* Rating Hero */}
          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-6 text-center shadow-lg mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8" />
            <div className="relative z-10">
              <div className="text-6xl font-extrabold text-white mb-1">5.0</div>
              <div className="flex justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-7 h-7 fill-yellow-300 text-yellow-300" />
                ))}
              </div>
              <p className="text-white font-medium text-sm">Based on 13 Google Reviews</p>
              <div className="mt-4 flex justify-center gap-3">
                <a
                  href="https://g.page/r/CWuUlZeIXcgNEAE/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-orange-600 px-5 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                >
                  Leave a Review
                </a>
              </div>
            </div>
          </div>

          {/* Featured Google Reviews Carousel */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-900">Google Reviews</h2>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <Quote size={28} className="text-orange-300 mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(googleReviews[featuredIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-black font-semibold leading-relaxed mb-5 text-sm min-h-[80px]">
                  &ldquo;{googleReviews[featuredIndex].text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold">{googleReviews[featuredIndex].name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-bold text-black text-sm">{googleReviews[featuredIndex].name}</div>
                      <div className="text-xs text-gray-700 flex items-center gap-1">
                        <span>{googleReviews[featuredIndex].date}</span>
                        <span className="text-green-600 font-semibold flex items-center gap-0.5">
                          &bull; Verified
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                    <MapPin size={12} />
                    <span>{googleReviews[featuredIndex].route}</span>
                  </div>
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center gap-2 mt-5">
                  {googleReviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setFeaturedIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === featuredIndex ? 'bg-orange-500 w-5' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Arrows */}
              <button
                onClick={prevFeatured}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              <button
                onClick={nextFeatured}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Share Your Experience */}
          <div className="bg-white rounded-3xl p-5 shadow-sm mb-6">
            <h3 className="font-bold text-black mb-1">Share Your Experience</h3>
            <p className="text-xs text-gray-700 mb-4">Help others discover great service</p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://g.page/r/CWuUlZeIXcgNEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all text-sm"
              >
                <Star size={16} />
                <span>Google Review</span>
              </a>
              <a
                href="https://wa.me/17844932354?text=Hi%20Ranchie%20Taxi!%20I'd%20like%20to%20leave%20a%20review%20about%20my%20recent%20ride."
                className="bg-green-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all text-sm"
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* All Reviews */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">More Reviews</h2>
            <div className="space-y-3">
              {otherReviews.map((review, index) => (
                <div key={index} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-800 font-bold text-sm">{review.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-black text-sm">{review.name}</h3>
                        <p className="text-xs text-gray-900 font-semibold">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-900 text-sm leading-relaxed mb-2">{review.text}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                    <MapPin size={12} />
                    <span>{review.route}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-6 text-white text-center shadow-lg">
            <h2 className="text-xl font-bold mb-2">Ready for a 5-Star Ride?</h2>
            <p className="text-sm text-white mb-5">Experience the service everyone&apos;s talking about</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/booking"
                className="bg-white text-orange-600 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all text-sm"
              >
                Book Now
              </Link>
              <a
                href="tel:17844932354"
                className="bg-white/20 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition-all text-sm"
              >
                <Phone size={16} />
                Call Ranchie
              </a>
            </div>
          </div>

        </div>
      </div>

      <BottomNav />
    </>
  );
}