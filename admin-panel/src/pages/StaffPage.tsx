
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Staff } from '../types';

const API_URL = 'http://localhost:4000/api';

const StaffPage: React.FC = () => {
  const { salonId } = useParams<{ salonId: string }>();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState(true);

  useEffect(() => {
    if (salonId) {
      loadStaff();
    }
  }, [salonId]);

  const loadStaff = async () => {
    if (!salonId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/staffs/${salonId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      const data = await response.json();
      setStaff(data);
      setError(null);
    } catch (err) {
      setError('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSpecialty('');
    setImage(null);
    setKeepExistingImage(true);
    setIsEditMode(false);
    setSelectedStaffId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (member: Staff) => {
    setIsEditMode(true);
    setSelectedStaffId(member._id);
    setName(member.name);
    setSpecialty(member.specialty);
    setImage(null);
    setKeepExistingImage(true);
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
      const formData = new FormData();
      formData.append('name', name);
      formData.append('specialty', specialty);
      
      if (isEditMode) {
        // Update existing staff
        if (image) {
          formData.append('image', image);
        }
        
        const response = await fetch(`${API_URL}/staffs/${selectedStaffId}`, {
          method: 'PUT',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to update staff');
        }
      } else {
        // Create new staff
        formData.append('salonId', salonId);
        if (image) {
          formData.append('image', image);
        }
        
        const response = await fetch(`${API_URL}/staffs/${salonId}`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to create staff');
        }
      }
      
      // Reset form and close modal
      closeModal();
      loadStaff();
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} staff`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/staffs/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete staff');
      }
      
      setConfirmDelete(null);
      loadStaff();
    } catch (err) {
      setError('Failed to delete staff');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff</h1>
        <button 
          onClick={openCreateModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Staff Member
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
          {staff.length === 0 ? (
            <div className="col-span-3 text-center py-10 text-gray-500">
              No staff members found. Add one to get started.
            </div>
          ) : (
            staff.map((member) => (
              <div key={member._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                {member.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={`data:image/jpeg;base64,${member.image}`} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Specialty:</span> {member.specialty}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(member)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(member._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {confirmDelete === member._id && (
                  <div className="bg-gray-100 p-4 border-t">
                    <p className="text-sm text-gray-800 mb-3">Are you sure you want to delete {member.name}?</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Specialty
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    setImage(e.target.files ? e.target.files[0] : null);
                    if (e.target.files && e.target.files[0]) {
                      setKeepExistingImage(false);
                    }
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  accept="image/*"
                />
                {isEditMode && (
                  <p className="text-sm text-gray-500 mt-1">
                    {keepExistingImage && !image ? 'Will keep existing image if no new image is selected' : 'New image will replace the existing one'}
                  </p>
                )}
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
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
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

export default StaffPage;