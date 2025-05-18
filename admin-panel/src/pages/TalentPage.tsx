// src/pages/TalentPage.tsx
import React from 'react';

const TalentPage: React.FC = () => {
  const email = localStorage.getItem('userEmail');
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Welcome, Talent</h2>
      <p className="text-gray-600">Logged in as: {email}</p>
      <p className="mt-4">This is your personalized talent dashboard.</p>
    </div>
  );
};

export default TalentPage;
