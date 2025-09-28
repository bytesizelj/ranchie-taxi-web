'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Phone, MessageCircle, MapPin, Calendar, Clock, Users } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useSearchParams } from 'next/navigation';

export default function ConfirmationPage() {
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

  useEffect(() => {
    // Generate booking ID
    const bookingId = `RT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    
    // Get booking details from URL params (in real app, this might come from form submission)
    // For now, we'll use sample data or URL params
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
  }, [searchParams]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
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
            <h1 className="text-xl font-bold font-serif flex-1">Booking Confirmation</h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Success Message */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn">
              <Check size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Request Sent!</h2>
            <p className="text-gray-600">
              Your ride request has been sent to Ranchie Taxi via WhatsApp. 
              You'll receive a confirmation shortly with your driver details and fare information.
            </p>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-5 pb-3 border-b border-gray-200">Trip Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin size={14} />
                  Pickup
                </span>
                <span className="text-sm font-medium">{bookingDetails.pickup}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin size={14} />
                  Destination
                </span>
                <span className="text-sm font-medium">{bookingDetails.destination}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar size={14} />
                  Date
                </span>
                <span className="text-sm font-medium">{bookingDetails.date}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Clock size={14} />
                  Time
                </span>
                <span className="text-sm font-medium">{bookingDetails.time}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Users size={14} />
                  Passengers
                </span>
                <span className="text-sm font-medium">{bookingDetails.passengers}</span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-600">🎫 Booking ID</span>
                <span className="text-sm font-medium text-orange-600">{bookingDetails.bookingId}</span>
              </div>
            </div>
          </div>

          {/* Driver Contact */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-6">
            <h3 className="text-lg font-semibold mb-4">Driver Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>Ranchie: 1784-493-2354</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={18} />
                <span>WhatsApp Available</span>
              </div>
              <div className="flex items-center gap-3">
                <span>🚕</span>
                <span>Professional Licensed Driver</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <a
              href="https://wa.me/17844932354"
              className="bg-green-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-all"
            >
              <MessageCircle size={20} />
              <span>WhatsApp Driver</span>
            </a>
            <a
              href="tel:1784-493-2354"
              className="bg-blue-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
            >
              <Phone size={20} />
              <span>Call Driver</span>
            </a>
          </div>

          {/* Tips Section */}
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-5 mb-6">
            <h3 className="text-base font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span>💡</span>
              <span>Travel Tips</span>
            </h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 flex-shrink-0" />
                <span>Your driver will contact you 10-15 minutes before arrival</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 flex-shrink-0" />
                <span>Have your phone ready for driver communication</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 flex-shrink-0" />
                <span>Cash payment preferred - EC$ or US$ accepted</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 flex-shrink-0" />
                <span>Feel free to ask your driver for local recommendations!</span>
              </li>
            </ul>
          </div>

          {/* Return Button */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
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
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
}