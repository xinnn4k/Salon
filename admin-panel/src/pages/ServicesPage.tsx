import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Service {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  salonId: string;
  categoryId?: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  _id: string;
  name: string;
  description: string;
}

interface ServiceFormData {
  name: string;
  price: string;
  description: string;
  image: File | null;
  categoryId: string;
  subcategoryId: string;
}

const API_URL = 'http://localhost:4000/api';

const ServicesPage: React.FC = () => {
  const { salonId } = useParams<{ salonId: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Form state
  const initialFormState: ServiceFormData = {
    name: '',
    price: '',
    description: '',
    image: null,
    categoryId: '',
    subcategoryId: ''
  };
  
  const [formData, setFormData] = useState<ServiceFormData>(initialFormState);

  useEffect(() => {
    if (salonId) {
      loadServices();
      loadCategories();
    }
  }, [salonId]);

  // Load services for the salon
  const loadServices = async () => {
    if (!salonId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/services/${salonId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
      setError(null);
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Load all available categories
  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If the category changes, update the selected category and reset subcategory
    if (name === 'categoryId') {
      const category = categories.find(cat => cat._id === value) || null;
      setSelectedCategory(category);
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  // Handle selecting a pre-defined service from a category
  const handleServiceSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = e.target.value;
    if (serviceId && selectedCategory) {
      // If a subcategory is selected
      const subcategory = selectedCategory.subcategories.find(sub => sub._id === serviceId);
      if (subcategory) {
        setFormData(prev => ({
          ...prev,
          name: subcategory.name,
          description: subcategory.description,
          subcategoryId: serviceId
        }));
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditMode(false);
    setCurrentServiceId(null);
    setSelectedCategory(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setFormData({
      name: service.name,
      price: service.price.toString(),
      description: service.description,
      image: null,
      categoryId: service.categoryId || '',
      subcategoryId: ''
    });
    
    if (service.categoryId) {
      const category = categories.find(cat => cat._id === service.categoryId) || null;
      setSelectedCategory(category);
    }
    
    setCurrentServiceId(service._id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonId) return;
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('price', formData.price);
      formDataObj.append('description', formData.description);
      
      if (formData.categoryId) {
        formDataObj.append('categoryId', formData.categoryId);
      }
      
      if (formData.subcategoryId) {
        formDataObj.append('subcategoryId', formData.subcategoryId);
      }
      
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }
      
      let url = `${API_URL}/services/${salonId}`;
      let method = 'POST';
      
      if (isEditMode && currentServiceId) {
        url = `${API_URL}/services/${salonId}/${currentServiceId}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        body: formDataObj,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} service`);
      }
      
      // Close modal and reload services
      closeModal();
      loadServices();
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} service`);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/services/${salonId}/${serviceId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      
      loadServices();
    } catch (err) {
      setError('Failed to delete service');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <button 
          onClick={openCreateModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Service
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <div className="col-span-3 text-center py-10 text-gray-500">
              No services found. Add a new service to get started.
            </div>
          ) : (
            services.map((service) => (
              <div key={service._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                {service.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Price:</span> ${service.price}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Description:</span> {service.description}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditMode ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Category Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Service Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Subcategory/Predefined Service Selection */}
              {selectedCategory && selectedCategory.subcategories.length > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Choose Predefined Service (Optional)
                  </label>
                  <select
                    name="subcategoryId"
                    value={formData.subcategoryId}
                    onChange={handleServiceSelection}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Custom Service</option>
                    {selectedCategory.subcategories.map(subcategory => (
                      <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Service Details */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image {isEditMode && '(Leave empty to keep current image)'}
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  accept="image/*"
                />
              </div>
              
              <div className="flex items-center justify-end mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${isEditMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded`}
                >
                  {isEditMode ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;