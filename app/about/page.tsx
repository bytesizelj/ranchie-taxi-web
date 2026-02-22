'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Phone, MessageCircle, Star, Shield, Clock, 
  Globe, Heart, Car, MapPin, ChevronDown, ChevronUp, 
  Award, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function AboutPage() {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const vehiclePhotos = [
    { src: '/images/vehicle-1.png', alt: 'Ranchie Taxi - Nissan NV350 Front View' },
    { src: '/images/vehicle-2.png', alt: 'Ranchie Taxi - Nissan NV350 Side View' },
    { src: '/images/vehicle-3.png', alt: 'Ranchie Taxi - Nissan NV350 Interior' },
    { src: '/images/vehicle-4.png', alt: 'Ranchie Taxi - Nissan NV350 Rear View' },
    { src: '/images/vehicle-5.png', alt: 'Ranchie Taxi - Passenger Comfort' },
    { src: '/images/vehicle-6.png', alt: 'Ranchie Taxi - On the Road' },
  ];

  const faqs = [
    { q: 'What areas do you cover?', a: 'We cover all of Saint Vincent and the Grenadines — from Argyle International Airport to Kingstown, Leeward, Windward, and everywhere in between.' },
    { q: 'How do I book a ride?', a: 'You can book through our app, WhatsApp us at 1-784-493-2354, or call directly. For the best experience, we recommend booking through the app — it ensures your ride is confirmed instantly and nothing gets missed, so you\'re guaranteed a smooth pickup every time.' },
    { q: 'What are your rates?', a: 'Our rates are transparent and competitive. Airport transfers and island tours have set pricing. Contact us for a quote on your specific route.' },
    { q: 'Do you offer airport transfers?', a: 'Yes! Airport transfers to and from Argyle International Airport (AIA) are one of our most popular services. We track flight arrivals so we\'re always on time.' },
  ];

  return (
    <>
      <div className="min-h-screen pb-24 relative bg-black" style={{ background: "linear-gradient(rgba(30,30,30,0.75), rgba(30,30,30,0.75)), url('/images/ranchie-background-use.png') center/cover fixed" }}>
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-30">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-extrabold flex-1" style={{ color: '#000000' }}>About <span style={{ color: '#ea580c' }}>Ranchie Taxi</span></h1>
            <a 
              href="tel:17844932354"
              className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 hover:bg-orange-100 transition-colors"
            >
              <Phone size={18} />
            </a>
          </div>
        </header>

        <div className="max-w-3xl mx-auto">
        {/* ===== AWARD VIDEO ===== */}
          <section className="px-4 pt-6 pb-2">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="relative">
                <video
                  autoPlay
                  muted={videoMuted}
                  loop
                  playsInline
                  className="w-full rounded-3xl"
                >
                  <source src="/videos/about-ranchie.mp4" type="video/mp4" />
                </video>
                <button
                  onClick={() => setVideoMuted(!videoMuted)}
                  className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-black/70 transition-colors"
                >
                  {videoMuted ? '🔇 Tap to unmute' : '🔊 Tap to mute'}
                </button>
              </div>
            </div>
          </section>

          {/* ===== MEET RANCHIE SECTION ===== */}
          <section className="px-4 pt-6 pb-2">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              {/* Driver Photo + Info */}
              <div className="relative">
                <div className="aspect-[4/3] relative bg-gray-100">
                  <Image
                    src="/images/meet-ranchie.png"
                    alt="Ranchie - Your trusted driver in Saint Vincent"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Name + tagline over image */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="text-3xl font-bold text-white mb-1">Meet Ranchie</h2>
                    <p className="text-white/90 text-sm">Professional Driver &bull; Tour Guide &bull; Your Friend in SVG</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                <div className="py-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">20+</div>
                  <div className="text-xs text-gray-500 mt-0.5">Years Driving</div>
                </div>
                <div className="py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-bold text-orange-600">5.0</span>
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Google Rating</div>
                </div>
                <div className="py-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-xs text-gray-500 mt-0.5">Available</div>
                </div>
              </div>

              {/* Bio */}
              <div className="p-5">
                <p className="text-gray-700 leading-relaxed">
                  With over 20 years behind the wheel navigating every road across Saint Vincent and the 
                  Grenadines, Ranchie is more than a driver — he&apos;s your personal guide to the island. 
                  Whether it&apos;s a smooth airport transfer, a scenic island tour, or getting you where you 
                  need to be safely and on time, Ranchie delivers a premium experience every ride.
                </p>

                {/* Credentials */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    <Heart size={13} /> CPR Trained
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    <Globe size={13} /> English
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    <Shield size={13} /> Licensed &amp; Insured
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    <Clock size={13} /> 20+ Years Experience
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ===== GOOGLE REVIEW CTA ===== */}
          <section className="px-4 py-3">
            <a
              href="https://g.page/r/CWuUlZeIXcgNEAE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star size={24} className="text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-sm font-bold text-gray-800 ml-1">5.0</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Rated 5 stars on Google &bull; Tap to leave a review</p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </a>
          </section>

          {/* ===== VEHICLE SECTION ===== */}
          <section className="px-4 py-3">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Car size={20} className="text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-900">The Ride</h3>
                </div>
                <p className="text-sm text-gray-500">Comfortable, clean, and ready to roll</p>
              </div>

              {/* Vehicle Details Card */}
              <div className="mx-5 mb-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Make / Model</div>
                    <div className="text-sm font-semibold text-gray-800 mt-0.5">Nissan NV350</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Year</div>
                    <div className="text-sm font-semibold text-gray-800 mt-0.5">2018</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Color</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: '#F5D130' }} />
                      <span className="text-sm font-semibold text-gray-800">Sunshine Yellow</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Type</div>
                    <div className="text-sm font-semibold text-gray-800 mt-0.5">Passenger Van</div>
                  </div>
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="px-5 pb-5">
                <div className="grid grid-cols-3 gap-2">
                  {vehiclePhotos.slice(0, showAllPhotos ? 6 : 3).map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className="aspect-square relative rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover"
                      />
                      {!showAllPhotos && i === 2 && (
                        <div 
                          className="absolute inset-0 bg-black/50 flex items-center justify-center"
                          onClick={(e) => { e.stopPropagation(); setShowAllPhotos(true); }}
                        >
                          <span className="text-white font-bold text-lg">+3</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {showAllPhotos && (
                  <button
                    onClick={() => setShowAllPhotos(false)}
                    className="mt-3 text-sm text-orange-600 font-medium hover:underline"
                  >
                    Show less
                  </button>
                )}
              </div>
            </div>
          </section>
           {/* ===== HAPPY VISITORS ===== */}
          <section className="px-4 py-3">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Ranchie &amp; Happy Visitors</h3>
                <p className="text-sm text-gray-500">Making every ride a memorable experience</p>
              </div>
              <div className="px-5 pb-5 grid grid-cols-2 gap-3 items-start">
                <div className="space-y-2">
                  <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src="/images/about-ranchie-taxi.png"
                      alt="Ranchie with happy visitors"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src="/images/photo-1.png"
                      alt="Ranchie with happy passengers"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center italic">&ldquo;More than a ride — it&apos;s a welcome to the island&rdquo;</p>
                </div>
                <div>
                  <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src="/images/about-background.png"
                      alt="Ranchie Taxi happy customers"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center italic">&ldquo;Every passenger leaves as a friend&rdquo;</p>
                </div>
              </div>
            </div>
          </section>
          {/* ===== SERVICE AREA ===== */}
          <section className="px-4 py-3">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={20} className="text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-900">Service Area</h3>
                </div>
                <p className="text-sm text-gray-500">Covering all of Saint Vincent &amp; the Grenadines</p>
              </div>

              <div className="px-5 pb-5">
                <div className="rounded-2xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124752.68898439098!2d-61.28!3d13.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c47fb02a7c84f0f%3A0x45268e7a9c82e92e!2sSt%20Vincent!5e0!3m2!1sen!2svg!4v1"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-2xl"
                  />
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Airport Transfers', 'Kingstown', 'Leeward Coast', 'Windward Coast', 'Island Tours', 'Bequia Ferry'].map((route) => (
                    <span key={route} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                      {route}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ===== WHY CHOOSE RANCHIE ===== */}
          <section className="px-4 py-3">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-4">Why Choose Ranchie?</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, label: 'Safe & Reliable', desc: 'Licensed, insured, CPR trained' },
                  { icon: Clock, label: 'Always On Time', desc: 'Flight tracking for pickups' },
                  { icon: Award, label: '5-Star Rated', desc: 'Perfect Google rating' },
                  { icon: MapPin, label: 'Local Expert', desc: '20+ years island knowledge' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl p-3.5">
                    <item.icon size={22} className="text-white/90 mb-2" />
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="text-xs text-white/75 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== FAQ ===== */}
          <section className="px-4 py-3">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Frequently Asked</h3>
              </div>
              <div className="px-5 pb-5">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between py-3.5 text-left"
                    >
                      <span className="text-sm font-medium text-gray-800 pr-4">{faq.q}</span>
                      {expandedFaq === i ? (
                        <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === i && (
                      <p className="text-sm text-gray-600 pb-3.5 leading-relaxed">{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== CONTACT ===== */}
          <section className="px-4 py-3">
            <div className="bg-white rounded-3xl shadow-sm p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h3>
              <div className="space-y-3">
                
                <a
                  href="https://wa.me/17844932354"
                  className="flex items-center gap-4 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">WhatsApp</div>
                    <div className="text-xs text-gray-500">1-784-493-2354</div>
                  </div>
                </a>
                
                <a
                  href="tel:17844932354"
                  className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Call Ranchie</div>
                    <div className="text-xs text-gray-500">1-784-493-2354</div>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* ===== SOCIAL LINKS ===== */}
          <section className="px-4 py-3">
            <div className="bg-white rounded-3xl shadow-sm p-5 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Follow Us</h3>
              <div className="flex justify-center gap-4">
                
                <a
                  href="https://www.instagram.com/ranchietaxisvg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                
                <a
                  href="https://m.facebook.com/ranchie.russell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                
                <a
                  href="https://wa.me/17844932354"
                  className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
                >
                  <MessageCircle size={22} />
                </a>
              </div>
            </div>
          </section>

          {/* ===== FOOTER ===== */}
          <section className="px-4 pt-3 pb-6 text-center">
            <p className="text-xs text-gray-400">&copy; 2025 Ranchie Taxi. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-1">
              Website by{' '}
              
              <a
                href="https://highmark-business-systems.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                Highmark Business Systems
              </a>
            </p>
          </section>

        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 z-10"
          >
            <X size={22} />
          </button>
          
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
              className="absolute left-3 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 z-10"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          
          {lightboxIndex < vehiclePhotos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
              className="absolute right-3 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 z-10"
            >
              <ChevronRight size={22} />
            </button>
          )}

          <div className="relative w-full max-w-lg mx-4 aspect-square" onClick={(e) => e.stopPropagation()}>
            <Image
              src={vehiclePhotos[lightboxIndex].src}
              alt={vehiclePhotos[lightboxIndex].alt}
              fill
              className="object-contain"
            />
          </div>
          
          <div className="absolute bottom-6 text-white/70 text-sm">
            {lightboxIndex + 1} / {vehiclePhotos.length}
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}