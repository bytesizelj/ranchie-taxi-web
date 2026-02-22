'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
  RefreshCw,
  Lock,
  LogOut,
  Bell,
  BellOff
} from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  passengers: string;
  notes: string;
  status: string;
  createdAt: any;
}

export default function DriverDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  
  const previousBookingCount = useRef<number>(0);
  const isFirstLoad = useRef<boolean>(true);

  const DRIVER_PIN = 'ufuhreal?';

  // Play notification sound
  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Play a pleasant two-tone chime
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioContext.currentTime;
    playTone(880, now, 0.2);        // A5
    playTone(1108, now + 0.2, 0.3); // C#6
    playTone(1320, now + 0.4, 0.4); // E6
  };

  // Show browser notification
  const showNotification = (booking: Booking) => {
    if (notificationPermission === 'granted') {
      const notification = new Notification('🚕 New Booking!', {
        body: `${booking.name}\n${booking.pickup} → ${booking.destination}\n${booking.date} at ${booking.time}`,
        icon: '/icons/icon-192x192.png',
        tag: 'new-booking',
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  // Request notification permission and register token
  const requestNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        
        // Register FCM token
        try {
          // First register the Firebase messaging service worker
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered:', registration);
          
          const { getMessaging, getToken } = await import('firebase/messaging');
          const { initializeApp, getApps } = await import('firebase/app');
          
          const firebaseConfig = {
            apiKey: "AIzaSyC49BbFJhjpHajencr1W6VlpiFwpWTeD8U",
            authDomain: "ranchie-taxi-1e166.firebaseapp.com",
            projectId: "ranchie-taxi-1e166",
            storageBucket: "ranchie-taxi-1e166.firebasestorage.app",
            messagingSenderId: "878235673378",
            appId: "1:878235673378:web:27c56cd1c6b91207827b7b"
          };
          
          const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
          const messaging = getMessaging(app);
          
          const token = await getToken(messaging, {
            vapidKey: 'BDSsQM1TWmDya0nStraOFO8Zsa_B2Szvvm6LInz6rUmOmlrceF7dj7LHQDLpotSF5p6aODBpvp8MIfCffKNj-EA',
            serviceWorkerRegistration: registration
          });
          
          if (token) {
            // Save token to Firestore
            await setDoc(doc(db, 'fcmTokens', token), {
              token: token,
              createdAt: new Date(),
              device: navigator.userAgent
            });
            console.log('FCM Token registered:', token);
          }
        } catch (error) {
          console.error('Error getting FCM token:', error);
        }
      }
    }
  };

  // Toggle notifications
  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      await requestNotificationPermission();
    } else {
      setNotificationsEnabled(false);
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('driverAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    
    // Check notification permission on load
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, []);

  const handleLogin = () => {
    if (password === DRIVER_PIN) {
      setIsAuthenticated(true);
      localStorage.setItem('driverAuth', 'true');
      setError('');
    } else {
      setError('Incorrect PIN');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('driverAuth');
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData: Booking[] = [];
      snapshot.forEach((doc) => {
        bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
      });
      
      // Check for new bookings (only after first load)
      if (!isFirstLoad.current && bookingsData.length > previousBookingCount.current) {
        const newBooking = bookingsData[0]; // Most recent booking
        
        if (notificationsEnabled) {
          playNotificationSound();
          showNotification(newBooking);
        }
      }
      
      previousBookingCount.current = bookingsData.length;
      isFirstLoad.current = false;
      
      setBookings(bookingsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, notificationsEnabled]);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getTodayBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(b => b.date === today || b.date === 'Today');
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const todayBookings = getTodayBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle size={16} />;
      case 'accepted': return <CheckCircle size={16} />;
      case 'confirmed': return <Car size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Driver Login</h1>
            <p className="text-gray-500 text-sm">Enter your PIN to access the dashboard</p>
          </div>
          
          <input
            type="password"
            placeholder="Enter PIN"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-center text-2xl tracking-widest mb-4"
          />
          
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}
          
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Login
          </button>
          
          <Link href="/" className="block text-center text-gray-500 text-sm mt-4 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            href="/" 
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Driver Dashboard</h1>
            <p className="text-sm opacity-80">Manage your bookings</p>
          </div>
          <div className="text-right mr-1 sm:mr-2">
            <p className="text-xl sm:text-2xl font-bold">{bookings.length}</p>
            <p className="text-xs opacity-80 hidden sm:block">Total Bookings</p>
          </div>
          {/* Notification Toggle */}
          <button
            onClick={toggleNotifications}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              notificationsEnabled 
                ? 'bg-yellow-400 text-yellow-900' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
            title={notificationsEnabled ? 'Notifications ON' : 'Notifications OFF'}
          >
            {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
          </button>
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Notification Permission Banner */}
      {notificationPermission === 'default' && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-sm text-blue-800">
              🔔 Enable notifications to get alerts for new bookings
            </p>
            <button
              onClick={requestNotificationPermission}
              className="px-4 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700"
            >
              Enable
            </button>
          </div>
        </div>
      )}

      {notificationPermission === 'denied' && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-red-800">
              ⚠️ Notifications blocked. Please enable them in your browser settings to receive booking alerts.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Today's Reminders */}
        {todayBookings.length > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white mb-6 shadow-lg">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <AlertCircle size={20} />
              Today's Pickups ({todayBookings.length})
            </h2>
            <div className="space-y-3">
              {todayBookings.map((booking) => (
                <div key={booking.id} className="bg-white/20 rounded-xl p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{booking.pickup} → {booking.destination}</p>
                      <p className="text-sm opacity-90">{booking.time} - {booking.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {['all', 'pending', 'accepted', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-1 opacity-70">
                  ({bookings.filter(b => b.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="animate-spin mx-auto mb-3 text-gray-400" size={32} />
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Calendar className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{booking.name}</h3>
                    <p className="text-sm text-gray-500">
                      {booking.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-green-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="text-sm font-medium">{booking.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-red-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Destination</p>
                      <p className="text-sm font-medium">{booking.destination}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm">{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-sm">{booking.passengers}</span>
                    </div>
                  </div>
                  {booking.phone !== 'Not provided' && (
                    <a href={`tel:${booking.phone}`} className="flex items-center gap-2 text-blue-600">
                      <Phone size={16} />
                      <span className="text-sm">{booking.phone}</span>
                    </a>
                  )}
                  {booking.notes !== 'None' && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      📝 {booking.notes}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(booking.id, 'accepted')}
                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'declined')}
                        className="px-4 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all"
                      >
                        ❌ Decline
                      </button>
                    </>
                  )}
                  {(booking.status === 'accepted' || booking.status === 'confirmed') && (
                    <button
                      onClick={() => updateStatus(booking.id, 'completed')}
                      className="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-all"
                    >
                      Mark Complete
                    </button>
                  )}
                  {(booking.status === 'completed' || booking.status === 'cancelled') && (
                    <button
                      onClick={() => updateStatus(booking.id, 'pending')}
                      className="flex-1 py-2 bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-300 transition-all"
                    >
                      Reset to Pending
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}