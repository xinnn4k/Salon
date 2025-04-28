import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  path: string[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path }) => {
  return (
    <nav className="text-sm text-gray-600">
      <ol className="flex space-x-2">
        {path.map((segment, index) => (
          <li key={index} className="flex items-center">
            {index !== 0 && <span className="mx-2">•</span>}
            <Link to={`•${path.slice(0, index + 1).join('•')}`} className="hover:text-blue-600">
              {segment}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
