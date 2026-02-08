'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Phone, MessageCircle, MapPin, Calendar, Clock, Users, Sparkles, Car, CheckCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useSearchParams } from 'next/navigation';

export default function ConfirmationPageClient() {
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState({
    bookingId: '',
    name: '',
    pickup: '',
    destination: '',
    date: '',
    time: '',
    passengers: ''
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [bookingStatus, setBookingStatus] = useState('PROCESSING');

  useEffect(() => {
    // Generate booking ID
    const bookingId = `RT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    
    // Get booking details from URL params
    const name = searchParams?.get('name') || 'Guest';
    const pickup = searchParams?.get('pickup') || 'Argyle International Airport';
    const destination = searchParams?.get('destination') || 'Villa Beach';
    const date = searchParams?.get('date') || 'Today';
    const time = searchParams?.get('time') || 'ASAP';
    const passengers = searchParams?.get('passengers') || '2 passengers';

    setBookingDetails({
      bookingId,
      name,
      pickup,
      destination,
      date,
      time,
      passengers
    });

    // Trigger animations in sequence
    setTimeout(() => setShowConfetti(true), 500);
    setTimeout(() => setAnimationStep(1), 700);
    setTimeout(() => setAnimationStep(2), 1200);
    setTimeout(() => setAnimationStep(3), 1700);
    setTimeout(() => setBookingStatus('DRIVER RECEIVED BOOKING ✓'), 3000);
  }, [searchParams]);

  // Confetti component
  const Confetti = () => {
    if (!showConfetti) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div
              className={`w-2 h-2 ${
                ['bg-green-500', 'bg-yellow-400', 'bg-orange-500', 'bg-red-500', 'bg-blue-500', 'bg-purple-500'][
                  Math.floor(Math.random() * 6)
                ]
              } rounded-full`}
            />
          </div>
        ))}
      </div>
    );
  };

  // Animated background
  const AnimatedBackground = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-green-50/30 to-orange-50/30" />
      
      {/* Floating shapes */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 2}s`
            }}
          >
            <div
              className={`${
                i % 2 === 0 ? 'w-64 h-64' : 'w-48 h-48'
              } bg-gradient-to-br ${
                ['from-green-200/20 to-teal-300/20', 'from-orange-200/20 to-red-300/20', 'from-blue-200/20 to-purple-300/20'][i % 3]
              } rounded-full blur-3xl`}
            />
          </div>
        ))}
      </div>
      
      {/* Moving lines */}
      <svg className="absolute inset-0 w-full h-full">
        <line
          x1="0"
          y1="100%"
          x2="100%"
          y2="0"
          stroke="url(#gradient1)"
          strokeWidth="1"
          opacity="0.1"
          className="animate-drawLine"
        />
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="url(#gradient2)"
          strokeWidth="1"
          opacity="0.1"
          className="animate-drawLine2"
        />
        <defs>
          <linearGradient id="gradient1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="gradient2">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  return (
    <>
      <AnimatedBackground />
      <Confetti />
      
      <div className="min-h-screen pb-20 relative">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link 
              href="/" 
              className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center hover:from-gray-200 hover:to-gray-300 transition-all transform hover:scale-110"
            >
              <ArrowLeft size={20} />
            </Link>
            <img 
              src="https://i.postimg.cc/N0tzBQTm/Screenshot-20250725-221145-Canva.jpg"
              alt="Ranchie Taxi"
              className="w-10 h-10 rounded-lg object-cover shadow-md"
            />
            <h1 className="text-xl font-bold font-serif flex-1 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Booking Confirmed!
            </h1>
            <Sparkles className="text-yellow-500 animate-pulse" size={20} />
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Success Animation Card */}
          <div className={`bg-white rounded-3xl p-8 text-center shadow-2xl mb-6 transform transition-all duration-1000 ${
            animationStep >= 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}>
            <div className="relative">
              {/* Animated Success Icon */}
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-full animate-ping" />
                <CheckCircle size={50} className="text-white relative z-10 animate-bounceIn" />
              </div>
              
              {/* Animated Car Icon */}
              <div className="absolute -right-4 top-0 animate-driveIn">
                <Car className="text-orange-500" size={32} />
              </div>
            </div>
            
            <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent transform transition-all duration-700 ${
              animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              Booking Request Sent!
            </h2>
            
            <p className={`text-gray-600 text-lg transform transition-all duration-700 delay-200 ${
              animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              Your ride request has been sent to <span className="font-semibold text-orange-600">Ranchie Taxi</span> via WhatsApp.
            </p>
            
            <div className="mt-4 flex justify-center items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Driver will confirm shortly</span>
            </div>
          </div>

          {/* Booking Details with Staggered Animation */}
          <div className={`bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl mb-6 transform transition-all duration-700 delay-300 ${
            animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">Trip Details</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                bookingStatus === 'PROCESSING' 
                  ? 'bg-green-100 text-green-700 animate-pulse' 
                  : 'bg-green-500 text-white'
              }`}>
                {bookingStatus}
              </span>
            </div>
            
            <div className="space-y-3">
              {[
                { icon: MapPin, label: 'Pickup', value: bookingDetails.pickup, delay: '400' },
                { icon: MapPin, label: 'Destination', value: bookingDetails.destination, delay: '500' },
                { icon: Calendar, label: 'Date', value: bookingDetails.date, delay: '600' },
                { icon: Clock, label: 'Time', value: bookingDetails.time, delay: '700' },
                { icon: Users, label: 'Passengers', value: bookingDetails.passengers, delay: '800' },
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex justify-between items-center py-3 border-b border-gray-100 transform transition-all duration-500`}
                  style={{ transitionDelay: `${item.delay}ms` }}
                >
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <item.icon size={14} className="text-orange-500" />
                    {item.label}
                  </span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
              
              <div className="flex justify-between items-center py-3 animate-pulse">
                <span className="text-sm text-gray-600">🎫 Booking ID</span>
                <span className="text-sm font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                  {bookingDetails.bookingId}
                </span>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles size={20} />
              
              What Happens Next?
            </h3>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Ranchie receives your request instantly' },
                { step: '2', text: 'Driver confirms availability & fare' },
                { step: '3', text: 'You\'ll receive pickup confirmation' },
                { step: '4', text: 'Driver arrives at scheduled time' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 animate-slideInLeft" style={{ animationDelay: `${1000 + index * 200}ms` }}>
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Leave a Review */}
          <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Had a Great Ride with Ranchie Before?</h3>
            <p className="text-sm text-gray-600 text-center mb-4">Help others discover our service by sharing your experience!</p>
            
              <a href="https://g.page/r/CWuUlZeIXcgNEAE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-center hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Leave a Google Review</span>
              </div>
            </a>
          </div>          

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <a
              href="https://wa.me/17844932354"
              className="bg-green-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-all transform hover:scale-105 hover:shadow-xl"
            >
              <MessageCircle size={20} />
              <span>WhatsApp Driver</span>
            </a>
            <a
              href="tel:1784-493-2354"
              className="bg-blue-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105 hover:shadow-xl"
            >
              <Phone size={20} />
              <span>Call Driver</span>
            </a>
          </div>

          {/* Tips Section with Animation */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-2xl p-5 mb-6 shadow-lg">
            <h3 className="text-base font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span className="animate-bounce">💡</span>
              <span>Travel Tips</span>
            </h3>
            <ul className="space-y-2 text-sm text-green-700">
              {[
                'Your driver will contact you 10-15 minutes before arrival',
                'Have your phone ready for driver communication',
                'Cash payment preferred - EC$ or US$ accepted',
                'Feel free to ask your driver for local recommendations!'
              ].map((tip, index) => (
                <li key={index} className="flex items-start gap-2 animate-fadeIn" style={{ animationDelay: `${1500 + index * 100}ms` }}>
                  <Check size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Return Button */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-white hover:shadow-lg transition-all transform hover:scale-105"
            >
              <ArrowLeft size={20} />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          33% {
            transform: translateY(-30px) translateX(20px) scale(1.05);
          }
          66% {
            transform: translateY(20px) translateX(-20px) scale(0.95);
          }
        }
        
        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes driveIn {
          0% {
            transform: translateX(-200px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          0% {
            transform: translateX(-30px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes drawLine {
          0% {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes drawLine2 {
          0% {
            stroke-dasharray: 1000;
            stroke-dashoffset: -1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .animate-confetti {
          animation: confetti linear infinite;
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.8s ease-out;
        }
        
        .animate-driveIn {
          animation: driveIn 1.5s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out both;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out both;
        }
        
        .animate-drawLine {
          animation: drawLine 3s ease-out infinite;
        }
        
        .animate-drawLine2 {
          animation: drawLine2 3s ease-out infinite;
        }
      `}</style>
    </>
  );
}