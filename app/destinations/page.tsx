'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Clock, DollarSign, X, ChevronLeft, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const galleryImages = [
  { src: '/images/gallery-1.png', caption: 'Layou Waterfront' },
  { src: '/images/gallery-2.png', caption: 'Beautiful Bequia' },
  { src: '/images/gallery-3.png', caption: 'Charlotte Views' },
  { src: '/images/gallery-4.png', caption: 'Fort Charlotte' },
  { src: '/images/gallery-5.png', caption: 'Tropical Hideaway view - Bequia' },
  { src: '/images/gallery-6.png', caption: 'Explore with Ranchie' },
  { src: '/images/gallery-7.png', caption: 'Trinity Falls' },
  { src: '/images/gallery-8.png', caption: 'Lower Bay - Bequia' },
  { src: '/images/gallery-9.png', caption: 'Pirates Rock' },
  { src: '/images/gallery-10.png', caption: 'Walliabou - Aerial View' },
  { src: '/images/gallery-11.png', caption: 'Walliabou - Leeward Coast' },
  { src: '/images/gallery-12.png', caption: 'Pirates of the Caribbean Film Site' },
];

const destinations = [
  {
    name: 'Argyle International Airport',
    icon: '✈️',
    image: 'https://i.postimg.cc/k5f4nh0X/aia1-20250725-203322-0000.png',
    description: "Saint Vincent's modern international gateway. We provide timely airport transfers to ensure you never miss a flight.",
    duration: '~25 min from town',
    price: 'Call for rates'
  },
  {
    name: 'Rock Villa - Bequia',
    icon: '🏝️',
    image: '/images/bequia-beach-hotel-rock-villa.png',
    description: 'You could be here, at, Rock Villa in Bequia! The most exceptional new architect-styled villa in the Grenadines. Overlooking Friendship Bay with over 10,000 SqFt of internal living area. Ranchie Taxi takes you to the Kingstown Ferry Terminal - then hop on the ferry to Bequia!',
    duration: '🚕 Taxi + ⛴️ Ferry',
    price: 'Call for rates'
  },
  {
    name: 'Young Island Resort',
    icon: '🏝️',
    image: '/images/young-island.png',
    description: 'A private island resort just 200 yards off Villa Beach. A tropical paradise perfect for day trips and unforgettable experiences.',
    duration: '~20 min',
    price: 'Call for rates'
  },
  {
    name: 'Cruise Ship Terminal',
    icon: '⛴️',
    image: 'https://i.postimg.cc/YSb1JR8Q/5a038a87b0cb4ace92099b4dbe2cd006-20250725-130555-0000.jpg',
    description: 'Gateway to the Grenadines. Catch ferries to Bequia, Mustique, and other beautiful islands.',
    duration: '~20 min',
    price: 'Call for rates'
  },
  {
    name: 'Botanical Gardens',
    icon: '🌺',
    image: 'https://i.postimg.cc/tgKx0cWZ/Screenshot-20250725-213231-Canva.jpg',
    description: 'The oldest botanical gardens in the Western Hemisphere. A must-visit for nature lovers.',
    duration: '~10 min',
    price: 'Call for rates'
  },
  {
    name: 'Grenadines House',
    icon: '🏛️',
    image: '/images/grenadines-house.png',
    description: 'A landmark destination located in the heart of Kingstown, the capital city. A must-visit spot for visitors and locals alike.',
    duration: '~15 min',
    price: 'Call for rates'
  }
];

