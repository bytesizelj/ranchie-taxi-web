'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Phone, MessageCircle, CheckCircle, XCircle, Loader2, Sparkles, Car, Check } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

interface BookingData {
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  passengers: string;
  notes: string;
  status: string;
  driverMessage?: string;
  createdAt: any;
}

export default function BookingStatusPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevStatus, setPrevStatus] = useState('');

  useEffect(() => {
    if (!bookingId) return;

    const unsubscribe = onSnapshot(doc(db, 'bookings', bookingId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as BookingData;
        if (prevStatus && prevStatus !== data.status) {
          if (navigator.vibrate) navigator.vibrate(200);
        }
        setPrevStatus(data.status);
        setBooking(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-green-500" size={40} />
          <p className="text-gray-600">Loading your booking...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="mx-auto mb-4 text-red-400" size={48} />
          <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">This booking may have been removed.</p>
          <Link href="/" className="text-green-600 font-semibold hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { icon: any; title: string; subtitle: string; bg: string; pulse: boolean }> = {
    pending: {
      icon: Loader2,
      title: 'Waiting for Ranchie...',
      subtitle: 'Your booking has been sent. Ranchie will confirm shortly.',
      bg: 'from-orange-500 to-amber-500',
      pulse: true,
    },
    accepted: {
      icon: CheckCircle,
      title: 'Ranchie Accepted! 🎉',
      subtitle: 'Your ride is confirmed. Ranchie will be there!',
      bg: 'from-green-500 to-teal-500',
      pulse: false,
    },
    confirmed: {
      icon: CheckCircle,
      title: 'Ranchie Accepted! 🎉',
      subtitle: 'Your ride is confirmed. Ranchie will be there!',
      bg: 'from-green-500 to-teal-500',
      pulse: false,
    },
    declined: {
      icon: XCircle,
      title: 'Ranchie is Unavailable',
      subtitle: 'Please call or WhatsApp directly to arrange your ride.',
      bg: 'from-red-500 to-orange-500',
      pulse: false,
    },
    cancelled: {
      icon: XCircle,
      title: 'Ranchie is Unavailable',
      subtitle: 'Please call or WhatsApp directly to arrange your ride.',
      bg: 'from-red-500 to-orange-500',
      pulse: false,
    },
    completed: {
      icon: CheckCircle,
      title: 'Ride Completed ✅',
      subtitle: 'Thanks for riding with Ranchie Taxi!',
      bg: 'from-green-500 to-teal-500',
      pulse: false,
    },
  };

  const config = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <>
      <div className="min-h-screen pb-20 bg-gradient-to-br from-gray-50 via-green-50/30 to-orange-50/30">
        <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/" className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <ArrowLeft size={20} />
            </Link>
            <img
              src="https://i.postimg.cc/N0tzBQTm/Screenshot-20250725-221145-Canva.jpg"
              alt="Ranchie Taxi"
              className="w-10 h-10 rounded-lg object-cover shadow-md"
            />
            <h1 className="text-xl font-bold font-serif flex-1 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Booking Status
            </h1>
            <Sparkles className="text-yellow-500 animate-pulse" size={20} />
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Status Card */}
          <div className={`bg-gradient-to-r ${config.bg} rounded-3xl p-6 text-white text-center mb-6 shadow-xl`}>
            <div className="relative inline-block mb-4">
              <StatusIcon size={60} className={`${config.pulse ? 'animate-spin' : ''}`} style={config.pulse ? { animationDuration: '3s' } : {}} />
              {config.pulse && (
                <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
            <p className="text-white/90">{config.subtitle}</p>
            {booking.driverMessage && (
              <div className="mt-4 bg-white/20 rounded-xl p-3">
                <p className="text-sm">💬 Ranchie says: &quot;{booking.driverMessage}&quot;</p>
              </div>
            )}
          </div>

          {/* Urgent Help - only show when pending */}
          {booking.status === 'pending' && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 mb-6 text-center">
              <p className="text-sm text-yellow-800 font-medium mb-3">Need it urgently? Contact Ranchie directly:</p>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/17844932354?text=Hi%20Ranchie%2C%20I%20just%20submitted%20a%20booking%20and%20need%20urgent%20confirmation!"
                  className="bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm hover:bg-green-600 transition-all"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
                <a
                  href="tel:17844932354"
                  className="bg-blue-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm hover:bg-blue-600 transition-all"
                >
                  <Phone size={16} />
                  Call Now
                </a>
              </div>
            </div>
          )}

          {/* Booking Details */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Car size={20} className="text-orange-500" />
              Trip Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 flex items-center gap-2">
                  <MapPin size={14} className="text-green-500" /> Pickup
                </span>
                <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{booking.pickup}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 flex items-center gap-2">
                  <MapPin size={14} className="text-red-500" /> Destination
                </span>
                <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{booking.destination}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" /> Date
                </span>
                <span className="text-sm font-semibold text-gray-900">{booking.date}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" /> Time
                </span>
                <span className="text-sm font-semibold text-gray-900">{booking.time}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-700 flex items-center gap-2">
                  <Users size={14} className="text-gray-400" /> Passengers
                </span>
                <span className="text-sm font-semibold text-gray-900">{booking.passengers}</span>
              </div>
            </div>
          </div>

          {/* Contact Driver - show when not pending */}
          {booking.status !== 'pending' && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <a href="https://wa.me/17844932354" className="bg-green-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg">
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </a>
              <a href="tel:17844932354" className="bg-blue-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg">
                <Phone size={20} />
                <span>Call</span>
              </a>
            </div>
          )}

          {/* Leave a Review */}
          {(booking.status === 'completed' || booking.status === 'confirmed' || booking.status === 'accepted') && (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="text-lg font-semibold mb-3 text-center">Enjoyed Your Ride?</h3>
              <a
                href="https://g.page/r/CWuUlZeIXcgNEAE/review"
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
          )}

          {/* Travel Tips */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-2xl p-5 mb-6 shadow-lg">
            <h3 className="text-base font-semibold text-green-800 mb-3 flex items-center gap-2">
              💡 Travel Tips
            </h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 flex-shrink-0" /> Your driver will contact you before arrival</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 flex-shrink-0" /> Have your phone ready for communication</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 flex-shrink-0" /> Cash payment — EC$ or US$ accepted</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 flex-shrink-0" /> Ask your driver for local recommendations!</li>
            </ul>
          </div>

          <div className="text-center space-y-3">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Car size={20} />
              Book Another Ride
            </Link>
            <br />
            <Link href="/" className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              <ArrowLeft size={20} />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}