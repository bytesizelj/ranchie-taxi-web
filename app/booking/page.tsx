'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Target, Calendar, Clock, Users, Phone, MessageSquare, User } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { Loader } from '@googlemaps/js-api-loader';

declare global {
  interface Window {
    google: any;
  }
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const isSchedule = searchParams?.get('schedule') === 'true';
  
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    pickup: '',
    destination: '',
    date: '',
    time: '',
    passengers: '1',
    phone: '',
    notes: ''
  });

  // Set default date to today and initialize Google Places Autocomplete
  useEffect(() => {
  const today = new Date().toISOString().split('T')[0];
  setFormData(prev => ({ ...prev, date: today }));

  // Only load Google Maps on client side
  if (typeof window === 'undefined') return;

  // Initialize Google Places Autocomplete
  const loader = new Loader({
    apiKey: 'AIzaSyBwGQlYvLODysT5Lgd0k-VRp0jzp2_-ix8',
    version: 'weekly',
    libraries: ['places']
  });

  loader.load().then(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      // ... rest of the Google Maps code
    }
  }).catch((error) => {
    console.error('Error loading Google Places:', error);
  });
}, []);

  // Check URL parameters for destination
  useEffect(() => {
  if (!searchParams) return;
  const destination = searchParams.get('destination');
  if (destination) {
    setFormData(prev => ({ ...prev, destination: decodeURIComponent(destination) }));
  }
}, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format date for message - fix timezone issue
    const [year, month, day] = formData.date.split('-');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Create WhatsApp message
    const message = `🚕 *RANCHIE TAXI BOOKING REQUEST*

👤 *Name:* ${formData.name}
📍 *Pickup:* ${formData.pickup}
🎯 *Destination:* ${formData.destination}
📅 *Date:* ${formattedDate}
⏰ *Time:* ${formData.time}
👥 *Passengers:* ${formData.passengers}
📞 *Phone:* ${formData.phone}
💬 *Notes:* ${formData.notes || 'None'}

Please confirm availability and provide fare quote. Thank you!`;

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/17844932354?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Create confirmation URL with booking details
    const confirmationParams = new URLSearchParams({
      name: formData.name,
      pickup: formData.pickup,
      destination: formData.destination,
      date: formattedDate,
      time: formData.time,
      passengers: formData.passengers + ' passenger' + (formData.passengers !== '1' ? 's' : '')
    });
    
    // Redirect to confirmation page after a short delay (to allow WhatsApp to open)
    setTimeout(() => {
      window.location.href = `/confirmation?${confirmationParams.toString()}`;
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

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
            <h1 className="text-xl font-bold font-serif flex-1">Book Your Ride</h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Page Title */}
          <div className="text-center mb-8 bg-white rounded-2xl p-6 shadow-sm">
            <h1 className="text-3xl font-extrabold mb-2 font-serif">Book Your Island Ride</h1>
            <p className="text-gray-600 italic">Experience comfort and reliability across Saint Vincent</p>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-gray-50"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Pickup Location */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Pickup Location
                </label>
                <input
                  ref={pickupInputRef}
                  type="text"
                  id="pickup"
                  value={formData.pickup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-gray-50"
                  placeholder="Enter pickup address"
                  required
                />
              </div>

              {/* Destination */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Target size={16} className="inline mr-1" />
                  Destination
                </label>
                <input
                  ref={destinationInputRef}
                  type="text"
                  id="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-gray-50"
                  placeholder="Where are you going?"
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock size={16} className="inline mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Passengers and Phone */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users size={16} className="inline mr-1" />
                    Passengers
                  </label>
                  <select
                    id="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-gray-50"
                    required
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-gray-50"
                    placeholder="1784-xxx-xxxx"
                    required
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare size={16} className="inline mr-1" />
                  Special Instructions (Optional)
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-gray-50 min-h-[100px] resize-vertical"
                  placeholder="Any special requirements or notes for the driver..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <MessageSquare size={20} />
                <span>Book via WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Popular Destinations */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Destinations</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Argyle International Airport', icon: '✈️' },
                { name: 'Kingstown', icon: '🏙️' },
                { name: 'Villa Beach', icon: '🏖️' },
                { name: 'Bequia Ferry Terminal', icon: '⛴️' }
              ].map((dest) => (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, destination: dest.name }))}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <div className="text-2xl mb-1">{dest.icon}</div>
                  <div className="text-sm font-medium">{dest.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}