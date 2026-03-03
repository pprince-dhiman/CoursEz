import React, { useEffect, useState } from 'react'

const Rating = ({ initailRating, onRate }) => {
  const [rating, setRating] = useState(initailRating || 0);

  const handleRating = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  }

  useEffect(() => {
    if (initailRating)
      setRating(initailRating)
  }, [initailRating]);

  return (
    <div>
      {
        Array.from(
          { length: 5 },
          (_, idx) => {
            const starVal = idx + 1;
            return (
              <span key={idx} onClick={() => handleRating(starVal)}
                className={`text-xl sm:text-2xl cursor-pointer transition-colors 
              ${starVal <= rating ? 'text-yellow-500' : 'text-gray-500'}`}>
                &#9733;
              </span>
            )
          })
      }
    </div>
  )
}

export default Rating