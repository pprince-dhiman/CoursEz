import { useContext } from 'react'
import { AppContext } from '../../context/context'
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link to={`/course/${course._id}`} onClick={() => scrollTo(0, 0)}
      className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg hover:scale-[101%] hover:shadow-lg shadow-md transition-all duration-200 h-full'>
      <img src={course.courseThumbnail}
        className='w-full h-[70%] object-cover rounded-b-lg' />

      <div className='p-3 text-left bg-gray-50 h-full'>
        <h3 className='text-base font-bold'>{course.courseTitle}</h3>
        <p className='text-gray-500'>{course.educator.name}</p>
        <div className='flex items-center space-x-2'>
          {/* Average rating of course as per all students rating */}
          <p>{calculateRating(course)}</p>
          {/* Rating starts  */}
          <div className='flex'>
            {[...Array(5)].map((_, i) => (<img key={i} src={i < calculateRating(course) ? assets.star : assets.star_blank} className='w-3.5 h-3.5' />))}
          </div>
        </div>
        <p className='text-gray-800 font-semibold text-base'>{currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default CourseCard