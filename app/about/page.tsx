'use client';

import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MessageCircle, Star, Shield, Car, DollarSign, MapPin, Clock, Check, Instagram, Facebook, Volume2, VolumeX } from 'lucide-react';
import { useRef, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import GoogleMap from '@/components/GoogleMap';

export default function AboutPage() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  const features = [
    { icon: Star, title: 'Licensed & Insured', description: 'Fully certified drivers' },
    { icon: Car, title: 'Clean Vehicles', description: 'Well-maintained fleet' },
    { icon: DollarSign, title: 'Fair Pricing', description: 'Transparent rates' },
    { icon: MapPin, title: 'Local Expert', description: 'Island knowledge' }
  ];

  return (
    <>
      <div 
        className="min-h-screen pb-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.65)), url('/images/ranchie-background-use.png')`,
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
            <h1 className="text-xl font-bold font-serif flex-1 text-gray-900">About Ranchie Taxi</h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center mb-8 shadow-lg">
            <img 
              src="https://i.postimg.cc/N0tzBQTm/Screenshot-20250725-221145-Canva.jpg"
              alt="Ranchie Taxi Logo"
              className="w-24 h-24 mx-auto mb-5 rounded-2xl shadow-xl"
            />
            <h1 className="text-4xl font-bold mb-2 font-serif">Ranchie Taxi</h1>
            <p className="text-lg italic opacity-95">Your Trusted Ride in Paradise</p>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Ranchie Taxi</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Serving Saint Vincent and the Grenadines with pride, Ranchie Taxi is your reliable transportation 
              partner throughout our beautiful islands. With years of experience navigating every corner of SVG, 
              we ensure safe, comfortable, and timely rides for locals and visitors alike.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you need an airport transfer, island tour, or just a quick ride across town, our professional 
              service and local expertise make every journey memorable. We're not just drivers — we're your gateway 
              to experiencing the best of Saint Vincent and the Grenadines.
            </p>
          </div>
          {/* Meet Ranchie */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Meet Ranchie</h2>
            <div className="relative mb-4">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full rounded-2xl shadow-lg"
              >
                <source src="/videos/about-ranchie.mp4" type="video/mp4" />
              </video>
              {isMuted && (
                <button
                  onClick={toggleMute}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl transition-all hover:bg-black/40"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 flex items-center gap-2 shadow-lg">
                    <VolumeX size={20} className="text-gray-700" />
                    <span className="text-gray-800 font-semibold text-sm">Tap to unmute</span>
                  </div>
                </button>
              )}
              {!isMuted && (
                <button
                  onClick={toggleMute}
                  className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                >
                  <Volume2 size={18} className="text-green-600" />
                </button>
              )}
            </div>
            <p className="text-gray-600 italic mb-4">Award-winning service across SVG</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img 
                src="/images/about-ranchie-taxi.png"
                alt="Ranchie with happy customers"
                className="w-full rounded-2xl shadow-lg"
              />
              <img 
                src="/images/about-background.png"
                alt="Ranchie with customer by van"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Solo Ranchie Photo */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 text-center">
            <img 
              src="/images/meet-ranchie.png"
              alt="Ranchie - Your trusted driver"
              className="w-full rounded-2xl shadow-lg mb-4"
            />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Your Trusted Driver</h3>
            <p className="text-gray-600 text-sm">Professional, friendly & always on time</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-5 text-center hover:border-green-500 hover:bg-green-50 transition-all">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                  <h3 className="font-semibold text-sm mb-1 text-gray-900">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Operating Hours */}
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Operating Hours</h3>
            <p className="text-2xl font-bold text-green-900">24/7 Service Available</p>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-5 text-gray-900">Get in Touch</h2>
            <div className="space-y-4">
              <a 
                href="tel:1784-493-2354"
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white">
                  <Phone size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900">1784-493-2354</p>
                </div>
              </a>

              <a 
                href="https://wa.me/17844932354"
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white">
                  <MessageCircle size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">WhatsApp</p>
                  <p className="font-semibold text-gray-900">Message Us</p>
                </div>
              </a>

              <a 
                href="mailto:ranch8622@hotmail.com"
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">ranchietax@gmail.com</p>
                </div>
              </a>
            </div>
          </div>

          {/* Service Area */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-1 text-gray-900">Service Area</h3>
              <p className="text-sm text-gray-600">We cover all of Saint Vincent & the Grenadines</p>
            </div>
            <div className="h-64">
              <GoogleMap 
                height="256px"
                showMarker={true}
                showServiceArea={true}
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center mb-6">
            <h3 className="text-lg font-semibold mb-5">Follow Us</h3>
            <div className="flex justify-center gap-4">
              <a 
                href="https://www.instagram.com/ranchietaxisvg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:-translate-y-1 transition-all"
                title="Instagram: @ranchietaxisvg"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://www.facebook.com/ranchie.russell"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:-translate-y-1 transition-all"
                title="Facebook: Ranchie Russell"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://wa.me/17844932354"
                className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:-translate-y-1 transition-all"
                title="WhatsApp"
              >
                <MessageCircle size={24} />
              </a>
            </div>
          </div>

          {/* Footer Credit */}
          <div className="text-center py-6 text-gray-600 text-sm">
            <p>© 2025 Ranchie Taxi. All rights reserved.</p>
            <p className="mt-2">
              Website by{' '}
              <a 
                href="https://designs-by-lj.netlify.app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                Designs by LJ
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}