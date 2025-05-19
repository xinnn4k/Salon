import React, { useState, useEffect } from 'react';
import { Search, Plus, Folder, X, Loader2, Grid, List, FolderPlus, Trash2, Edit, AlertCircle, ChevronRight, ChevronDown } from 'lucide-react';

interface Subcategory {
  _id: string;
  name: string;
  description?: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  subcategories: Subcategory[];
}

enum ModalType {
  None,
  CreateCategory,
  EditCategory,
  DeleteCategory,
  CreateSubcategory,
  EditSubcategory,
  DeleteSubcategory
}

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(ModalType.None);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/categories/');
      
      if (!response.ok) {
        throw new Error('Failed to load categories');
      }
      
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCurrentCategory(null);
    setCurrentSubcategory(null);
  };

  const openModal = (type: ModalType, category?: Category, subcategory?: Subcategory) => {
    resetForm();
    setModalType(type);
    
    if (category) {
      setCurrentCategory(category);
      
      if (type === ModalType.EditCategory || type === ModalType.DeleteCategory) {

        if (type === ModalType.EditCategory) {
          setName(category.name);
          setDescription(category.description || '');
        }
      }
    }
    
    if (subcategory) {
      setCurrentSubcategory(subcategory);
      
      if (type === ModalType.EditSubcategory || type === ModalType.DeleteSubcategory) {

        if (type === ModalType.EditSubcategory) {
          setName(subcategory.name);
          setDescription(subcategory.description || '');
        }
      }
    }
  };

  const closeModal = () => {
    setModalType(ModalType.None);
    resetForm();
  };

  const validateForm = () => {
    if (!name) {
      setError('Name is required');
      return false;
    }
    return true;
  };

  const handleCreateCategory = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      

      closeModal();
      loadCategories();
    } catch (err) {
      setError('Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!currentCategory || !validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:4000/api/categories/${currentCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      

      closeModal();
      loadCategories();
    } catch (err) {
      setError('Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleDeleteCategory = async () => {
    if (!currentCategory) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:4000/api/categories/${currentCategory._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      

      closeModal();
      loadCategories();
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSubcategory = async () => {
    if (!currentCategory || !validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (image) {
        formData.append('image', image); 
      }

      const response = await fetch(`http://localhost:4000/api/categories/${currentCategory._id}/subcategories`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create subcategory');
      }

      closeModal();
      loadCategories();

      if (!expandedCategories.includes(currentCategory._id)) {
        setExpandedCategories([...expandedCategories, currentCategory._id]);
      }
    } catch (err) {
      setError('Failed to create subcategory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubcategory = async () => {
    if (!currentCategory || !currentSubcategory || !validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (image) {
        formData.append('image', image); // optionally add a new image
      }

      const response = await fetch(`http://localhost:4000/api/categories/${currentCategory._id}/subcategories/${currentSubcategory._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update subcategory');
      }

      closeModal();
      loadCategories();
    } catch (err) {
      setError('Failed to update subcategory');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDeleteSubcategory = async () => {
    if (!currentCategory || !currentSubcategory) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:4000/api/categories/${currentCategory._id}/subcategories/${currentSubcategory._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete subcategory');
      }
      
      // Close modal and reload categories
      closeModal();
      loadCategories();
    } catch (err) {
      setError('Failed to delete subcategory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategoryExpand = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const filteredCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.subcategories.some(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const renderCategoryActionButtons = (category: Category) => (
    <div className="flex space-x-2">
      <button 
        onClick={() => openModal(ModalType.CreateSubcategory, category)}
        className="p-1.5 text-green-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-300"
        title="Add Subcategory"
      >
        <FolderPlus size={16} />
      </button>
      <button 
        onClick={() => openModal(ModalType.EditCategory, category)}
        className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-300"
        title="Edit Category"
      >
        <Edit size={16} />
      </button>
      <button 
        onClick={() => openModal(ModalType.DeleteCategory, category)}
        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-300"
        title="Delete Category"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  const renderSubcategoryActionButtons = (category: Category, subcategory: Subcategory) => (
    <div className="flex space-x-2">
      <button 
        onClick={() => openModal(ModalType.EditSubcategory, category, subcategory)}
        className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-300"
        title="Edit Subcategory"
      >
        <Edit size={16} />
      </button>
      <button 
        onClick={() => openModal(ModalType.DeleteSubcategory, category, subcategory)}
        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-300"
        title="Delete Subcategory"
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
              <h1 className="text-2xl font-bold mb-2">Categories</h1>
              <p className="text-gray-600">Manage categories and subcategories</p>
            </div>
            <button 
              onClick={() => openModal(ModalType.CreateCategory)}
              className="inline-flex items-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus size={18} className="mr-2" />
              Add New Category
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
                placeholder="Search categories or subcategories..."
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
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center transition-all duration-300">
            <Folder className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No categories found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding a new category"}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => openModal(ModalType.CreateCategory)}
                className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                <Plus size={16} className="mr-2" />
                Add New Category
              </button>
            </div>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div 
                key={category._id} 
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Folder size={20} className="text-blue-500 mr-2" />
                      <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                    </div>
                    {renderCategoryActionButtons(category)}
                  </div>
                  
                  {category.description && (
                    <p className="mt-2 text-gray-600">{category.description}</p>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Subcategories ({category.subcategories.length})</p>
                      <button
                        onClick={() => toggleCategoryExpand(category._id)}
                        className="text-blue-500 hover:text-blue-600 focus:outline-none"
                      >
                        {expandedCategories.includes(category._id) ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>
                    </div>
                    
                    {expandedCategories.includes(category._id) && (
                      <div className="pl-4 border-l-2 border-gray-200">
                        {category.subcategories.length === 0 ? (
                          <p className="text-sm text-gray-500 py-2">No subcategories yet</p>
                        ) : (
                          <ul className="space-y-2">
                            {category.subcategories.map((subcategory) => (
                              <li key={subcategory._id} className="bg-gray-50 rounded p-3 flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-gray-800">{subcategory.name}</p>
                                  {subcategory.description && (
                                    <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>
                                  )}
                                </div>
                                {renderSubcategoryActionButtons(category, subcategory)}
                              </li>
                            ))}
                          </ul>
                        )}
                        <button
                          onClick={() => openModal(ModalType.CreateSubcategory, category)}
                          className="mt-3 inline-flex items-center text-sm text-green-500 hover:text-green-600 font-medium transition-colors duration-300"
                        >
                          <Plus size={16} className="mr-1" />
                          Add Subcategory
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300">
            <ul className="divide-y divide-gray-100">
              {filteredCategories.map((category) => (
                <li key={category._id} className="hover:bg-gray-50 transition-colors duration-300">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleCategoryExpand(category._id)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none mr-2"
                        >
                          {expandedCategories.includes(category._id) ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </button>
                        <Folder size={20} className="text-blue-500 mr-2" />
                        <div>
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-4">
                          {category.subcategories.length} subcategories
                        </span>
                        {renderCategoryActionButtons(category)}
                      </div>
                    </div>
                    
                    {expandedCategories.includes(category._id) && (
                      <div className="mt-4 ml-8 pl-4 border-l-2 border-gray-200">
                        {category.subcategories.length === 0 ? (
                          <div className="py-3 flex justify-between">
                            <p className="text-sm text-gray-500">No subcategories yet</p>
                            <button
                              onClick={() => openModal(ModalType.CreateSubcategory, category)}
                              className="inline-flex items-center text-sm text-green-500 hover:text-green-600 font-medium transition-colors duration-300"
                            >
                              <Plus size={16} className="mr-1" />
                              Add Subcategory
                            </button>
                          </div>
                        ) : (
                          <>
                            <ul className="divide-y divide-gray-100">
                              {category.subcategories.map((subcategory) => (
                                <li key={subcategory._id} className="py-3 flex justify-between items-center">
                                  <div>
                                    <p className="font-medium text-gray-800">{subcategory.name}</p>
                                    {subcategory.description && (
                                      <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>
                                    )}
                                  </div>
                                  {renderSubcategoryActionButtons(category, subcategory)}
                                </li>
                              ))}
                            </ul>
                            <div className="pt-3">
                              <button
                                onClick={() => openModal(ModalType.CreateSubcategory, category)}
                                className="inline-flex items-center text-sm text-green-500 hover:text-green-600 font-medium transition-colors duration-300"
                              >
                                <Plus size={16} className="mr-1" />
                                Add Subcategory
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Create/Edit Category Modal */}
      {(modalType === ModalType.CreateCategory || modalType === ModalType.EditCategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-screen overflow-y-auto border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === ModalType.CreateCategory ? 'Add New Category' : 'Edit Category'}
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
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Category Name *
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
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
                  onClick={modalType === ModalType.CreateCategory ? handleCreateCategory : handleUpdateCategory}
                  disabled={isSubmitting || !name}
                  className="inline-flex items-center px-4 py-2.5 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      {modalType === ModalType.CreateCategory ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (modalType === ModalType.CreateCategory ? 'Create Category' : 'Update Category')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Subcategory Modal */}
      {(modalType === ModalType.CreateSubcategory || modalType === ModalType.EditSubcategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-screen overflow-y-auto border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === ModalType.CreateSubcategory 
                  ? `Add New Subcategory to ${currentCategory?.name}` 
                  : `Edit Subcategory in ${currentCategory?.name}`}
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
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Subcategory Name *
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
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="mt-2"
                />

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
                  onClick={modalType === ModalType.CreateSubcategory ? handleCreateSubcategory : handleUpdateSubcategory}
                  disabled={isSubmitting || !name}
                  className="inline-flex items-center px-4 py-2.5 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      {modalType === ModalType.CreateSubcategory ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (modalType === ModalType.CreateSubcategory ? 'Create Subcategory' : 'Update Subcategory')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category/Subcategory Confirmation Modal */}
      {(modalType === ModalType.DeleteCategory || modalType === ModalType.DeleteSubcategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
                {modalType === ModalType.DeleteCategory 
                  ? `Delete Category "${currentCategory?.name}"?` 
                  : `Delete Subcategory "${currentSubcategory?.name}"?`}
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                {modalType === ModalType.DeleteCategory 
                  ? "This will permanently delete the category and all its subcategories. This action cannot be undone." 
                  : "This will permanently delete the subcategory. This action cannot be undone."}
              </p>
              
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={modalType === ModalType.DeleteCategory ? handleDeleteCategory : handleDeleteSubcategory}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2.5 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;