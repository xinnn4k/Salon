import React from 'react';
import { Review } from '../../types';
import ReviewCard from '../UI/ReviewCard';

interface ReviewsProps {
  reviews: Review[];
}

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      <div>
        {reviews.slice(0, 3).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      {reviews.length > 3 && (
        <button className="w-full text-blue-600 mt-4 py-2">
          See all
        </button>
      )}
    </div>
  );
};

export default Reviews;