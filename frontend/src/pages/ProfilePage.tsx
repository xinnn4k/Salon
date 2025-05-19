import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import Popup from '../components/UI/Popup';

interface UserProfile {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  avatar?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock bookings for history tab
  const [bookings, setBookings] = useState([
    {
      id: 'bk-001',
      serviceName: 'Үс засалт',
      date: '2025-05-15',
      time: '14:00',
      stylist: 'Алтанцэцэг',
      status: 'upcoming',
      price: '35,000₮',
    },
    {
      id: 'bk-002',
      serviceName: 'Хумс засалт',
      date: '2025-05-05',
      time: '10:30',
      stylist: 'Мөнхцэцэг',
      status: 'completed',
      price: '25,000₮',
    },
    {
      id: 'bk-003',
      serviceName: 'Нүүр будалт',
      date: '2025-04-28',
      time: '16:00',
      stylist: 'Туяа',
      status: 'completed',
      price: '45,000₮',
    }
  ]);

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }

    // Load user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setForm({
        email: parsedUser.email || '',
        password: parsedUser.password || '',
        name: parsedUser.name || '',
        phone: parsedUser.phone || '',
      });
    }
    setIsLoading(false);
  }, [authUser, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (popupMessage === 'Амжилттай хадгалагдлаа!') {
      // Reload profile after successful update
      setIsEditing(false);
    }
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setPopupMessage('Имэйл болон нууц үг оруулна уу.');
      setShowPopup(true);
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/users/${authUser?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to update');

      const updatedUser = await res.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setPopupMessage('Амжилттай хадгалагдлаа!');
      setShowPopup(true);
    } catch (err) {
      setPopupMessage('Алдаа гарлаа. Дахин оролдоно уу.');
      setShowPopup(true);
    }
  };


  const handleCancelEdit = () => {
    // Reset form to original user data
    if (user) {
      setForm({
        email: user.email || '',
        password: user.password || '',
        name: user.name || '',
        phone: user.phone || '',
      });
    }
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Хүлээгдэж буй';
      case 'completed':
        return 'Дууссан';
      case 'cancelled':
        return 'Цуцлагдсан';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  if (!user) return <Layout><p className="p-6">Нэвтэрсэн хэрэглэгч олдсонгүй...</p></Layout>;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-16 pb-12">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-32 md:h-48"></div>
            <div className="px-4 md:px-8 pb-6 relative">
              <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-purple-100 rounded-full border-4 border-white overflow-hidden shadow-lg flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-5xl md:text-6xl font-bold text-purple-500">
                      {(user.name?.charAt(0) || user.email.charAt(0)).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {user.name || user.email.split('@')[0]}
                  </h1>
                  <p className="text-gray-500">{user.email}</p>
                  {user.phone && <p className="text-gray-500">{user.phone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="flex border-b">
              <button
                className={`flex-1 py-4 text-center font-medium ${
                  activeTab === 'profile'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Профайл
              </button>
              <button
                className={`flex-1 py-4 text-center font-medium ${
                  activeTab === 'bookings'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('bookings')}
              >
                Захиалгын түүх
              </button>
            </div>

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Хувийн мэдээлэл</h2>
                  {!isEditing ? (
                    <Button 
                      className="bg-purple-100 text-purple-600 hover:bg-purple-200"
                      onClick={() => setIsEditing(true)}
                    >
                      Засах
                    </Button>
                  ) : null}
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Нэр</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border p-3 rounded-lg ${
                          !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'
                        }`}
                        placeholder="Нэрээ оруулна уу"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Утасны дугаар</label>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border p-3 rounded-lg ${
                          !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'
                        }`}
                        placeholder="Утасны дугаараа оруулна уу"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Имэйл</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        disabled
                        className="w-full border p-3 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Нууц үг</label>
                      <div className="relative">
                        <input
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full border p-3 rounded-lg ${
                            !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'
                          }`}
                        />
                        {isEditing && (
                          <button 
                            type="button"
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            {passwordVisible ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3">
                      <Button 
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                        onClick={handleCancelEdit}
                      >
                        Цуцлах
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Хадгалах
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Bookings Tab Content */}
            {activeTab === 'bookings' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Захиалгын түүх</h2>
                
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="font-semibold text-lg text-gray-800">{booking.serviceName}</h3>
                            <p className="text-gray-600">
                              {new Date(booking.date).toLocaleDateString('mn-MN')} • {booking.time}
                            </p>
                            <p className="text-gray-600">Мэргэжилтэн: {booking.stylist}</p>
                          </div>
                          <div className="flex flex-col items-start md:items-end justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                            <span className="font-medium text-gray-800">{booking.price}</span>
                          </div>
                        </div>
                        {booking.status === 'upcoming' && (
                          <div className="mt-4 pt-3 border-t flex justify-end">
                            <Button className="bg-red-50 text-red-600 hover:bg-red-100 text-sm">
                              Цуцлах
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Одоогоор захиалга байхгүй байна</h3>
                    <p className="mt-2 text-gray-500">Та үйлчилгээнүүдээс сонирхон захиалга хийх боломжтой.</p>
                    <div className="mt-6">
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => navigate('/services')}
                      >
                        Үйлчилгээнүүд үзэх
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showPopup && (
        <Popup message={popupMessage} onClose={handlePopupClose} />
      )}
    </Layout>
  );
};

export default ProfilePage;