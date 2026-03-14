'use client';
declare global {
  interface Window {
    google: typeof google;
  }
}
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Loader2,
  Globe
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/lib/LanguageContext';

const popularDestinations = [
  { id: 1, key: 'argyleAirport' as const, icon: Plane, color: 'from-blue-500 to-cyan-500' },
  { id: 2, key: 'montrealGardens' as const, icon: Palmtree, color: 'from-green-600 to-emerald-500' },
  { id: 3, key: 'villaBeach' as const, icon: Palmtree, color: 'from-orange-500 to-yellow-500' },
  { id: 4, key: 'cruiseTerminal' as const, icon: Ship, color: 'from-purple-500 to-pink-500' },
  { id: 5, key: 'montrealGardens' as const, icon: Building2, color: 'from-green-500 to-teal-500' },
  { id: 6, key: 'layouBeach' as const, icon: Building2, color: 'from-red-500 to-orange-500' },
];

export default function BookingPageClient() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [recentDestinations, setRecentDestinations] = useState<string[]>([]);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);

  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google?.maps?.places) {
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
      }
    };
    if (window.google?.maps?.places) {
      initAutocomplete();
    } else {
      const interval = setInterval(() => {
        if (window.google?.maps?.places) {
          initAutocomplete();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  const getSuggestions = (input: string, callback: (results: string[]) => void) => {
    if (!autocompleteServiceRef.current || input.length < 2) {
      callback([]);
      return;
    }
    autocompleteServiceRef.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 'vc' },
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          callback(predictions.map((p) => p.description));
        } else {
          callback([]);
        }
      }
    );
  };  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickup: '',
    destination: '',
    date: '',
    time: '',
    timeType: 'custom',
    passengers: '1',
    notes: '',
    flightNumber: ''
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    saveToRecent(formData.pickup);
    saveToRecent(formData.destination);

    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        name: formData.name,
        phone: formData.phone,
        pickup: formData.pickup,
        destination: formData.destination,
        date: formData.date || 'Today',
        time: formData.timeType === 'ASAP' ? 'ASAP' : formData.time || formData.timeType,
        passengers: formData.passengers,
        notes: formData.notes || 'None',
        flightNumber: formData.flightNumber || '',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      router.push(`/booking-status/${docRef.id}`);
    } catch (error) {
      console.error('Error saving booking:', error);
      setIsSubmitting(false);
    }
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
        return formData.name.length > 0 && formData.phone.replace(/[^0-9]/g, '').length >= 7;
      default:
        return false;
    }
  };

  const today = new Date().toISOString().split('T')[0];
  return (
    <><style>{`
      @keyframes booking-bg-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes booking-pulse {
        0%, 100% { transform: scale(1); text-shadow: 0 0 5px rgba(255,255,255,0.3); }
        50% { transform: scale(1.08); text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4); }
      }
        .goog-te-banner-frame { display: none !important; }
      body { top: 0 !important; }
      #google_translate_element.hidden { display: none; }
      #google_translate_element:not(.hidden) { 
        display: flex !important; 
        justify-content: center;
        padding: 8px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .goog-te-gadget { font-family: inherit !important; }
      .goog-te-combo { padding: 8px 12px; border-radius: 12px; border: 2px solid #e5e7eb; font-size: 14px; }
    `}</style>
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
            className="w-10 h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center hover:from-gray-400 hover:to-gray-500 transition-all"
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
              {t.bookYourRide}
            </h1>
            <p className="text-xs text-gray-500">Step {currentStep} {t.stepOf} 4</p>
          </div>
          <Sparkles className="text-yellow-500 animate-pulse" size={20} />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-2 flex justify-center gap-2 flex-wrap">
          {[
            { code: 'en', flag: '🇬🇧', label: 'EN', color: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/50' },
            { code: 'fr', flag: '🇫🇷', label: 'FR', color: 'from-red-500 to-pink-600', glow: 'shadow-red-500/50' },
            { code: 'es', flag: '🇪🇸', label: 'ES', color: 'from-yellow-500 to-orange-500', glow: 'shadow-yellow-500/50' },
            { code: 'pt', flag: '🇧🇷', label: 'PT', color: 'from-green-500 to-emerald-600', glow: 'shadow-green-500/50' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                const frame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
                if (frame) frame.style.display = 'none';
                document.body.style.top = '0px';
                const el = document.getElementById('google_translate_element');
                if (el) el.classList.add('hidden');
                const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                if (select) { select.value = ''; select.dispatchEvent(new Event('change')); }
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                language === lang.code
                  ? `bg-gradient-to-r ${lang.color} text-white shadow-lg ${lang.glow} scale-110 ring-2 ring-white`
                  : 'bg-white/80 text-gray-700 hover:scale-105 hover:shadow-md border border-gray-200'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              const el = document.getElementById('google_translate_element');
              if (el) {
                el.classList.toggle('hidden');
                const select = el.querySelector('.goog-te-combo') as HTMLSelectElement;
                if (select) select.focus();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:scale-105 hover:shadow-lg shadow-purple-500/50 animate-pulse"
          >
            <Globe size={16} />
            <span>More</span>
          </button>
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
                  className={`w-8 sm:w-20 h-1 mx-0.5 sm:mx-1 rounded transition-all duration-500 ${
                    step < currentStep ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>{t.pickup}</span>
          <span>{t.destination}</span>
          <span>{t.when}</span>
          <span>{t.review}</span>
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
                    <h2 className="text-xl font-bold text-gray-900">{t.wherePickup}</h2>
                    <p className="text-sm text-gray-500">{t.enterPickup}</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    ref={pickupInputRef}
                    type="text"
                    placeholder={t.enterPickupPlaceholder}
                    value={formData.pickup}
                    onChange={(e) => {
                      setFormData({ ...formData, pickup: e.target.value });
                      getSuggestions(e.target.value, setPickupSuggestions);
                    }}
                    onBlur={() => setTimeout(() => setPickupSuggestions([]), 200)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg transition-all text-gray-900 bg-white placeholder:text-gray-500"
                  />
                  {pickupSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
                      {pickupSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onMouseDown={() => {
                            setFormData({ ...formData, pickup: suggestion });
                            setPickupSuggestions([]);
                          }}
                          className="w-full p-3 text-left text-sm text-gray-900 hover:bg-green-50 flex items-center gap-2 border-b border-gray-100 last:border-0"
                        >
                          <MapPin size={14} className="text-green-500 shrink-0" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-500" />
                  {t.popularPickups}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {popularDestinations.slice(0, 4).map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => setFormData({ ...formData, pickup: t[dest.key] })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.pickup === t[dest.key]
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${dest.color} rounded-lg flex items-center justify-center mb-2`}>
                        <dest.icon className="text-white" size={16} />
                      </div>
                     <span className="text-sm font-medium text-gray-900">{t[dest.key]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {recentDestinations.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    {t.recentLocations}
                  </h3>
                  <div className="space-y-2">
                    {recentDestinations.map((dest, index) => (
                      <button
                        key={index}
                        onClick={() => setFormData({ ...formData, pickup: dest })}
                        className="w-full p-3 text-left rounded-xl hover:bg-gray-50 transition-all flex items-center gap-3"
                      >
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{dest}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            {/* Pricing Info */}
              <div 
                className="rounded-2xl p-5 text-white shadow-lg relative overflow-hidden"
                style={{
                  background: 'linear-gradient(270deg, #f97316, #ef4444, #f59e0b, #ef4444)',
                  backgroundSize: '300% 300%',
                  animation: 'booking-bg-shift 6s ease infinite'
                }}
              >
                <h3 
                  className="font-bold text-lg mb-3 flex items-center gap-2 text-yellow-300"
                  style={{ animation: 'booking-pulse 2s ease-in-out infinite' }}
                >
                  💰 {t.airportRates}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white/20 rounded-xl p-3">
                    <span className="text-sm font-medium">AIA → Sandals ({t.persons12})</span>
                    <span className="font-bold text-base sm:text-lg">US$65</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/20 rounded-xl p-3">
                    <span className="text-sm font-medium">AIA → Sandals ({t.persons3plus})</span>
                    <span className="font-bold text-base sm:text-lg">US$30<span className="text-xs font-normal">/person</span></span>
                  </div>
                </div>
              </div>
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
                    <h2 className="text-xl font-bold text-gray-900">{t.whereGoing}</h2>
                    <p className="text-sm text-gray-500">{t.enterDestination}</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    ref={destinationInputRef}
                    type="text"
                    placeholder={t.enterDestinationPlaceholder}
                    value={formData.destination}
                    onChange={(e) => {
                      setFormData({ ...formData, destination: e.target.value });
                      getSuggestions(e.target.value, setDestinationSuggestions);
                    }}
                    onBlur={() => setTimeout(() => setDestinationSuggestions([]), 200)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-lg transition-all text-gray-900 bg-white placeholder:text-gray-500"
                  />
                  {destinationSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
                      {destinationSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onMouseDown={() => {
                            setFormData({ ...formData, destination: suggestion });
                            setDestinationSuggestions([]);
                          }}
                          className="w-full p-3 text-left text-sm text-gray-900 hover:bg-orange-50 flex items-center gap-2 border-b border-gray-100 last:border-0"
                        >
                          <MapPin size={14} className="text-orange-500 shrink-0" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-4 text-white">
                <p className="text-sm opacity-80">{t.pickingUpFrom}</p>
                <p className="font-semibold">{formData.pickup}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-500" />
                  {t.popularDestinations}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {popularDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => setFormData({ ...formData, destination: t[dest.key] })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.destination === t[dest.key]
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${dest.color} rounded-lg flex items-center justify-center mb-2`}>
                        <dest.icon className="text-white" size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{t[dest.key]}</span>
                    </button>
                  ))}
                </div>
              </div>
            {/* Pricing Info */}
              <div 
                className="rounded-2xl p-5 text-white shadow-lg relative overflow-hidden"
                style={{
                  background: 'linear-gradient(270deg, #f97316, #ef4444, #f59e0b, #ef4444)',
                  backgroundSize: '300% 300%',
                  animation: 'booking-bg-shift 6s ease infinite'
                }}
              >
                <h3 
                  className="font-bold text-lg mb-3 flex items-center gap-2 text-yellow-300"
                  style={{ animation: 'booking-pulse 2s ease-in-out infinite' }}
                >
                  💰 {t.airportRates}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white/20 rounded-xl p-3">
                    <span className="text-sm font-medium">AIA → Sandals ({t.persons12})</span>
                    <span className="font-bold text-lg">US$65</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/20 rounded-xl p-3">
                    <span className="text-sm font-medium">AIA → Sandals ({t.persons3plus})</span>
                    <span className="font-bold text-lg">US$30<span className="text-xs font-normal">/person</span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
{currentStep === 3 && (
            <div className="space-y-4">
              {/* Flight Number - show at top if airport related */}
              {(formData.pickup.toLowerCase().includes('airport') || 
                formData.destination.toLowerCase().includes('airport') ||
                formData.pickup.toLowerCase().includes('aia') ||
                formData.destination.toLowerCase().includes('aia') ||
                formData.pickup.toLowerCase().includes('argyle') ||
                formData.destination.toLowerCase().includes('argyle')) && (
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Plane className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{t.arrivingByFlight}</h3>
                      <p className="text-sm opacity-90">{t.flightTrackMsg}</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder={t.flightPlaceholder}
                    value={formData.flightNumber}
                    onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value.toUpperCase() })}
                    className="w-full p-4 border-2 border-white/30 rounded-xl focus:border-white focus:outline-none text-lg transition-all text-white bg-white/20 placeholder:text-white/60"
                  />
                  {formData.flightNumber && (
                    <p className="text-sm mt-2 bg-white/20 rounded-lg px-3 py-2">
                      ✅ {t.flight} <span className="font-bold">{formData.flightNumber}</span> {t.flightTracked}
                    </p>
                  )}
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{t.whenRide}</h2>
                    <p className="text-sm text-gray-500">{t.selectDateTime}</p>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.date}</label>
                      <input
                        type="date"
                        min={today}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value, timeType: 'custom' })}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.time}</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.passengers}</label>
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
                  <span className="text-sm opacity-80">{t.from}</span>
                  <span className="font-semibold">{formData.pickup}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span className="text-sm opacity-80">{t.to}</span>
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
                    <h2 className="text-xl font-bold text-gray-900">{t.reviewBooking}</h2>
                    <p className="text-sm text-gray-700">{t.confirmDetails}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-800 font-medium mb-3">{t.contactInfo}</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder={t.yourName}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none text-gray-900 bg-white placeholder:text-gray-500"
                    />
                 <input
                      type="tel"
                      placeholder={t.phoneNumber}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none text-gray-900 bg-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-800 font-medium">{t.pickup}</span>
                    <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{formData.pickup}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-800 font-medium">{t.destination}</span>
                    <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{formData.destination}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-800 font-medium">Date</span>
                    <span className="text-sm font-semibold text-gray-900">{formData.date || 'Today'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-800 font-medium">Time</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formData.timeType === 'ASAP' ? 'ASAP' : formData.time || formData.timeType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-800 font-medium">{t.passengers}</span>
                    <span className="text-sm font-semibold text-gray-900">{formData.passengers}</span>
                  </div>
                  {formData.flightNumber && (
                    <div className="flex justify-between items-center py-2 border-t border-gray-200">
                      <span className="text-sm text-gray-800 font-medium">{t.flight}</span>
                      <span className="text-sm font-semibold text-blue-600">✈️ {formData.flightNumber}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.specialNotes}</label>
                  <textarea
                    placeholder={t.notesPlaceholder}
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
                  {t.bookingMsg}
                </p>
              </div>
            </div>
          )}
</div>
      </div>

      <div className="fixed bottom-20 right-4 z-30 left-4 sm:left-auto">
        <div className="flex gap-3 justify-end">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="py-3 px-6 rounded-xl font-semibold bg-white text-gray-700 hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <ArrowLeft size={18} />
              {t.back}
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`py-3 px-8 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                isStepValid()
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {t.continue}
              <ArrowRight size={18} />
            </button>
          ) : (
           <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isStepValid()}
              className={`py-3 px-8 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                isSubmitting || !isStepValid()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t.sending}
                </>
              ) : (
                <>
                  <Check size={18} />
                  {t.submitBooking}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
    </>
  );
}                               