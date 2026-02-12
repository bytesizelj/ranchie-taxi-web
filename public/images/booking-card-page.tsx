'use client';

import { useState } from 'react';

export default function BookingCardPage() {
  const [design, setDesign] = useState<1 | 2>(1);

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      <div className="max-w-md mx-auto">
        {/* Print Instructions */}
        <div className="mb-6 p-4 bg-orange-50 rounded-lg print:hidden">
          <p className="text-sm text-orange-800 mb-3">
            <strong>Instructions:</strong> Choose a design, print, cut out, and laminate for your taxi.
          </p>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setDesign(1)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                design === 1
                  ? 'bg-gray-900 text-yellow-400'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              🖤 Dark & Premium
            </button>
            <button
              onClick={() => setDesign(2)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                design === 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              🌴 Tropical & Vibrant
            </button>
          </div>
          <button
            onClick={() => window.print()}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
          >
            🖨️ Print Card
          </button>
        </div>

        {/* ===== DESIGN 1: Dark & Premium ===== */}
        {design === 1 && (
          <>
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl overflow-hidden border border-yellow-500/30">
              {/* Gold accent lines */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
              
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}></div>

              {/* Top Section */}
              <div className="relative p-8 text-center">
                <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-5 py-1.5 mb-4">
                  <span className="text-yellow-400 text-xs font-semibold tracking-widest uppercase">🌴 St Vincent & the Grenadines</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                  RANCHIE TAXI
                </h1>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto my-3"></div>
                <p className="text-yellow-400/80 text-sm tracking-widest uppercase font-medium">Your Trusted Island Ride</p>
              </div>

              {/* QR Section */}
              <div className="mx-5 mb-5">
                <div className="bg-white rounded-2xl p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500 rounded-tl-2xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500 rounded-tr-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500 rounded-bl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500 rounded-br-2xl"></div>
                  
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl shadow-inner">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ranchie-taxi-web.vercel.app/booking&color=1a1a1a"
                        alt="Scan to Book"
                        className="w-36 h-36"
                      />
                    </div>
                  </div>
                  
                  <h2 className="text-lg font-bold text-gray-900 mb-0.5">
                    Scan & Book Instantly
                  </h2>
                  <p className="text-gray-400 text-xs tracking-wide">
                    Point your camera at the code
                  </p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="relative px-6 pb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-px w-10 bg-yellow-400/30"></div>
                  <span className="text-yellow-400/60 text-xs uppercase tracking-widest">or visit</span>
                  <div className="h-px w-10 bg-yellow-400/30"></div>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl py-3 px-5 inline-block mb-5">
                  <p className="text-yellow-400 font-bold text-base tracking-wide">
                    ranchie-taxi-web.vercel.app
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
                  <span className="flex items-center gap-1.5">📞 +1 784-493-2354</span>
                  <span className="text-yellow-400">✦</span>
                  <span className="flex items-center gap-1.5">⭐ Award Winning</span>
                </div>
              </div>
            </div>

            {/* Second Card (same design) */}
            <div className="mt-8 print:mt-4 relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl overflow-hidden border border-yellow-500/30">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}></div>

              <div className="relative p-8 text-center">
                <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-5 py-1.5 mb-4">
                  <span className="text-yellow-400 text-xs font-semibold tracking-widest uppercase">🌴 St Vincent & the Grenadines</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                  RANCHIE TAXI
                </h1>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto my-3"></div>
                <p className="text-yellow-400/80 text-sm tracking-widest uppercase font-medium">Your Trusted Island Ride</p>
              </div>

              <div className="mx-5 mb-5">
                <div className="bg-white rounded-2xl p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500 rounded-tl-2xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500 rounded-tr-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500 rounded-bl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500 rounded-br-2xl"></div>

                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl shadow-inner">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ranchie-taxi-web.vercel.app/booking&color=1a1a1a"
                        alt="Scan to Book"
                        className="w-36 h-36"
                      />
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-0.5">
                    Scan & Book Instantly
                  </h2>
                  <p className="text-gray-400 text-xs tracking-wide">
                    Point your camera at the code
                  </p>
                </div>
              </div>

              <div className="relative px-6 pb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-px w-10 bg-yellow-400/30"></div>
                  <span className="text-yellow-400/60 text-xs uppercase tracking-widest">or visit</span>
                  <div className="h-px w-10 bg-yellow-400/30"></div>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl py-3 px-5 inline-block mb-5">
                  <p className="text-yellow-400 font-bold text-base tracking-wide">
                    ranchie-taxi-web.vercel.app
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
                  <span className="flex items-center gap-1.5">📞 +1 784-528-3843</span>
                  <span className="text-yellow-400">✦</span>
                  <span className="flex items-center gap-1.5">⭐ Award Winning</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ===== DESIGN 2: Tropical & Vibrant ===== */}
        {design === 2 && (
          <>
            <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl shadow-2xl overflow-hidden">
              {/* Wave decoration */}
              <div className="absolute top-0 left-0 right-0 opacity-10">
                <svg viewBox="0 0 400 80" className="w-full">
                  <path d="M0,40 C100,80 200,0 400,40 L400,0 L0,0 Z" fill="white" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 opacity-10 rotate-180">
                <svg viewBox="0 0 400 80" className="w-full">
                  <path d="M0,40 C100,80 200,0 400,40 L400,0 L0,0 Z" fill="white" />
                </svg>
              </div>

              {/* Sun decoration */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl"></div>

              {/* Top Section */}
              <div className="relative p-8 text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-1.5 mb-4 shadow-lg shadow-black/10">
                  <span className="text-white text-xs font-semibold tracking-wide">🌴 St Vincent & the Grenadines 🌺</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-1 drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
                  RANCHIE TAXI
                </h1>
                <p className="text-emerald-100 text-sm font-medium tracking-wide">Your Trusted Island Ride</p>
              </div>

              {/* QR Section */}
              <div className="mx-5 mb-5">
                <div className="bg-white/95 backdrop-blur rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
                  {/* Subtle gradient border effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-emerald-200"></div>
                  
                  <div className="relative flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 rounded-2xl shadow-inner border border-emerald-100">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ranchie-taxi-web.vercel.app/booking&color=0d9488"
                        alt="Scan to Book"
                        className="w-36 h-36"
                      />
                    </div>
                  </div>

                  <h2 className="relative text-lg font-bold text-gray-900 mb-0.5">
                    📱 Scan & Book Instantly
                  </h2>
                  <p className="relative text-gray-500 text-xs">
                    Point your camera at the code
                  </p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="relative px-6 pb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-px w-10 bg-white/30"></div>
                  <span className="text-white/70 text-xs uppercase tracking-widest">or visit</span>
                  <div className="h-px w-10 bg-white/30"></div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl py-3 px-5 inline-block mb-5 shadow-lg">
                  <p className="text-white font-bold text-base tracking-wide drop-shadow">
                    ranchie-taxi-web.vercel.app
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 text-white/90 text-sm">
                  <span>📞 +1 784-493-2354</span>
                  <span className="text-yellow-300">🌟</span>
                  <span>⭐ Award Winning</span>
                </div>
              </div>
            </div>

            {/* Second Card (same design) */}
            <div className="mt-8 print:mt-4 relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 opacity-10">
                <svg viewBox="0 0 400 80" className="w-full">
                  <path d="M0,40 C100,80 200,0 400,40 L400,0 L0,0 Z" fill="white" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 opacity-10 rotate-180">
                <svg viewBox="0 0 400 80" className="w-full">
                  <path d="M0,40 C100,80 200,0 400,40 L400,0 L0,0 Z" fill="white" />
                </svg>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl"></div>

              <div className="relative p-8 text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-1.5 mb-4 shadow-lg shadow-black/10">
                  <span className="text-white text-xs font-semibold tracking-wide">🌴 St Vincent & the Grenadines 🌺</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-1 drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
                  RANCHIE TAXI
                </h1>
                <p className="text-emerald-100 text-sm font-medium tracking-wide">Your Trusted Island Ride</p>
              </div>

              <div className="mx-5 mb-5">
                <div className="bg-white/95 backdrop-blur rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 rounded-2xl border-2 border-emerald-200"></div>

                  <div className="relative flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 rounded-2xl shadow-inner border border-emerald-100">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ranchie-taxi-web.vercel.app/booking&color=0d9488"
                        alt="Scan to Book"
                        className="w-36 h-36"
                      />
                    </div>
                  </div>

                  <h2 className="relative text-lg font-bold text-gray-900 mb-0.5">
                    📱 Scan & Book Instantly
                  </h2>
                  <p className="relative text-gray-500 text-xs">
                    Point your camera at the code
                  </p>
                </div>
              </div>

              <div className="relative px-6 pb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-px w-10 bg-white/30"></div>
                  <span className="text-white/70 text-xs uppercase tracking-widest">or visit</span>
                  <div className="h-px w-10 bg-white/30"></div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl py-3 px-5 inline-block mb-5 shadow-lg">
                  <p className="text-white font-bold text-base tracking-wide drop-shadow">
                    ranchie-taxi-web.vercel.app
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 text-white/90 text-sm">
                  <span>📞 +1 784-528-3843</span>
                  <span className="text-yellow-300">🌟</span>
                  <span>⭐ Award Winning</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
