'use client';

import Link from 'next/link';
import { ArrowLeft, Star, MessageCircle, MapPin, Check } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const reviews = [
  {
    name: 'Sarah M.',
    date: 'January 2025',
    rating: 5,
    text: 'Excellent service! Ranchie was waiting for us at the airport even though our flight was delayed. Very professional and knows all the best routes. The car was clean and comfortable. Highly recommend!',
    route: 'Airport to Villa Beach'
  },
  {
    name: 'Michael R.',
    date: 'January 2025',
    rating: 5,
    text: 'Best taxi service in SVG! Always on time and fair prices. Ranchie gave us great recommendations for restaurants and beaches. We used his service throughout our vacation.',
    route: 'Multiple trips around the island'
  },
  {
    name: 'Lisa T.',
    date: 'December 2024',
    rating: 5,
    text: "Very reliable service. I use Ranchie Taxi for all my business trips to Kingstown. Always arrives early and gets me there safely. Couldn't ask for better service!",
    route: 'Arnos Vale to Kingstown'
  },
  {
    name: 'David & Emma',
    date: 'December 2024',
    rating: 5,
    text: 'Fantastic island tour! Ranchie showed us hidden gems we would never have found on our own. His knowledge of local history and culture made the trip extra special. 10/10!',
    route: 'Full Island Tour'
  },
  {
    name: 'Jennifer K.',
    date: 'November 2024',
    rating: 5,
    text: 'Safe, punctual, and friendly service. As a solo female traveler, I felt completely safe. Ranchie was professional and respectful. Will definitely use again on my next visit!',
    route: 'Bequia Ferry to Hotel'
  }
];

export default function ReviewsPage() {
  const averageRating = 4.8;
  const totalReviews = 127;

  return (
    <>
      <div 
        className="min-h-screen pb-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.45)), url('/images/reviews.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link 
              href="/" 
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <img 
              src="https://i.postimg.cc/N0tzBQTm/Screenshot-20250725-221145-Canva.jpg"
              alt="Ranchie Taxi"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <h1 className="text-xl font-bold font-serif flex-1 text-gray-900">Customer Reviews</h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Rating Summary */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm mb-6">
            <div className="text-5xl font-bold mb-2 text-gray-900">{averageRating}</div>
            <div className="flex justify-center gap-1 mb-3">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600">Based on {totalReviews} reviews</p>
          </div>

          {/* Google Reviews Link */}
          <a 
            href="https://www.google.com/search?q=Ranchie+Taxi+SVG"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl p-6 shadow-sm mb-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">See Our Google Reviews</h3>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">5.0 on Google</span>
                </div>
              </div>
              <ArrowLeft className="rotate-180 text-gray-400" size={20} />
            </div>
          </a>

          {/* Leave Review Section */}
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white text-center mb-8">
            <h2 className="text-xl font-semibold mb-2">Share Your Experience</h2>
            <p className="text-sm opacity-90 mb-5">Help others by sharing your ride experience</p>
            <div className="grid grid-cols-2 gap-3">
              
                <a href="https://wa.me/17844932354?text=Hi%20Ranchie%20Taxi!%20I'd%20like%20to%20leave%20a%20review%20about%20my%20recent%20ride."
                className="bg-white text-green-600 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </a> 
              
                <a href="https://www.google.com/search?q=Ranchie+Taxi+SVG"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-green-600 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Star size={18} />
                <span>Google</span>
              </a>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-5 text-center mb-6">
            <div className="text-3xl mb-2">✓</div>
            <h3 className="text-lg font-semibold text-green-800 mb-1">Verified Service</h3>
            <p className="text-sm text-green-700">All reviews are from real customers</p>
          </div>

          {/* Reviews List */}
          <div className="mb-6">
           <h2 className="text-xl font-bold text-gray-900 mb-5">Recent Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.name}</h3>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 text-sm leading-relaxed">{review.text}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin size={14} />
                    <span>{review.route}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-semibold mb-2">Need a Ride?</h2>
            <p className="text-sm opacity-90 mb-5">Experience our 5-star service yourself!</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/booking"
                className="bg-white text-orange-600 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <span>Book Now</span>
              </Link>
              <a
                href="tel:1784-493-2354"
                className="bg-white text-orange-600 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <span>Call Direct</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}