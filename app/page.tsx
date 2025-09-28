'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  const handleRideNow = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      {/* Hero Section with Background */}
      <div 
        className="min-h-screen flex items-center justify-center p-5 pb-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), 
                           url('https://i.postimg.cc/mDcKk8XG/Screenshot-2025-07-25-113844-20250725-130213-0000.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Main Card */}
        <div 
          className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full"
          style={{
            animation: 'slideUp 0.6s ease-out'
          }}
        >
          {/* Logo Section */}
          <div className="text-center mb-8">
            <img 
              src="https://i.postimg.cc/N0tzBQTm/Screenshot-20250725-221145-Canva.jpg"
              alt="Ranchie Taxi Logo"
              className="w-32 h-32 mx-auto mb-4 rounded-2xl shadow-lg"
            />
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 font-serif tracking-wide">
              Ranchie Taxi
            </h1>
            <p className="text-gray-600 italic font-serif tracking-wide">
              Saint Vincent & the Grenadines
            </p>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Your ride is here.</h2>
            <p className="text-gray-600 text-lg font-light">
              Reliable taxi service across paradise
            </p>
          </div>

          {/* Booking Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleRideNow}
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-green-500 hover:bg-green-50 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="text-lg font-semibold mb-1">Ride Now</h3>
              <p className="text-sm text-gray-600">Book instantly</p>
            </button>

            <Link
              href="/booking?schedule=true"
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-green-500 hover:bg-green-50 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-lg font-semibold mb-1">Schedule</h3>
              <p className="text-sm text-gray-600">Plan ahead</p>
            </Link>
          </div>

          {/* Contact Section */}
          <div className="text-center pt-6 border-t border-gray-200">
            <a
              href="tel:1784-493-2354"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Phone size={20} />
              <span>Call Now: 1784-493-2354</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Ride Now Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          style={{
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full"
            style={{
              animation: 'slideUp 0.3s ease'
            }}
          >
            <h3 className="text-2xl font-bold mb-4">Choose Contact Method</h3>
            <p className="text-gray-600 mb-6">How would you like to book your ride?</p>
            
            <div className="space-y-3">
              <a
                href="tel:1784-493-2354"
                className="flex items-center justify-center gap-2 bg-blue-500 text-white py-4 rounded-xl font-semibold transition-all hover:-translate-y-0.5 hover:bg-blue-600"
              >
                <Phone size={20} />
                <span>Call Now</span>
              </a>
              
              <a
                href="https://wa.me/17844932354?text=Hi%20Ranchie%20Taxi!%20I%20need%20a%20ride%20now."
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-xl font-semibold transition-all hover:-translate-y-0.5 hover:bg-green-600"
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </a>
              
              <button
                onClick={closeModal}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold transition-all hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}