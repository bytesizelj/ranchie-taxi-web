'use client';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Check,
  Plane,
  Building2,
  Palmtree,
  Ship,
  Car,
  Sparkles
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const popularDestinations = [
  { id: 1, name: 'Argyle International Airport', icon: Plane, color: 'from-blue-500 to-cyan-500' },
  { id: 2, name: 'Kingstown', icon: Building2, color: 'from-green-500 to-teal-500' },
  { id: 3, name: 'Villa Beach', icon: Palmtree, color: 'from-orange-500 to-yellow-500' },
  { id: 4, name: 'Port Elizabeth, Bequia', icon: Ship, color: 'from-purple-500 to-pink-500' },
  { id: 5, name: 'Mesopotamia', icon: Palmtree, color: 'from-green-600 to-emerald-500' },
  { id: 6, name: 'Layou', icon: Building2, color: 'from-red-500 to-orange-500' },
];

const quickTimes = [
  { label: 'ASAP', value: 'ASAP' },
  { label: '30 min', value: '30 minutes' },
  { label: '1 hour', value: '1 hour' },
  { label: '2 hours', value: '2 hours' },
];
export default function BookingPageClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [recentDestinations, setRecentDestinations] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickup: '',
    destination: '',
    date: '',
    time: '',
    timeType: 'ASAP',
    passengers: '1',
    notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('recentDestinations');
    if (saved) {
      setRecentDestinations(JSON.parse(saved));
    }
  }, []);

  const saveToRecent = (destination: string) => {
    if (!destination) return;
    const updated = [destination, ...recentDestinations.filter(d => d !== destination)].slice(0, 5);
    setRecentDestinations(updated);
    localStorage.setItem('recentDestinations', JSON.stringify(updated));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };
  
  // Handle Submit
  const handleSubmit = async () => {
    saveToRecent(formData.pickup);
    saveToRecent(formData.destination);

    // Save booking to Firebase
    try {
      await addDoc(collection(db, 'bookings'), {
        name: formData.name,
        phone: formData.phone || 'Not provided',
        pickup: formData.pickup,
        destination: formData.destination,
        date: formData.date || 'Today',
        time: formData.timeType === 'ASAP' ? 'ASAP' : formData.time || formData.timeType,
        passengers: formData.passengers,
        notes: formData.notes || 'None',
        status: 'pending',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving booking:', error);
    }

    const message = `*RANCHIE TAXI BOOKING REQUEST*
----------------------------------------

*Passenger:* ${formData.name}
*Phone:* ${formData.phone || 'Not provided'}

*Pickup:* ${formData.pickup}
*Destination:* ${formData.destination}

*Date:* ${formData.date || 'Today'}
*Time:* ${formData.timeType === 'ASAP' ? 'ASAP' : formData.time || formData.timeType}
*Passengers:* ${formData.passengers}

*Notes:* ${formData.notes || 'None'}

----------------------------------------
Sent via Ranchie Taxi App`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/17844932354?text=${encoded}`, '_blank');

    // Delay redirect to allow WhatsApp to open
    await new Promise(resolve => setTimeout(resolve, 1000));

    const params = new URLSearchParams({
      name: formData.name || 'Guest',
      pickup: formData.pickup,
      destination: formData.destination,
      date: formData.date || 'Today',
      time: formData.timeType === 'ASAP' ? 'ASAP' : formData.time || formData.timeType,
      passengers: `${formData.passengers} passenger${formData.passengers !== '1' ? 's' : ''}`
    });
    
    router.push(`/confirmation?${params.toString()}`);
  };

     
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.pickup.length > 0;
      case 2:
        return formData.destination.length > 0;
      case 3:
        return true;
      case 4:
        return formData.name.length > 0;
      default:
        return false;
    }
  };

  const today = new Date().toISOString().split('T')[0];
  return (
    <div 
      className="min-h-screen pb-24"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.55)), url('/images/book-your-ride.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => currentStep > 1 ? prevStep() : router.push('/')}
            className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center hover:from-gray-200 hover:to-gray-300 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <img
            src="https://i.postimg.cc/N0tzBQTm/Screenshot-20250725-221145-Canva.jpg"
            alt="Ranchie Taxi"
            className="w-10 h-10 rounded-lg object-cover shadow-md"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-serif bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Book Your Ride
            </h1>
            <p className="text-xs text-gray-500">Step {currentStep} of 4</p>
          </div>
          <Sparkles className="text-yellow-500 animate-pulse" size={20} />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-500 ${
                  step < currentStep
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                    : step === currentStep
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white ring-4 ring-orange-200'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step < currentStep ? <Check size={20} /> : step}
              </div>
              {step < 4 && (
                <div
                  className={`w-12 sm:w-20 h-1 mx-1 rounded transition-all duration-500 ${
                    step < currentStep ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>Pickup</span>
          <span>Destination</span>
          <span>When</span>
          <span>Review</span>
        </div>
      </div>
<div className="max-w-3xl mx-auto px-4">
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
          
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Where to pick you up?</h2>
                    <p className="text-sm text-gray-500">Enter your pickup location</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Enter pickup address..."
                  value={formData.pickup}
                  onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg transition-all text-gray-900 bg-white placeholder:text-gray-500"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-500" />
                  Popular Pickup Points
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {popularDestinations.slice(0, 4).map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => setFormData({ ...formData, pickup: dest.name })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.pickup === dest.name
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${dest.color} rounded-lg flex items-center justify-center mb-2`}>
                        <dest.icon className="text-white" size={16} />
                      </div>
                      <span className="text-sm font-medium">{dest.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {recentDestinations.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    Recent Locations
                  </h3>
                  <div className="space-y-2">
                    {recentDestinations.map((dest, index) => (
                      <button
                        key={index}
                        onClick={() => setFormData({ ...formData, pickup: dest })}
                        className="w-full p-3 text-left rounded-xl hover:bg-gray-50 transition-all flex items-center gap-3"
                      >
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm">{dest}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Where are you going?</h2>
                    <p className="text-sm text-gray-500">Enter your destination</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Enter destination..."
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-lg transition-all text-gray-900 bg-white placeholder:text-gray-500"
                />
              </div>

              <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-4 text-white">
                <p className="text-sm opacity-80">Picking up from:</p>
                <p className="font-semibold">{formData.pickup}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-500" />
                  Popular Destinations
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {popularDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => setFormData({ ...formData, destination: dest.name })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.destination === dest.name
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${dest.color} rounded-lg flex items-center justify-center mb-2`}>
                        <dest.icon className="text-white" size={16} />
                      </div>
                      <span className="text-sm font-medium">{dest.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
{currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">When do you need the ride?</h2>
                    <p className="text-sm text-gray-500">Select date and time</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Quick Options:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {quickTimes.map((time) => (
                      <button
                        key={time.value}
                        onClick={() => setFormData({ ...formData, timeType: time.value, time: '' })}
                        className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all ${
                          formData.timeType === time.value
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {time.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-3">Or choose specific date & time:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        min={today}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value, timeType: 'custom' })}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value, timeType: 'custom' })}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Passengers</label>
                  <div className="flex gap-2">
                    {['1', '2', '3', '4', '5+'].map((num) => (
                      <button
                        key={num}
                        onClick={() => setFormData({ ...formData, passengers: num })}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                          formData.passengers === num
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} />
                  <span className="text-sm opacity-80">From:</span>
                  <span className="font-semibold">{formData.pickup}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span className="text-sm opacity-80">To:</span>
                  <span className="font-semibold">{formData.destination}</span>
                </div>
              </div>
            </div>
          )}
{currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Check className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Review Your Booking</h2>
                    <p className="text-sm text-gray-500">Confirm details before sending</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Your Contact Info:</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none text-gray-900 bg-white placeholder:text-gray-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none text-gray-900 bg-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Pickup</span>
                    <span className="text-sm font-medium text-right max-w-[60%]">{formData.pickup}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Destination</span>
                    <span className="text-sm font-medium text-right max-w-[60%]">{formData.destination}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="text-sm font-medium">{formData.date || 'Today'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Time</span>
                    <span className="text-sm font-medium">
                      {formData.timeType === 'ASAP' ? 'ASAP' : formData.time || formData.timeType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Passengers</span>
                    <span className="text-sm font-medium">{formData.passengers}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes (Optional)</label>
                  <textarea
                    placeholder="Any special requests? (luggage, child seat, etc.)"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none text-gray-900 bg-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white">
                <p className="text-sm flex items-center gap-2">
                  <Car size={16} />
                  Your booking will be sent to Ranchie via WhatsApp for fast confirmation!
                </p>
              </div>
            </div>
          )}
</div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 p-4 z-30">
        <div className="max-w-3xl mx-auto flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 py-4 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                isStepValid()
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-4 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Send Booking via WhatsApp
            </button>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}                                    