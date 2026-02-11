'use client';

export default function BookingCardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      <div className="max-w-md mx-auto">
        {/* Print Instructions */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg print:hidden">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Print this page and cut out the card. 
            Laminate it and keep it in your taxi for customers to scan and book.
          </p>
          <button 
            onClick={() => window.print()}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🖨️ Print Card
          </button>
        </div>

        {/* Booking Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-teal-500 print:shadow-none print:border-2">
          <div className="bg-gradient-to-r from-teal-500 to-green-500 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">RANCHIE TAXI</h1>
            <p className="text-teal-100 text-sm">St Vincent & the Grenadines</p>
          </div>

          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Book Your Ride! 🚕
            </h2>
            <p className="text-gray-600 mb-4">
              Scan to book your taxi online<br />
              Fast & Easy!
            </p>

            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white border-2 border-gray-200 rounded-xl">
                {/* QR Code - we'll generate this */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://ranchietaxi.com/booking`}
                  alt="Scan to Book" 
                  className="w-40 h-40"
                />
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              Scan with your phone camera
            </p>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-gray-400 text-sm">or visit</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <p className="text-sm font-semibold text-teal-600">
              ranchietaxi.com
            </p>
          </div>

          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-sm text-gray-600">
              📞 +1 784-528-3843
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Award-Winning Service Since 2000
            </p>
          </div>
        </div>

        {/* Second Card */}
        <div className="mt-8 print:mt-4 bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-teal-500 print:shadow-none print:border-2">
          <div className="bg-gradient-to-r from-teal-500 to-green-500 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">RANCHIE TAXI</h1>
            <p className="text-teal-100 text-sm">St Vincent & the Grenadines</p>
          </div>
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Book Your Ride! 🚕
            </h2>
            <p className="text-gray-600 mb-4">
              Scan to book your taxi online<br />
              Fast & Easy!
            </p>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white border-2 border-gray-200 rounded-xl">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://ranchietaxi.com/booking`}
                  alt="Scan to Book" 
                  className="w-40 h-40"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Scan with your phone camera
            </p>
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-gray-400 text-sm">or visit</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <p className="text-sm font-semibold text-teal-600">
              ranchietaxi.com
            </p>
          </div>
          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-sm text-gray-600">
              📞 +1 784-528-3843
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Award-Winning Service Since 2000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}