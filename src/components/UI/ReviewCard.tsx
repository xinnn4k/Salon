import React from 'react';
import { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex justify-between mb-1">
        <h4 className="font-medium">{review.author}</h4>
        <span className="text-sm text-gray-500">{review.date}</span>
      </div>
      <p className="text-gray-700">{review.content}</p>
      {review.content.length > 50 && (
        <button className="text-blue-600 text-sm mt-1">Read more</button>
      )}
    </div>
  );
};

export default ReviewCard;