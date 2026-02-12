'use client';

export default function BookingCardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      <div className="max-w-md mx-auto">
        {/* Print Instructions */}
        <div className="mb-6 p-4 bg-orange-50 rounded-lg print:hidden">
          <p className="text-sm text-orange-800">
            <strong>Instructions:</strong> Print this page and cut out the card. 
            Laminate it and keep it in your taxi for customers to scan and book.
          </p>
          <button 
            onClick={() => window.print()}
            className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            🖨️ Print Card
          </button>
        </div>

        {/* Booking Card */}
        <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-2xl shadow-xl overflow-hidden print:shadow-none">
          {/* Top Section */}
          <div className="p-6 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-3">
              <span className="text-white text-sm font-medium">🌴 St Vincent & the Grenadines</span>
            </div>
            <h1 className="text-3xl font-black text-white drop-shadow-md">RANCHIE TAXI</h1>
            <p className="text-yellow-100 text-sm mt-1">Your Trusted Island Ride</p>
          </div>

          {/* QR Section */}
          <div className="bg-white mx-4 rounded-2xl p-6 text-center shadow-inner">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-50 p-4 rounded-2xl">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ranchie-taxi-web.vercel.app/booking&color=EA580C`}
                  alt="Scan to Book" 
                  className="w-36 h-36"
                />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              📱 Scan & Book Instantly
            </h2>
            <p className="text-gray-500 text-sm">
              Point your camera at the code
            </p>
          </div>

          {/* Bottom Section */}
          <div className="p-5 text-center">
            <div className="flex items-center justify-center gap-3 text-white mb-3">
              <div className="h-px w-12 bg-white/40"></div>
              <span className="text-sm font-medium">or visit</span>
              <div className="h-px w-12 bg-white/40"></div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 inline-block">
              <p className="text-white font-bold text-lg">
                ranchie-taxi-web.vercel.app
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-white/90 text-sm">
              <span>📞 +1 784-528-3843</span>
              <span>•</span>
              <span>⭐ Award Winning</span>
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="mt-8 print:mt-4 bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-2xl shadow-xl overflow-hidden print:shadow-none">
          <div className="p-6 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-3">
              <span className="text-white text-sm font-medium">🌴 St Vincent & the Grenadines</span>
            </div>
            <h1 className="text-3xl font-black text-white drop-shadow-md">RANCHIE TAXI</h1>
            <p className="text-yellow-100 text-sm mt-1">Your Trusted Island Ride</p>
          </div>

          <div className="bg-white mx-4 rounded-2xl p-6 text-center shadow-inner">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-50 p-4 rounded-2xl">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ranchie-taxi-web.vercel.app/booking&color=EA580C`}
                  alt="Scan to Book" 
                  className="w-36 h-36"
                />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              📱 Scan & Book Instantly
            </h2>
            <p className="text-gray-500 text-sm">
              Point your camera at the code
            </p>
          </div>

          <div className="p-5 text-center">
            <div className="flex items-center justify-center gap-3 text-white mb-3">
              <div className="h-px w-12 bg-white/40"></div>
              <span className="text-sm font-medium">or visit</span>
              <div className="h-px w-12 bg-white/40"></div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 inline-block">
              <p className="text-white font-bold text-lg">
                ranchie-taxi-web.vercel.app
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-white/90 text-sm">
              <span>📞 +1 784-528-3843</span>
              <span>•</span>
              <span>⭐ Award Winning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}