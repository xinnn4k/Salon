import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import Popup from '../components/UI/Popup';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; password: string } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('signupUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEmail(parsedUser.email);
      setPassword(parsedUser.password);
    }
  }, []);



  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/');
  };
  
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    const updatedUser = { ...user, email, password };
    localStorage.setItem('signupUser', JSON.stringify(updatedUser));
    localStorage.setItem('user', JSON.stringify(updatedUser)); // Update current login
    setUser(updatedUser);

    setShowPopup(true);
  };

  if (!user) return <Layout><p className="p-6">Нэвтэрсэн хэрэглэгч олдсонгүй...</p></Layout>;

  return (
    <Layout>
      <section className="bg-gradient-to-r from-pink-300 via-purple-400 to-purple-300 py-16">
        <div className="max-w-screen-md mx-auto bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Профайл засах</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имэйл хаяг</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border p-2 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Нууц үг</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded-md"
              />
            </div>

            <div className="text-center">
              <Button className="bg-purple-500 hover:bg-purple-700 text-white">
                Хадгалах
              </Button>
            </div>
          </form>
        </div>
      </section>
      {showPopup && (
        <Popup message="Амжилттай хадгалагдлаа!" onClose={handlePopupClose} />
      )}
    </Layout>
  );
};

export default ProfilePage;
