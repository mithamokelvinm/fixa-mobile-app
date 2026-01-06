
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Map as MapIcon, 
  Home, 
  Calendar, 
  MessageSquare, 
  User as UserIcon,
  Bell,
  Navigation as NavIcon,
  ChevronRight,
  Star,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  Phone,
  ArrowRight,
  // Fix: Added missing icons for category visualization
  Wrench,
  Zap,
  Trash2,
  Hammer,
  Car,
  Paintbrush,
  Wind,
  Scissors
} from 'lucide-react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES, MOCK_PROVIDERS } from './constants';
import { ServiceProvider, UserRole, Booking, User } from './types';
import { getAIAssistantResponse } from './services/geminiService';

// --- Components ---

const Header: React.FC<{ user: User | null; onToggleRole: () => void }> = ({ user, onToggleRole }) => (
  <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">F</span>
      </div>
      <div>
        <h1 className="text-lg font-bold text-gray-900 leading-tight">Fixa</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Quality Service Nearby</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button 
        onClick={onToggleRole}
        className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100"
      >
        Switch to {user?.role === 'client' ? 'Provider' : 'Client'}
      </button>
      <div className="relative">
        <Bell className="w-6 h-6 text-gray-600" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">2</span>
      </div>
    </div>
  </header>
);

const Navigation: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex justify-around items-center py-2 pb-safe-area-inset-bottom">
      <Link to="/" className={`flex flex-col items-center gap-1 p-2 ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-medium">Explore</span>
      </Link>
      <Link to="/bookings" className={`flex flex-col items-center gap-1 p-2 ${isActive('/bookings') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Calendar className="w-6 h-6" />
        <span className="text-[10px] font-medium">Bookings</span>
      </Link>
      <Link to="/chat" className={`flex flex-col items-center gap-1 p-2 ${isActive('/chat') ? 'text-blue-600' : 'text-gray-400'}`}>
        <MessageSquare className="w-6 h-6" />
        <span className="text-[10px] font-medium">Inbox</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center gap-1 p-2 ${isActive('/profile') ? 'text-blue-600' : 'text-gray-400'}`}>
        <UserIcon className="w-6 h-6" />
        <span className="text-[10px] font-medium">Profile</span>
      </Link>
    </nav>
  );
};

// --- Pages ---

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const filteredProviders = MOCK_PROVIDERS.filter(p => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoadingAI(true);
    setShowAI(true);
    const res = await getAIAssistantResponse(searchQuery);
    setAiResponse(res || '');
    setLoadingAI(false);
  };

  return (
    <div className="pb-24">
      {/* Search & Location Bar */}
      <div className="bg-white px-4 py-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <NavIcon className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-900">Westlands, Nairobi</span>
          <span className="text-blue-600 font-medium text-xs ml-auto">Change</span>
        </div>
        <form onSubmit={handleAISearch} className="relative">
          <input 
            type="text" 
            placeholder="What do you need help with? Try 'fix leaking tap'"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      {/* Categories */}
      <div className="px-4 py-6 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Categories</h2>
          <button className="text-blue-600 text-xs font-semibold">See All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className="flex flex-col items-center gap-2 min-w-[70px]"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedCategory === cat.id ? 'bg-blue-600 ring-4 ring-blue-100' : cat.color}`}>
                {cat.id === 'plumbing' && <Wrench className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-white' : ''}`} />}
                {cat.id === 'electrical' && <Zap className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-white' : ''}`} />}
                {cat.id === 'cleaning' && <Trash2 className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-white' : ''}`} />}
                {cat.id === 'carpentry' && <Hammer className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-white' : ''}`} />}
                {cat.id === 'mechanic' && <Car className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-white' : ''}`} />}
                {cat.id === 'painting' && <Paintbrush className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-white' : ''}`} />}
                {cat.id === 'hvac' && <Wind className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-white' : ''}`} />}
                {cat.id === 'beauty' && <Scissors className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-white' : ''}`} />}
              </div>
              <span className={`text-[11px] font-medium text-center ${selectedCategory === cat.id ? 'text-blue-600' : 'text-gray-600'}`}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Search Helper */}
      {showAI && (
        <div className="mx-4 mt-6 p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <button onClick={() => setShowAI(false)} className="absolute top-2 right-2 text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <span className="text-[10px] font-bold">AI</span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider">Fixa Smart Assistant</span>
          </div>
          <div className="text-sm leading-relaxed">
            {loadingAI ? (
              <div className="flex items-center gap-2 py-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            ) : (
              <p>{aiResponse}</p>
            )}
          </div>
        </div>
      )}

      {/* Nearby Providers */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-lg">Top Providers Nearby</h2>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            <MapIcon className="w-3 h-3" />
            <span>Map View</span>
          </div>
        </div>

        <div className="space-y-4">
          {filteredProviders.map(provider => (
            <Link to={`/provider/${provider.id}`} key={provider.id} className="block bg-white p-4 rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all">
              <div className="flex gap-4">
                <div className="relative">
                  <img src={provider.avatar} alt={provider.name} className="w-20 h-20 rounded-xl object-cover" />
                  {provider.availability === 'online' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-gray-900">{provider.name}</h3>
                        {provider.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                      </div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">{provider.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">KES {provider.pricePerHour.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 font-medium">per hour</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-gray-900">{provider.rating}</span>
                      <span className="text-xs text-gray-400 font-medium">({provider.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <NavIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500 font-medium">{provider.distance} km</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex gap-1">
                  {provider.skills.slice(0, 2).map(skill => (
                    <span key={skill} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{skill}</span>
                  ))}
                </div>
                <button className="text-blue-600 text-xs font-bold flex items-center gap-1">
                  View Profile <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
          
          {filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-900">No providers found</h3>
              <p className="text-sm text-gray-500">Try changing your search or category filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProviderDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [mPesaPhone, setMPesaPhone] = useState('0712 345 678');
  const [isProcessing, setIsProcessing] = useState(false);

  // Simplified for demo - picking first provider
  const provider = MOCK_PROVIDERS[0];

  const handleBooking = () => {
    setShowBooking(true);
  };

  const handleSTKPush = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBookingConfirmed(true);
      setShowBooking(false);
    }, 2500);
  };

  return (
    <div className="pb-32">
      {/* Photo Header */}
      <div className="relative h-64">
        <img src={provider.avatar} className="w-full h-full object-cover" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-900">
          <X className="w-6 h-6" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
          <div className="flex items-center gap-2 text-white">
            <h1 className="text-2xl font-bold">{provider.name}</h1>
            {provider.isVerified && <ShieldCheck className="w-5 h-5 text-blue-400" />}
          </div>
          <p className="text-white/80 font-medium uppercase tracking-widest text-xs">{provider.category}</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div>
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-900">{provider.rating}</span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Ratings</p>
          </div>
          <div className="border-x border-gray-100">
            <p className="font-bold text-gray-900">450+</p>
            <p className="text-[10px] text-gray-500 font-medium">Jobs Done</p>
          </div>
          <div>
            <p className="font-bold text-gray-900">{provider.distance}km</p>
            <p className="text-[10px] text-gray-500 font-medium">Distance</p>
          </div>
        </div>

        {/* Bio */}
        <section>
          <h2 className="font-bold text-gray-900 mb-2">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{provider.bio}</p>
        </section>

        {/* Skills */}
        <section>
          <h2 className="font-bold text-gray-900 mb-3">Skills & Services</h2>
          <div className="flex flex-wrap gap-2">
            {provider.skills.map(skill => (
              <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Reviews ({provider.reviewCount})</h2>
            <button className="text-blue-600 text-xs font-bold">See All</button>
          </div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src={`https://picsum.photos/seed/${i+10}/50/50`} className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-bold text-gray-900">Customer {i}</span>
                  </div>
                  <div className="flex text-yellow-400">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <Star className="w-3 h-3 fill-yellow-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-600">Excellent work! Samuel fixed my burst pipe in under 30 minutes. Highly recommend for any plumbing emergencies.</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Persistent CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe-area-inset-bottom flex items-center justify-between gap-4 z-50">
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Est.</p>
          <p className="text-xl font-black text-gray-900">KES {provider.pricePerHour.toLocaleString()}</p>
        </div>
        <div className="flex-1 flex gap-2">
          <button className="flex-1 bg-gray-100 text-gray-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button 
            onClick={handleBooking}
            className="flex-[2] bg-blue-600 text-white py-3.5 rounded-xl font-bold active:scale-95 transition-all shadow-lg shadow-blue-200"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Booking / M-Pesa Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBooking(false)}></div>
          <div className="relative bg-white rounded-t-[32px] p-6 pt-2 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-4"></div>
            
            {!paymentStep ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Confirm Booking</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold">DATE</p>
                        <p className="text-sm font-bold text-gray-900">Oct 24, 2023</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-blue-600">Edit</button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <NavIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold">LOCATION</p>
                        <p className="text-sm font-bold text-gray-900">My Home (Default)</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-blue-600">Edit</button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Service Fee (1 hr)</span>
                    <span className="font-bold">KES {provider.pricePerHour.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Convenience Fee</span>
                    <span className="font-bold">KES 50</span>
                  </div>
                  <div className="pt-2 border-t border-blue-200 flex justify-between">
                    <span className="font-bold text-blue-900">Total</span>
                    <span className="font-black text-blue-900">KES {(provider.pricePerHour + 50).toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setPaymentStep(true)}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  Proceed to Payment <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <button onClick={() => setPaymentStep(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">M-PESA Payment</h2>
                </div>

                <div className="flex items-center justify-center py-6">
                  <div className="bg-[#41B649] px-6 py-2 rounded-xl text-white font-bold text-2xl tracking-widest flex items-center gap-2">
                    M-PESA
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Phone Number</span>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <input 
                        type="tel" 
                        value={mPesaPhone}
                        onChange={(e) => setMPesaPhone(e.target.value)}
                        className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 font-bold focus:ring-2 focus:ring-[#41B649]"
                      />
                    </div>
                  </label>

                  <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-xs text-gray-500 text-center">You will receive an STK Push on your phone to enter your M-Pesa PIN and complete the payment of <span className="font-bold">KES {(provider.pricePerHour + 50).toLocaleString()}</span></p>
                  </div>
                </div>

                <button 
                  onClick={handleSTKPush}
                  disabled={isProcessing}
                  className="w-full bg-[#41B649] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>Pay with M-PESA STK Push</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Success */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-[70] bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 scale-110 animate-bounce">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-8 max-w-xs">Your payment was successful and Samuel has been notified of your request.</p>
          
          <div className="w-full bg-gray-50 p-6 rounded-3xl mb-8 space-y-4 text-left">
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Provider</span>
              <span className="font-bold">{provider.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Receipt</span>
              <span className="font-mono text-xs bg-white px-2 py-1 rounded border border-gray-100">RH7839JK2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Date & Time</span>
              <span className="font-bold">Oct 24, 2023 at 10:00 AM</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/bookings')}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200"
          >
            Go to My Bookings
          </button>
        </div>
      )}
    </div>
  );
};

const BookingsPage: React.FC = () => {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
      <div className="flex gap-4 border-b border-gray-100 mb-6">
        <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-bold text-sm px-1">Upcoming</button>
        <button className="pb-3 text-gray-400 font-medium text-sm px-1">Completed</button>
        <button className="pb-3 text-gray-400 font-medium text-sm px-1">Cancelled</button>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-blue-50 text-blue-600 rounded">Upcoming</span>
            <span className="text-xs text-gray-400">Booking #RH7839JK2</span>
          </div>
          <div className="flex gap-4">
            <img src={MOCK_PROVIDERS[0].avatar} className="w-14 h-14 rounded-xl object-cover" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{MOCK_PROVIDERS[0].name}</h3>
              <p className="text-xs text-gray-500">Plumbing Service</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-bold text-gray-900">Oct 24, 2023</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-gray-900">10:00 AM</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex gap-3">
            <button className="flex-1 py-2 text-sm font-bold text-gray-500 border border-gray-200 rounded-xl">Cancel</button>
            <button className="flex-1 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl">Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage: React.FC<{ user: User | null }> = ({ user }) => {
  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <img src={user?.avatar} className="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white">
            <NavIcon className="w-3 h-3 fill-white" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900">{user?.name}</h1>
          <p className="text-sm text-gray-500">{user?.phone}</p>
          <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 uppercase">
            <CheckCircle2 className="w-3 h-3" /> Verified Account
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">General</h2>
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-900">Personal Info</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
            <div className="p-4 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-900">Payment Methods</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <NavIcon className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-900">Manage Addresses</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Support</h2>
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-900">Terms of Service</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-900">Help Center</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </section>

        <button className="w-full py-4 text-red-500 font-bold bg-white border border-red-100 rounded-2xl shadow-sm">
          Log Out
        </button>
      </div>
    </div>
  );
};

const ProviderDashboard: React.FC = () => {
  return (
    <div className="px-4 py-6 space-y-8">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[32px] text-white shadow-xl shadow-blue-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Total Earnings</p>
            <h1 className="text-3xl font-black mt-1">KES 48,250</h1>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
            <p className="text-[10px] text-blue-100 font-bold uppercase">Pending</p>
            <p className="text-lg font-bold">KES 3,400</p>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
            <p className="text-[10px] text-blue-100 font-bold uppercase">This Week</p>
            <p className="text-lg font-bold">KES 12,200</p>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-gray-900 text-lg">New Requests</h2>
          <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">3 NEW</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border-2 border-blue-50 shadow-md">
          <div className="flex gap-4 items-start mb-4">
            <img src="https://picsum.photos/seed/req/100/100" className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Leaking Kitchen Tap</h3>
              <p className="text-xs text-gray-500">2.4km • Westlands</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600">KES 1,500</p>
              <p className="text-[10px] text-gray-400 font-medium">Est. 1 hr</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-50 rounded-xl">Ignore</button>
            <button className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-100">Accept Job</button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-black text-gray-900 text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <NavIcon className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-gray-900">Service Area</span>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-gray-900">View Ratings</span>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- App Root ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'u1',
    name: 'Kevin Otieno',
    phone: '+254700000000',
    role: 'client',
    avatar: 'https://picsum.photos/seed/user1/100/100',
  });

  const toggleRole = () => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      role: currentUser.role === 'client' ? 'provider' : 'client'
    });
  };

  return (
    <Router>
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative shadow-2xl overflow-x-hidden">
        <Header user={currentUser} onToggleRole={toggleRole} />
        
        <main className="pb-24">
          <Routes>
            <Route path="/" element={currentUser?.role === 'client' ? <ExplorePage /> : <ProviderDashboard />} />
            <Route path="/provider/:id" element={<ProviderDetailPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/profile" element={<ProfilePage user={currentUser} />} />
            <Route path="/chat" element={
              <div className="p-8 text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Your Messages</h2>
                <p className="text-gray-500 mt-2">No active conversations. Start a booking to chat with a professional.</p>
              </div>
            } />
          </Routes>
        </main>

        <Navigation />

        <style>{`
          @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-slide-up {
            animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          .pb-safe-area-inset-bottom {
            padding-bottom: env(safe-area-inset-bottom);
          }
        `}</style>
      </div>
    </Router>
  );
};

export default App;
