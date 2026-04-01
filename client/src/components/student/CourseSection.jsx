import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/context'
import CourseCard from './CourseCard';

const CourseSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="pb-16 md:px-40 px-8 bg-[url('/course-bg1.png')] bg-cover bg-center bg-no-repeat w-full">
      <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3'>Discover our top-rated courses across various categories. From coding and design <br/> to business and wellness, our courses are crafted to deliver results.</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 md:px-0 my-10 md:my-16 max-w-7xl mx-auto'>
        {
          allCourses.slice(0, 4).map((course, idx) => (
            <CourseCard key={idx} course={course} />
          ))
        }
      </div>

      <Link
        to={'/course-list'}
        onClick={() => scrollTo(0, 0)}
        className='text-gray-100 border bg-gray-700 border-gray-500/30 px-10 py-3 rounded'
      >
        Show all courses
      </Link>
    </div>
  )
}

export default CourseSection