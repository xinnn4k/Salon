import React from 'react';
import { BusinessHour } from '../../types';

interface BusinessHoursProps {
  hours: BusinessHour[];
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ hours }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Opening times</h2>
      <div className="space-y-2">
        {hours.map((hour) => (
          <div key={hour.day} className="flex justify-between">
            <span className="text-gray-600">{hour.day}</span>
            <span>{hour.hours}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHours;