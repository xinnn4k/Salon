import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Salon, Order } from '../types';
import DashboardCard from '../components/DashboardCard';
import { Users, Scissors, Calendar, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalSalons: 0,
    totalServices: 0,
    totalStaff: 0,
    totalOrders: 0,
    revenue: 0,
  });

  // Mock data for charts
  const [monthlyData, setMonthlyData] = useState([
    { name: 'Jan', orders: 65, revenue: 4000 },
    { name: 'Feb', orders: 59, revenue: 3800 },
    { name: 'Mar', orders: 80, revenue: 5200 },
    { name: 'Apr', orders: 81, revenue: 5400 },
    { name: 'May', orders: 56, revenue: 3900 },
    { name: 'Jun', orders: 55, revenue: 3800 },
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const [pieData, setPieData] = useState([
    { name: 'Haircut', value: 45 },
    { name: 'Coloring', value: 25 },
    { name: 'Styling', value: 20 },
    { name: 'Other', value: 10 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const salonResponse = await fetch('http://localhost:4000/api/salons/');
        if (!salonResponse.ok) throw new Error('Failed to fetch salons');
        const salonData = await salonResponse.json();
        setSalons(salonData);
        
        let allOrders: Order[] = [];
        let servicesCount = 0;
        let staffCount = 0;
        let totalRevenue = 0;
        
        await Promise.all(salonData.map(async (salon: Salon) => {
          try {
            const [ordersRes, servicesRes, staffRes] = await Promise.all([
              fetch(`http://localhost:4000/api/orders/${salon._id}`),
              fetch(`http://localhost:4000/api/services/${salon._id}`),
              fetch(`http://localhost:4000/api/staffs/${salon._id}`)
            ]);
            
            if (ordersRes.ok) {
              const salonOrders = await ordersRes.json();
              allOrders = [...allOrders, ...salonOrders];
              
              salonOrders.forEach((order: Order) => {
                if (order.service && order.service.price) {
                  totalRevenue += order.service.price;
                }
              });
            }
            
            if (servicesRes.ok) {
              const services = await servicesRes.json();
              servicesCount += services.length;
            }
            
            if (staffRes.ok) {
              const staff = await staffRes.json();
              staffCount += staff.length;
            }
          } catch (err) {
            console.error('Error fetching salon details:', err);
          }
        }));
        
        setOrders(allOrders);
        
        // Set statistics
        setStats({
          totalSalons: salonData.length,
          totalServices: servicesCount,
          totalStaff: staffCount,
          totalOrders: allOrders.length,
          revenue: totalRevenue
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard 
          title="Total Salons" 
          count={stats.totalSalons} 
          icon={<Scissors size={24} color="#3b82f6" />} 
          color="border-blue-500" 
        />
        <DashboardCard 
          title="Services" 
          count={stats.totalServices} 
          icon={<Scissors size={24} color="#10b981" />} 
          color="border-green-500" 
        />
        <DashboardCard 
          title="Staff Members" 
          count={stats.totalStaff} 
          icon={<Users size={24} color="#6366f1" />} 
          color="border-indigo-500" 
        />
        <DashboardCard 
          title="Orders" 
          count={stats.totalOrders} 
          icon={<Calendar size={24} color="#f59e0b" />} 
          color="border-yellow-500" 
        />
        <DashboardCard 
          title="Revenue" 
          count={stats.revenue} 
          icon={<DollarSign size={24} color="#ef4444" />} 
          color="border-red-500" 
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Services Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Salons List */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Your Salons</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salons.map(salon => (
              <div key={salon._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
                {salon.image && (
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={salon.image} 
                      alt={salon.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{salon.name}</h3>
                  <p className="text-gray-600 mb-4">{salon.location}</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to={`/services/${salon._id}`} 
                      className="bg-blue-500 text-white py-2 px-3 rounded text-center text-sm hover:bg-blue-600 transition-colors"
                    >
                      Services
                    </Link>
                    <Link 
                      to={`/staff/${salon._id}`} 
                      className="bg-green-500 text-white py-2 px-3 rounded text-center text-sm hover:bg-green-600 transition-colors"
                    >
                      Staff
                    </Link>
                    <Link 
                      to={`/orders/${salon._id}`} 
                      className="bg-purple-500 text-white py-2 px-3 rounded text-center text-sm hover:bg-purple-600 transition-colors col-span-2"
                    >
                      View Orders
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;