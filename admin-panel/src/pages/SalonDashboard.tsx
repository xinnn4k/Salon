import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Salon, Service, Staff, Order } from '../types';
import DashboardCard from '../components/DashboardCard';
import { Scissors, Users, Calendar, DollarSign, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SalonDashboard: React.FC = () => {
  const salonId = localStorage.getItem('salonId');
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalStaff: 0,
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
  });

  // Data for charts
  const [monthlyData, setMonthlyData] = useState<{ name: string; orders: number; revenue: number }[]>([]);
  const [serviceDistribution, setServiceDistribution] = useState<{ name: string; value: number }[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<{ name: string; orders: number }[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFCC00'];

  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        setLoading(true);
        
        // Fetch salon details
        const salonResponse = await fetch(`http://localhost:4000/api/salons/${salonId}`);
        if (!salonResponse.ok) throw new Error('Failed to fetch salon details');
        const salonData = await salonResponse.json();
        setSalon(salonData);
        
        // Fetch services
        const servicesResponse = await fetch(`http://localhost:4000/api/services/${salonId}`);
        if (!servicesResponse.ok) throw new Error('Failed to fetch services');
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
        
        // Fetch staff
        const staffResponse = await fetch(`http://localhost:4000/api/staffs/${salonId}`);
        if (!staffResponse.ok) throw new Error('Failed to fetch staff');
        const staffData = await staffResponse.json();
        setStaff(staffData);
        
        // Fetch orders
        const ordersResponse = await fetch(`http://localhost:4000/api/orders/pay/${salonId}`);
        if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        
        // Calculate stats
        const totalRevenue = ordersData.reduce((sum: number, order: Order) => {
          return sum + (order.service?.price || 0);
        }, 0);
        
        const completedOrders = ordersData.filter((order: Order) => order.status === 'completed').length;
        const pendingOrders = ordersData.filter((order: Order) => order.status === 'booked').length;
        const cancelledOrders = ordersData.filter((order: Order) => order.status === 'cancelled').length;
        
        setStats({
          totalServices: servicesData.length,
          totalStaff: staffData.length,
          totalOrders: ordersData.length,
          totalRevenue,
          completedOrders,
          pendingOrders,
          cancelledOrders
        });
        
        // Process data for charts
        prepareChartData(ordersData, servicesData, staffData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading salon dashboard data:', err);
        setError('Failed to load salon dashboard data');
        setLoading(false);
      }
    };

    if (salonId) {
      fetchSalonData();
    }
  }, [salonId]);

  const prepareChartData = (orders: Order[], services: Service[], staff: Staff[]) => {
    // 1. Monthly performance data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    // Get the last 6 months
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - i + 12) % 12;
      return monthNames[monthIndex];
    }).reverse();
    
    const monthlyStats = last6Months.map(month => {
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return monthNames[orderDate.getMonth()] === month;
      });
      
      const monthRevenue = monthOrders.reduce((sum, order) => {
        return sum + (order.service?.price || 0);
      }, 0);
      
      return {
        name: month,
        orders: monthOrders.length,
        revenue: monthRevenue
      };
    });
    
    setMonthlyData(monthlyStats);
    
    // 2. Service distribution data
    const serviceStats: Record<string, number> = {};
    
    orders.forEach(order => {
      const serviceName = services.find(s => s._id === order.serviceId)?.name || 'Unknown';
      serviceStats[serviceName] = (serviceStats[serviceName] || 0) + 1;
    });
    
    const serviceDistData = Object.keys(serviceStats).map(name => ({
      name,
      value: serviceStats[name]
    }));
    
    // If we have too many services, group the smallest ones as "Other"
    if (serviceDistData.length > 6) {
      serviceDistData.sort((a, b) => b.value - a.value);
      const topServices = serviceDistData.slice(0, 5);
      const otherServices = serviceDistData.slice(5);
      
      const otherValue = otherServices.reduce((sum, item) => sum + item.value, 0);
      topServices.push({ name: 'Other', value: otherValue });
      
      setServiceDistribution(topServices);
    } else {
      setServiceDistribution(serviceDistData);
    }
    
    // 3. Staff performance data
    const staffStats: Record<string, number> = {};
    
    orders.forEach(order => {
      const staffMember = staff.find(s => s._id === order.staffId);
      if (staffMember) {
        staffStats[staffMember.name] = (staffStats[staffMember.name] || 0) + 1;
      }
    });
    
    const staffPerformanceData = Object.keys(staffStats).map(name => ({
      name,
      orders: staffStats[name]
    }));
    
    setStaffPerformance(staffPerformanceData);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
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
  
  if (!salon) return <div>Salon not found</div>;
  
  return (
    <div className="space-y-6">
      {/* Salon Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          {salon.image && (
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img 
                src={salon.image} 
                alt={salon.name} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{salon.name}</h2>
            <p className="text-gray-600">{salon.location}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link 
            to={`/salon/${salonId}/edit`}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Edit Salon
          </Link>
          <Link 
            to={`/orders/${salonId}/add`}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            New Order
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Total Services" 
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
          title="Total Orders" 
          count={stats.totalOrders} 
          icon={<Calendar size={24} color="#f59e0b" />} 
          color="border-yellow-500" 
        />
        <DashboardCard 
          title="Revenue" 
          count={stats.totalRevenue} 
          icon={<DollarSign size={24} color="#ef4444" />} 
          color="border-red-500" 
        />
      </div>
      
      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-green-800">Completed</h3>
            <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <Clock size={24} color="#059669" />
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-blue-800">Pending</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.pendingOrders}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Clock size={24} color="#3b82f6" />
          </div>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-red-800">Cancelled</h3>
            <p className="text-2xl font-bold text-red-600">{stats.cancelledOrders}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <Clock size={24} color="#ef4444" />
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Monthly Performance Chart */}
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
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Service Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Staff Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Staff Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={staffPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#8884d8" name="Orders Completed" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <Link 
            to={`/orders/${salonId}`} 
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => {
                const orderService = services.find(s => s._id === order.serviceId);
                const orderStaff = staff.find(s => s._id === order.staffId);
                
                return (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{orderService?.name || 'Unknown Service'}</div>
                      <div className="text-sm text-gray-500">${orderService?.price || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{orderStaff?.name || 'Unassigned'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.date}</div>
                      <div className="text-sm text-gray-500">{order.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link 
                        to={`/orders/${salonId}/${order._id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/orders/${salonId}/${order._id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Link 
          to={`/services/${salonId}`}
          className="bg-white border border-gray-200 rounded-lg shadow p-6 hover:bg-blue-50 transition-colors flex items-center space-x-4"
        >
          <div className="bg-blue-100 p-3 rounded-full">
            <Scissors size={24} color="#3b82f6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Manage Services</h3>
            <p className="text-gray-600 text-sm">Add, edit or remove services</p>
          </div>
        </Link>
        
        <Link 
          to={`/staff/${salonId}`}
          className="bg-white border border-gray-200 rounded-lg shadow p-6 hover:bg-green-50 transition-colors flex items-center space-x-4"
        >
          <div className="bg-green-100 p-3 rounded-full">
            <Users size={24} color="#10b981" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Manage Staff</h3>
            <p className="text-gray-600 text-sm">Add, edit or remove staff members</p>
          </div>
        </Link>
        
        <Link 
          to={`/orders/${salonId}`}
          className="bg-white border border-gray-200 rounded-lg shadow p-6 hover:bg-purple-50 transition-colors flex items-center space-x-4"
        >
          <div className="bg-purple-100 p-3 rounded-full">
            <Calendar size={24} color="#8b5cf6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Manage Orders</h3>
            <p className="text-gray-600 text-sm">View and manage all orders</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SalonDashboard;