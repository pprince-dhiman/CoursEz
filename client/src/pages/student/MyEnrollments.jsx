import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/context'
import { useNavigate } from 'react-router-dom'
import { Line } from 'rc-progress'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, userData, fetchUserEnrolledCourses, VITE_BACKEND_URL, getToken, calculateNoOfLectures } = useContext(AppContext);
  const navigate = useNavigate();

  const [progressArray, setProgressArray] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const tempProgressArr = await Promise.all(
        enrolledCourses.map(async (course) => {

          const { data } = await axios.post(`${VITE_BACKEND_URL}/api/user/get-course-progress`, { courseId: course._id.toString() }, { headers: { Authorization: `Bearer ${token}` } });

          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;

          return { totalLectures, lectureCompleted };
        })
      );

      setProgressArray(tempProgressArr);
    }
    catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);

  return (
    <>
      <div className='md:px-36 px-8 pt-10'>
        <h1 className='text-2xl font-semibold'>My Enrollments</h1>

        {
          enrolledCourses.length === 0 ?
            (<div className="w-full h-[50vh] flex items-center justify-center bg-gray-50 rounded-lg border mt-5">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-400">
                  Not Enrolled Yet
                </h2>
                <p className="mt-2 text-gray-400 text-sm md:text-base">
                  You haven’t enrolled in any '
                  <span onClick={()=>navigate('/course-list')}
                  className='text-blue-500 border-b-2 border-blue-600 hover:cursor-pointer'>
                     courses 
                  </span>
                  ' yet.
                </p>

              </div>
            </div>)
            :

            (<table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
              <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
                <tr>
                  <th className='px-4 py-3 font-semibold truncate'>Course</th>
                  <th className='px-4 py-3 font-semibold truncate'>Duration</th>
                  <th className='px-4 py-3 font-semibold truncate'>Completed</th>
                  <th className='px-4 py-3 font-semibold truncate'>Status</th>
                </tr>
              </thead>

              <tbody className='text-gray-700'>
                {
                  enrolledCourses.map((course, idx) => (
                    <tr key={idx} className='border-b border-gray-500/20'>
                      <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                        <img src={course.courseThumbnail} alt="course-thumbnail" className='w-14 sm:w-24 md:w-28' />
                        <div className='flex-1'>
                          <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>

                          {/* course complete percentage line  */}
                          <Line strokeWidth={2}
                            percent={
                              progressArray[idx] && progressArray[idx].totalLectures > 0 ? (progressArray[idx].lectureCompleted * 100) / (progressArray[idx].totalLectures) : 0
                            }
                            className='bg-gray-300 rounded-full'
                          />
                        </div>
                      </td>
                      <td className='px-4 py-3 max-sm:hidden'>
                        {calculateCourseDuration(course)}
                      </td>
                      <td className='px-4 py-3 max-sm:hidden'>
                        {
                          progressArray[idx] && `${progressArray[idx].lectureCompleted}/
                      ${progressArray[idx].totalLectures}`
                        }
                        <span>Lectures</span>
                      </td>
                      <td className='px-4 py-3 max-sm:text-right'>
                        <button onClick={() => navigate('/player/' + course._id)}
                          className='px-3 py-1.5 sm:px-5 sm:py-2 bg-blue-600 max-sm:text-xs text-white rounded'>
                          {
                            progressArray[idx] && (progressArray[idx].lectureCompleted / progressArray[idx].totalLectures) === 1 ? 'Completed' : 'On Going  '
                          }
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>)
        }
      </div>
    </>
  )
}

export default MyEnrollments