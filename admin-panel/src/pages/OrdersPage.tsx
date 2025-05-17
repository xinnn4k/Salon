import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Order, Service, Staff } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const OrdersPage: React.FC = () => {
  const { salonId } = useParams<{ salonId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form states
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [serviceId, setServiceId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState('booked');

  useEffect(() => {
    if (salonId) {
      loadData();
    }
  }, [salonId]);

  const loadData = async () => {
    if (!salonId) return;
    
    try {
      setLoading(true);
      
      const [ordersResponse, servicesResponse, staffResponse] = await Promise.all([
        fetch(`http://localhost:4000/api/orders/${salonId}`),
        fetch(`http://localhost:4000/api/services/${salonId}`),
        fetch(`http://localhost:4000/api/staffs/${salonId}`)
      ]);
      
      if (!ordersResponse.ok || !servicesResponse.ok || !staffResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const [ordersData, servicesData, staffData] = await Promise.all([
        ordersResponse.json(),
        servicesResponse.json(),
        staffResponse.json()
      ]);
      
      setServices(servicesData);
      setStaff(staffData);
      
      const enhancedOrders = ordersData.map((order: { serviceId: any; staffId: any; }) => {
        const service = typeof order.serviceId === 'object' && order.serviceId !== null ? order.serviceId : null;
        const staffMember = typeof order.staffId === 'object' && order.staffId !== null ? order.staffId : null;
        
        return {
          ...order,
          service,
          staff: staffMember
        };
      });
      
      setOrders(enhancedOrders);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentOrderId('');
    setServiceId('');
    setStaffId('');
    setCustomerName('');
    setCustomerPhone('');
    setDate('');
    setTime('');
    setStatus('booked');
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (order: Order) => {
    setCurrentOrderId(order._id);
    setServiceId(order.serviceId);
    setStaffId(order.staffId);
    setCustomerName(order.customerName);
    setCustomerPhone(order.customerPhone);
    setDate(order.date);
    setTime(order.time);
    setStatus(order.status);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (orderId: string) => {
    setCurrentOrderId(orderId);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonId) return;
    
    try {
      const newOrder: Omit<Order, '_id'> = {
        salonId,
        serviceId,
        staffId,
        customerName,
        customerPhone,
        date,
        time,
        status: 'booked'
      };
      
      const response = await fetch(`http://localhost:4000/api/orders/${salonId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      resetForm();
      setIsCreateModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonId || !currentOrderId) return;
    
    try {
      const updatedOrder = {
        serviceId,
        staffId,
        customerName,
        customerPhone,
        date,
        time,
        status
      };
      
      const response = await fetch(`http://localhost:4000/api/orders/${salonId}/${currentOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
      
      resetForm();
      setIsEditModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order');
    }
  };

  const handleDelete = async () => {
    if (!salonId || !currentOrderId) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${salonId}/${currentOrderId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      
      setIsDeleteModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Failed to delete order');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div>
          <button 
            onClick={openCreateModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create New Order
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No orders found. Create a new order.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.service?.name || 'Unknown service'}</div>
                      <div className="text-sm text-gray-500">${order.service?.price || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.staff?.name || 'Unknown staff'}</div>
                      <div className="text-sm text-gray-500">{order.staff?.specialty || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(order.date)}</div>
                      <div className="text-sm text-gray-500">{order.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(order)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(order._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Order"
      >
        <form onSubmit={handleCreate}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Service
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} - ${service.price}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Staff Member
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a staff member</option>
              {staff.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} - {member.specialty}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Customer Phone
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="flex items-center justify-end mt-6">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Order Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Order"
      >
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Service
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} - ${service.price}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Staff Member
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a staff member</option>
              {staff.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} - {member.specialty}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Customer Phone
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="booked">Booked</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
          
          <div className="flex items-center justify-end mt-6">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Order"
      >
        <div className="p-4">
          <p className="mb-4">Are you sure you want to delete this order? This action cannot be undone.</p>
          
          <div className="flex items-center justify-end mt-6">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrdersPage;