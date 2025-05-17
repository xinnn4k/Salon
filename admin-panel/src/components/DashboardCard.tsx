import React from 'react';

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, icon, color }) => {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${color}`}>
      <div className="p-5 flex items-center">
        <div className="mr-4 p-3 rounded-full bg-opacity-50" style={{ backgroundColor: `${color}33` }}>
          {icon}
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-semibold text-gray-700">{count}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;