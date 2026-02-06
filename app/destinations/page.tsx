'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

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
    name: 'Kingstown',
    icon: '🏙️',
    image: 'https://i.postimg.cc/G2DmkhB9/07c8dc35cfcf4274b3dddf132ab8a95f-20250725-130535-0000.jpg',
    description: 'The vibrant capital city. Shop at the market, explore historic sites, or conduct business in the city center.',
    duration: '~15 min',
    price: 'Call for rates'
  },
  {
    name: 'Young Island',
    icon: '🏝️',
    image: '/images/young-island.png',
    description: 'A private island resort just 200 yards off Villa Beach. A tropical paradise perfect for day trips and unforgettable experiences.',
    duration: '~20 min',
    price: 'Call for rates'
  },
  {
    name: 'Cruise Terminal',
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
    name: 'Fort Charlotte',
    icon: '🏰',
    image: 'https://i.postimg.cc/26VqwbHF/20250726-223248.jpg',
    description: 'Historic fortress with panoramic views of Kingstown and the Grenadines. Rich in colonial history.',
    duration: '~12 min',
    price: 'Call for rates'
  }
];

export default function DestinationsPage() {
  return (
    <>
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
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <img 
              src="https://i.postimg.cc/N0tzBQTm/Screenshot-20250725-221145-Canva.jpg"
              alt="Ranchie Taxi"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <h1 className="text-xl font-bold font-serif flex-1">Popular Destinations</h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Page Title */}
          <div className="text-center mb-8 bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-extrabold mb-2 font-serif text-gray-900">Explore Saint Vincent</h1>
            <p className="text-gray-700 italic font-medium">Discover the beauty of our islands with Ranchie Taxi</p>
          </div>

          {/* Destinations Grid */}
          <div className="space-y-4">
            {destinations.map((dest, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <img 
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-48 object-cover"
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}