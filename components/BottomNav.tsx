'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Car, MapPin, Star, Info } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/booking', icon: Car, label: 'Book' },
    { href: '/destinations', icon: MapPin, label: 'Places' },
    { href: '/reviews', icon: Star, label: 'Reviews' },
    { href: '/about', icon: Info, label: 'About' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-around shadow-lg z-40">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
              isActive
                ? 'text-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}