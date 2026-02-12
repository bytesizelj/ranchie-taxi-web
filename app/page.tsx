'use client';

import Link from 'next/link';
import { Phone, MessageCircle, X, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCard, setShowCard] = useState(false);

  const handleRideNow = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  useEffect(() => {
    // Show at 3 seconds
    const timer1 = setTimeout(() => setShowCard(true), 3000);
    
    // Start the cycle at 6 seconds
    const timer2 = setTimeout(() => {
      setShowCard(false);
      
      // Repeat: show for 3s, hide for 4s
      const interval = setInterval(() => {
        setShowCard(true);
        setTimeout(() => setShowCard(false), 3000);
      }, 7000); // 3s visible + 4s hidden = 7s cycle
      
      // Store interval for cleanup
      (window as any).cardInterval = interval;
    }, 6000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if ((window as any).cardInterval) {
        clearInterval((window as any).cardInterval);
      }
    };
  }, []);

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
        
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Hero Section with Background */}
      <div className="min-h-screen flex items-center justify-center p-5 pb-20 relative overflow-hidden">
        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/ranchie-taxi-award.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-24 right-4 z-30 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
        >
          {isMuted ? <VolumeX size={24} className="text-gray-700" /> : <Volume2 size={24} className="text-green-600" />}
        </button>
        {/* Main Card */}
        <div 
          className={`bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full relative z-20 transition-all duration-700 ${
            showCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
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
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-green-500 hover:bg-green-50 hover:-translate-y-0.5 hover:shadow-lg block"
            >
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="text-lg font-semibold mb-1">Ride Now</h3>
              <p className="text-sm text-gray-600">Instant pickup</p>
            </button>

            <Link
              href="/booking"
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-green-500 hover:bg-green-50 hover:-translate-y-0.5 hover:shadow-lg block"
            >
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-lg font-semibold mb-1">Schedule</h3>
              <p className="text-sm text-gray-600">Book in advance</p>
            </Link>
          </div>

          {/* Airport Transfer Promo */}
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-4 mb-6">
            <p className="text-white text-center text-sm font-bold mb-2">✈️ Airport Transfer Special</p>
            <div className="flex justify-between items-center bg-white/20 rounded-xl p-3 mb-2">
              <span className="text-white text-sm">AIA → Sandals (1-2 persons)</span>
              <span className="text-white font-bold">US$65</span>
            </div>
            <div className="flex justify-between items-center bg-white/20 rounded-xl p-3">
              <span className="text-white text-sm">AIA → Sandals (3+ persons)</span>
              <span className="text-white font-bold">US$30<span className="text-xs font-normal">/pp</span></span>
            </div>
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
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          style={{
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full relative"
            style={{
              animation: 'scaleIn 0.3s ease'
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚕</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Need a Ride Now?</h3>
              <p className="text-gray-600">Choose how to contact Ranchie Taxi</p>
            </div>
            
            {/* Contact Options */}
            <div className="space-y-3">
              <a
                href="https://wa.me/17844932354?text=Hi%20Ranchie%20Taxi!%20I%20need%20a%20ride%20now.%20My%20pickup%20location%20is:%20"
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <MessageCircle size={20} />
                <span>Book via WhatsApp</span>
              </a>
              
              <a
                href="tel:1784-493-2354"
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Phone size={20} />
                <span>Call Directly</span>
              </a>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <Link
                href="/booking"
                onClick={closeModal}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold transition-all hover:bg-gray-200"
              >
                <span>Fill Booking Form</span>
              </Link>
            </div>

            {/* Quick Info */}
            <div className="mt-6 p-4 bg-orange-50 rounded-xl">
              <p className="text-sm text-orange-800 text-center">
                <span className="font-semibold">Quick Tip:</span> For immediate pickup, calling or WhatsApp is fastest!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}