export default function DestinationsPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null);
  const nextImage = () => setLightboxIndex((prev) => prev !== null ? (prev + 1) % galleryImages.length : null);

  return (
    <>
    <style jsx global>{`
        @keyframes explorePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.85; }
        }
        @keyframes starFloat {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(180deg); opacity: 0; }
        }
        @keyframes nebula1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.3); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes nebula2 {
          0% { transform: translate(0, 0) scale(1.2); }
          50% { transform: translate(-40px, 30px) scale(0.8); }
          100% { transform: translate(0, 0) scale(1.2); }
        }
        @keyframes shootingStar {
          0% { transform: translateX(0) translateY(0); opacity: 0; }
          5% { opacity: 1; }
          15% { opacity: 1; }
          20% { transform: translateX(200px) translateY(100px); opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
      <div 
        className="min-h-screen pb-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.45)), url('/images/destinations.png')`,
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
              className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <img 
              src="https://i.postimg.cc/N0tzBQTm/Screenshot-20250725-221145-Canva.jpg"
              alt="Ranchie Taxi"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <h1 className="text-xl font-bold font-serif flex-1 text-gray-900">Popular Destinations</h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Page Title */}
          <div className="text-center mb-8 bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-extrabold mb-2 font-serif text-gray-900" style={{ animation: 'explorePulse 3s ease-in-out infinite' }}>Explore Saint Vincent</h1>
            <p className="text-gray-700 italic font-medium">Discover the beauty of our islands with Ranchie Taxi</p>
          </div>

          {/* Destinations Grid */}
          <div className="space-y-4">
            {destinations.map((dest, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <img 
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-64 sm:h-72 md:h-96 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{dest.name}</h3>
                    <span className="text-2xl">{dest.icon}</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{dest.description}</p>
                  <div className="flex gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock size={14} />
                      <span>{dest.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <DollarSign size={14} />
                      <span>{dest.price}</span>
                    </div>
                  </div>
                  <Link
                    href={`/booking?destination=${encodeURIComponent(dest.name)}`}
                    className="block w-full text-center bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Book This Ride
                  </Link>
                  {dest.name === 'Rock Villa - Bequia' && (
                    <a
                      href="https://bequiabeachhotel.com/rock-villa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center text-teal-600 text-sm font-medium mt-2 hover:underline"
                    >
                      Visit Rock Villa, Bequia →
                    </a>
                  )}
                  {dest.name === 'Young Island Resort' && (
                    <a
                      href="https://www.youngisland.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center text-teal-600 text-sm font-medium mt-2 hover:underline"
                    >
                      Visit Young Island Resort →
                    </a>
                  )}
                  {dest.name === 'Grenadines House' && (
                    <a
                      href="https://www.grenadinehouse.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center text-teal-600 text-sm font-medium mt-2 hover:underline"
                    >
                      Visit Grenadines House →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="relative py-10 px-4 overflow-hidden">
        {/* Galaxy background */}
        <div className="absolute inset-0 bg-gray-950">
          {/* Nebula glows */}
          <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)', animation: 'nebula1 12s ease-in-out infinite' }}></div>
          <div className="absolute bottom-[20%] right-[10%] w-72 h-72 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)', animation: 'nebula2 15s ease-in-out infinite' }}></div>
          <div className="absolute top-[50%] left-[50%] w-48 h-48 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.1), transparent 70%)', animation: 'nebula1 10s ease-in-out infinite reverse' }}></div>
          {/* Stars */}
          {[
            { w: 2, t: 8, l: 15, o: 0.6, d: 7, dl: 1 },
            { w: 1, t: 22, l: 45, o: 0.4, d: 9, dl: 3 },
            { w: 3, t: 35, l: 72, o: 0.8, d: 6, dl: 0 },
            { w: 1, t: 50, l: 28, o: 0.5, d: 11, dl: 2 },
            { w: 2, t: 65, l: 88, o: 0.7, d: 8, dl: 4 },
            { w: 1, t: 12, l: 60, o: 0.3, d: 10, dl: 1 },
            { w: 2, t: 78, l: 35, o: 0.6, d: 7, dl: 3 },
            { w: 1, t: 42, l: 92, o: 0.9, d: 12, dl: 0 },
            { w: 3, t: 88, l: 18, o: 0.5, d: 9, dl: 2 },
            { w: 1, t: 5, l: 78, o: 0.4, d: 8, dl: 4 },
            { w: 2, t: 55, l: 5, o: 0.7, d: 11, dl: 1 },
            { w: 1, t: 30, l: 52, o: 0.6, d: 6, dl: 3 },
            { w: 2, t: 72, l: 68, o: 0.8, d: 10, dl: 0 },
            { w: 1, t: 18, l: 38, o: 0.5, d: 7, dl: 2 },
            { w: 3, t: 92, l: 82, o: 0.4, d: 9, dl: 4 },
            { w: 1, t: 45, l: 12, o: 0.7, d: 13, dl: 1 },
            { w: 2, t: 60, l: 55, o: 0.3, d: 8, dl: 3 },
            { w: 1, t: 25, l: 95, o: 0.6, d: 11, dl: 0 },
            { w: 2, t: 82, l: 42, o: 0.9, d: 7, dl: 2 },
            { w: 1, t: 15, l: 25, o: 0.5, d: 10, dl: 4 },
          ].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${s.w}px`,
                height: `${s.w}px`,
                top: `${s.t}%`,
                left: `${s.l}%`,
                opacity: s.o,
                animation: `starFloat ${s.d}s ease-in-out ${s.dl}s infinite`
              }}
            />
          ))}
          {/* Shooting stars */}
          <div className="absolute top-[15%] left-[5%] w-1 h-1 rounded-full bg-white shadow-[0_0_4px_white]" style={{ animation: 'shootingStar 6s ease-in 0s infinite' }}></div>
          <div className="absolute top-[40%] left-[20%] w-1 h-1 rounded-full bg-white shadow-[0_0_4px_white]" style={{ animation: 'shootingStar 8s ease-in 3s infinite' }}></div>
          <div className="absolute top-[60%] left-[60%] w-0.5 h-0.5 rounded-full bg-white shadow-[0_0_3px_white]" style={{ animation: 'shootingStar 7s ease-in 5s infinite' }}></div>
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2 font-serif text-center">📸 Ranchie Taxi Gallery</h2>
          <p className="text-sm text-gray-400 mb-6 text-center">Tap any photo to explore</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
                  <p className="text-white text-xs font-medium p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={closeLightbox}>
          <button
            className="absolute top-6 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center z-50 shadow-lg"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
          >
            <X size={24} className="text-gray-900" />
          </button>
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center z-10 transition-all"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center z-10 transition-all"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight size={24} className="text-white" />
          </button>
          <div className="max-w-4xl w-full px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].caption}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-white text-center mt-3 font-medium">{galleryImages[lightboxIndex].caption}</p>
            <p className="text-gray-500 text-center text-sm mt-1">{lightboxIndex + 1} / {galleryImages.length}</p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}