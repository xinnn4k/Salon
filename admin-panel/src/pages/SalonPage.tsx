import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Phone, X, Loader2, Grid, List, Camera, Building, Trash2, Edit, AlertCircle } from 'lucide-react';

interface Salon {
  _id: string;
  name: string;
  location: string;
  phone: string;
  image?: string;
}

enum ModalType {
  None,
  Create,
  Edit,
  Delete
}

const SalonPage: React.FC = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(ModalType.None);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentSalon, setCurrentSalon] = useState<Salon | null>(null);
  
  // Form state
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadSalons();
  }, []);

  const loadSalons = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/salons/');
      
      if (!response.ok) {
        throw new Error('Failed to load salons');
      }
      
      const data = await response.json();
      setSalons(data);
      setError(null);
    } catch (err) {
      setError('Failed to load salons');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setLocation('');
    setPhone('');
    setImage(null);
    setPreviewImage(null);
    setCurrentSalon(null);
  };

  const openModal = (type: ModalType, salon?: Salon) => {
    resetForm();
    setModalType(type);
    
    if (salon && (type === ModalType.Edit || type === ModalType.Delete)) {
      setCurrentSalon(salon);
      
      if (type === ModalType.Edit) {
        // Populate form with salon data
        setName(salon.name);
        setLocation(salon.location);
        setPhone(salon.phone);
        
        // If salon has image, set preview
        if (salon.image) {
          setPreviewImage(salon.image);
        }
      }
    }
  };

  const closeModal = () => {
    setModalType(ModalType.None);
    resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!name || !location || !phone || (modalType === ModalType.Create && !password)) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };


  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('location', location);
      formData.append('phone', phone);
      if (image) {
        formData.append('image', image);
      }
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch('http://localhost:4000/api/salons', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to create salon');
      }
      
      // Close modal and reload salons
      closeModal();
      loadSalons();
    } catch (err) {
      setError('Failed to create salon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!currentSalon || !validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('location', location);
      formData.append('phone', phone);
      if (email) {
        formData.append('email', email);
      }
      if (password) {
        formData.append('password', password);
      }

      if (image) {
        formData.append('image', image);
      }
      
      const response = await fetch(`http://localhost:4000/api/salons/${currentSalon._id}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to update salon');
      }
      
      // Close modal and reload salons
      closeModal();
      loadSalons();
    } catch (err) {
      setError('Failed to update salon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentSalon) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:4000/api/salons/${currentSalon._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete salon');
      }
      
      // Close modal and reload salons
      closeModal();
      loadSalons();
    } catch (err) {
      setError('Failed to delete salon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSalons = salons
    .filter(salon => 
      salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'location') {
        return a.location.localeCompare(b.location);
      }
      return 0;
    });


    const renderActionButtons = (salon: Salon) => (
    <div className="flex space-x-2">
      <button 
        onClick={() => openModal(ModalType.Edit, salon)}
        className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-300"
        title="Edit Salon"
      >
        <Edit size={16} />
      </button>
      <button 
        onClick={() => openModal(ModalType.Delete, salon)}
        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-300"
        title="Delete Salon"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Salons</h1>
              <p className="text-gray-600">Manage and browse all salon locations</p>
            </div>
            <button 
              onClick={() => openModal(ModalType.Create)}
              className="inline-flex items-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus size={18} className="mr-2" />
              Add New Salon
            </button>
          </div>
          
          {/* Controls */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Search salons by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block pl-3 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded transition-all duration-300"
              >
                <option value="name">Sort by Name</option>
                <option value="location">Sort by Location</option>
              </select>
              
              <div className="inline-flex rounded shadow-sm">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  className={`p-2.5 text-sm font-medium rounded-l border transition-all duration-300 ${
                    view === 'grid' 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`p-2.5 text-sm font-medium rounded-r border transition-all duration-300 ${
                    view === 'list' 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded mb-6 transition-all duration-300">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500">Loading salons...</p>
          </div>
        ) : filteredSalons.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center transition-all duration-300">
            <Building className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No salons found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding a new salon"}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => openModal(ModalType.Create)}
                className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                <Plus size={16} className="mr-2" />
                Add New Salon
              </button>
            </div>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSalons.map((salon) => (
              <div 
                key={salon._id} 
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="h-56 overflow-hidden bg-gray-100 relative">
                  {salon.image ? (
                    <img 
                      src={salon.image} 
                      alt={salon.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Camera size={64} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/0 via-black/0 to-black/40" />
                </div>
                <div className="p-6 relative">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{salon.name}</h2>
                  <div className="flex items-start space-x-2 text-gray-600 mb-2">
                    <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{salon.location}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-gray-600">
                    <Phone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{salon.phone}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <button 
                      className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors duration-300"
                      onClick={() => openModal(ModalType.Edit, salon)}
                    >
                      View Details →
                    </button>
                    {renderActionButtons(salon)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300">
            <ul className="divide-y divide-gray-100">
              {filteredSalons.map((salon) => (
                <li key={salon._id} className="hover:bg-gray-50 transition-colors duration-300">
                  <div className="px-6 py-4 flex items-center">
                    <div className="flex-shrink-0 h-20 w-20 rounded overflow-hidden bg-gray-100">
                      {salon.image ? (
                        <img 
                          src={salon.image} 
                          alt={salon.name} 
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Camera size={32} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-medium text-gray-900">{salon.name}</p>
                        {renderActionButtons(salon)}
                      </div>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <MapPin size={16} className="mr-1.5 text-gray-400" />
                          {salon.location}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Phone size={16} className="mr-1.5 text-gray-400" />
                          {salon.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(modalType === ModalType.Create || modalType === ModalType.Edit) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-screen overflow-y-auto border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === ModalType.Create ? 'Add New Salon' : 'Edit Salon'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="flex justify-center">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salon Image
                    </label>
                    <div 
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded ${
                        previewImage 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-300'
                      } transition-all duration-300`}
                    >
                      {previewImage ? (
                        <div className="text-center">
                          <div className="relative w-36 h-36 mx-auto mb-2">
                            <img 
                              src={previewImage} 
                              alt="Preview" 
                              className="w-full h-full object-cover rounded shadow-md"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setImage(null);
                                setPreviewImage(null);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-1 text-center">
                          <Camera className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none transition-colors duration-300">
                              <span>Upload an image</span>
                              <input 
                                id="file-upload" 
                                name="file-upload" 
                                type="file" 
                                className="sr-only"
                                onChange={handleImageChange}
                                accept="image/*"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Salon Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {modalType === ModalType.Edit ? 'Password (leave blank to keep existing)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required={modalType === ModalType.Create}
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={modalType === ModalType.Create ? handleCreate : handleUpdate}
                  disabled={isSubmitting || !name || !location || !phone}
                  className="inline-flex items-center px-4 py-2.5 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      {modalType === ModalType.Create ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (modalType === ModalType.Create ? 'Create Salon' : 'Update Salon')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === ModalType.Delete && currentSalon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-center flex-col text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Trash2 size={24} className="text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete Salon</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete <strong>{currentSalon.name}</strong>? This action cannot be undone.
                </p>
              </div>
              
              <div className="mt-6 flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2.5 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonPage;