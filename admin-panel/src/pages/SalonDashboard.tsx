import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Salon, Service, Staff, Order } from '../types';
import DashboardCard from '../components/DashboardCard';
import { Scissors, Users, Calendar, DollarSign, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

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

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchSalonData = async () => {
      if (!salonId) {
        setError('No salon ID found. Please select a salon.');
        setLoading(false);
        return;
      }

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
        
        // Log the fetched orders for debugging
        console.log('Fetched orders:', ordersData);
        setOrders(ordersData);
        
        // Calculate stats
        calculateStats(ordersData, servicesData, staffData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading salon dashboard data:', err);
        setError(`Failed to load salon dashboard data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
      }
    };

    fetchSalonData();
  }, [salonId]);

  const calculateStats = (orders: Order[], services: Service[], staff: Staff[]) => {
    try {
      // Calculate total revenue properly
      let totalRevenue = 0;
      
      orders.forEach((order: Order) => {
        // Try to get the price either from order.price or from the linked service
        let orderPrice = 0;
        
        if (order.price !== undefined && order.price !== null) {
          // If order has its own price field, use that
          const parsedPrice = parseFloat(order.price.toString());
          if (!isNaN(parsedPrice)) {
            orderPrice = parsedPrice;
          }
        } else if (order.serviceId) {
          // If order references a service, look up that service's price
          const service = services.find(s => s._id === order.serviceId);
          if (service && service.price !== undefined) {
            const parsedPrice = parseFloat(service.price.toString());
            if (!isNaN(parsedPrice)) {
              orderPrice = parsedPrice;
            }
          }
        } else if (order.service && order.service.price !== undefined) {
          // If order has nested service object with price
          const parsedPrice = parseFloat(order.service.price.toString());
          if (!isNaN(parsedPrice)) {
            orderPrice = parsedPrice;
          }
        }
        
        totalRevenue += orderPrice;
      });
      
      // Debug the revenue calculation
      console.log('Calculated total revenue:', totalRevenue);
      
      // Filter orders by status
      const completedOrders = orders.filter((order: Order) => order.status === 'completed').length;
      const pendingOrders = orders.filter((order: Order) => order.status === 'booked').length;
      const cancelledOrders = orders.filter((order: Order) => order.status === 'cancelled').length;
      
      setStats({
        totalServices: services.length,
        totalStaff: staff.length,
        totalOrders: orders.length,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        completedOrders,
        pendingOrders,
        cancelledOrders
      });
      
      // Process data for charts
      prepareChartData(orders, services, staff);
      
    } catch (err) {
      console.error('Error calculating stats:', err);
    }
  };

  const prepareChartData = (orders: Order[], services: Service[], staff: Staff[]) => {
    try {
      // 1. Monthly performance data
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      
      // Get the last 6 months
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const monthIndex = (currentMonth - i + 12) % 12;
        return { 
          index: monthIndex,
          name: monthNames[monthIndex]
        };
      }).reverse();
      
      const monthlyStats = last6Months.map(month => {
        const monthOrders = orders.filter(order => {
          if (!order.date) return false;
          
          try {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === month.index;
          } catch {
            return false;
          }
        });
        
        // Calculate revenue for the month
        let monthRevenue = 0;
        
        monthOrders.forEach(order => {
          // Try to get price from various possible locations
          if (order.price !== undefined && order.price !== null) {
            const price = parseFloat(order.price.toString());
            if (!isNaN(price)) {
              monthRevenue += price;
            }
          } else if (order.serviceId) {
            const service = services.find(s => s._id === order.serviceId);
            if (service && service.price !== undefined) {
              const price = parseFloat(service.price.toString());
              if (!isNaN(price)) {
                monthRevenue += price;
              }
            }
          } else if (order.service && order.service.price !== undefined) {
            const price = parseFloat(order.service.price.toString());
            if (!isNaN(price)) {
              monthRevenue += price;
            }
          }
        });
        
        return {
          name: month.name,
          orders: monthOrders.length,
          revenue: parseFloat(monthRevenue.toFixed(2))
        };
      });
      
      setMonthlyData(monthlyStats);
      
      // 2. Service distribution data
      const serviceStats: Record<string, number> = {};
      
      orders.forEach(order => {
        let serviceName = 'Unknown';
        
        // Try to find service name either by reference or direct embedding
        if (order.serviceId) {
          const service = services.find(s => s._id === order.serviceId);
          if (service && service.name) {
            serviceName = service.name;
          }
        } else if (order.service && order.service.name) {
          serviceName = order.service.name;
        }
        
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
        let staffName = 'Unassigned';
        
        // Try to find staff either by ID reference or direct embedding
        if (order.staffId) {
          const staffMember = staff.find(s => s._id === order.staffId);
          if (staffMember && staffMember.name) {
            staffName = staffMember.name;
          }
        } else if (order.staff && order.staff.name) {
          staffName = order.staff.name;
        }
        
        // Only count completed orders for staff performance
        if (order.status === 'completed') {
          staffStats[staffName] = (staffStats[staffName] || 0) + 1;
        }
      });
      
      const staffPerformanceData = Object.keys(staffStats)
        .filter(name => name !== 'Unassigned' || staffStats[name] > 0) // Only include unassigned if it has orders
        .map(name => ({
          name,
          orders: staffStats[name]
        }))
        .sort((a, b) => b.orders - a.orders); // Sort by number of orders
      
      setStaffPerformance(staffPerformanceData);
    } catch (err) {
      console.error('Error preparing chart data:', err);
    }
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
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? formatCurrency(Number(value)) : value,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]}/>
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Service Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Service Distribution</h3>
          {serviceDistribution.length > 0 ? (
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
                <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No service data available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Staff Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Staff Performance</h3>
        {staffPerformance.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={staffPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#8884d8" name="Completed Orders" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No staff performance data available</p>
          </div>
        )}
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
              {orders.length > 0 ? 
                orders.slice(0, 5).map((order) => {
                  // Find service info
                  let serviceName = 'Unknown Service';
                  let servicePrice = 0;
                  
                  if (order.serviceId) {
                    const orderService = services.find(s => s._id === order.serviceId);
                    if (orderService) {
                      serviceName = orderService.name || 'Unknown Service';
                      servicePrice = parseFloat(orderService.price?.toString() || '0');
                    }
                  } else if (order.service) {
                    serviceName = order.service.name || 'Unknown Service';
                    servicePrice = parseFloat(order.service.price?.toString() || '0');
                  }
                  
                  // Find staff info
                  let staffName = 'Unassigned';
                  
                  if (order.staffId) {
                    const orderStaff = staff.find(s => s._id === order.staffId);
                    if (orderStaff) {
                      staffName = orderStaff.name || 'Unassigned';
                    }
                  } else if (order.staff) {
                    staffName = order.staff.name || 'Unassigned';
                  }
                  
                  return (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customerName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{serviceName}</div>
                        <div className="text-sm text-gray-500">{formatCurrency(servicePrice)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{staffName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.date ? formatDate(order.date) : 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.time || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Unknown'}
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
                }) : (
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