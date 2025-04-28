import React from 'react';

interface ShopInfoProps {
  name: string;
  address: string;
  description: string;
  rating?: string;
  status: string;
}

const ShopInfo: React.FC<ShopInfoProps> = ({ name, address, description, rating, status }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-2xl font-bold">{name}</h1>
        {rating && (
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
            <span className="text-sm">({rating})</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        <span>{address}</span>
      </div>
      
      <div className="flex items-center text-sm mb-6">
        <div className={`w-3 h-3 rounded-full mr-2 ${status.includes('Closed') ? 'bg-red-500' : 'bg-green-500'}`}></div>
        <span>{status}</span>
      </div>
      
      <p className="text-gray-700">{description}</p>
      
      <div className="flex space-x-4 mt-6">
        <button className="flex items-center text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Get directions
        </button>
      </div>
    </div>
  );
};

export default ShopInfo;