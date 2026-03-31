import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/context';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from "react-youtube";
import axios from 'axios';
import { toast } from 'react-toastify';

const CourseDetail = () => {
  const { id } = useParams();
  const { allCourses, calculateRating, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, currency, VITE_BACKEND_URL, userData, getToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`${VITE_BACKEND_URL}/api/course/${id}`);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Login to Enroll.");
      }
      if (isAlreadyEnrolled) {
        return toast.warn("Already Enrolled.");
      }

      setEnrolling(true);
      const courseId = courseData._id;
      const token = await getToken();
      const { data } = await axios.post(`${VITE_BACKEND_URL}/api/user/purchase`, { courseId }, { headers: { Authorization: `Bearer ${token}` } });

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      }
      else {
        toast.error(data.message);
      }
    }
    catch (err) {
      toast.error(err.message);
    }
    finally{
      setEnrolling(false);
    }
  }

  // console.log(openSections)

  const toggleSections = (index) => {
    setOpenSections((prev) => (
      { ...prev, [index]: !prev[index] }
    ));
  }

  useEffect(() => {
    fetchCourseData();
  }, [allCourses]);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  return courseData ? (
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>

      <div className='absolute top-0 left-0 w-full h-[500px] -z-1 bg-gradient-to-b from-cyan-100/70'></div>

      {/* left column */}
      <div className='max-w-xl z-10 text-gray-500'>
        <h1 className='text-[24px] md:text-[36px] text-gray-800 font-semibold my-2 leading-9'>
          {courseData?.courseTitle}
        </h1>
        <p className='pt-4 md:text-base text-sm inline'
          dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) + '...'}}>
        </p>
        {/* Review and ratings */}

        <div className='flex items-center space-x-2 pt-3 pb-2 text-sm'>

          {/* Average rating of course as per all students rating */}
          <p>{calculateRating(courseData)}</p>

          {/* Rating starts  */}
          <div className='flex'>
            {[...Array(5)].map((_, i) => (<img key={i} src={i < calculateRating(courseData) ? assets.star : assets.star_blank} className='w-3.5 h-3.5' />))}
          </div>

          <p className='text-blue-600'>{courseData.courseRatings.length}
            {courseData.courseRatings.length > 1 ? ' ratings' : ' rating'}
          </p>
          <p>
            {courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? ' students' : ' student'} enrolled
          </p>
        </div>

        <p>Course by <span className='text-blue-600 underline'>Prince Dhiman</span></p>

        {
          isAlreadyEnrolled && (
            <div className='flex justify-end'>
              <button
                onClick={() => navigate('/player/' + courseData._id)}
                className='bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] rounded-md px-5 py-2 mt-7'>
                Start Course
              </button>
              {/* <Link to={'/player/'+courseData._id}}></Link> */}
            </div>
          )
        }

        <div className='pt-8 text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>

          <div className='pt-5'>
            {
              courseData?.courseContent?.map((chapter, idx) => (
                <div key={idx} className='border border-gray-300 bg-white mb-2 rounded'>
                  <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSections(idx)}>
                    <div className='flex items-center gap-2'>
                      <img className={`transition-all duration-300 ${openSections[idx] ? 'rotate-180' : 'rotate-0'}`}
                        src={assets.down_arrow_icon} alt="arrow-icon" />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm md:text-default'>
                      {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  {/* Inside each chapter */}
                  <div className={`overflow-hidden transition-all duration-300 
                    ${openSections[idx] ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className='list-disc md:pl-10 px-4 py-2 text-gray-600 border-t border-gray-300'>
                      {
                        chapter.chapterContent.map((lecture, idx) => (
                          <li key={idx} className='flex items-center gap-2 py-1'>
                            <img src={assets.play_icon} alt="play-icon" className='w-4 h-4 mt-1' />
                            <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                              <p>{lecture.lectureTitle}</p>
                              <div className='flex gap-2'>
                                {lecture.isPreviewFree && <p
                                  className='text-blue-500 cursor-pointer'
                                  onClick={() => setPlayerData({
                                    videoId: lecture.lectureUrl.split('/').pop()
                                  })}
                                >Preview</p>}
                                <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                              </div>
                            </div>
                          </li>
                        ))
                      }
                    </ul>
                  </div>

                </div>
              ))
            }
          </div>
        </div>

        <div className='py-20 text-sm md:text-default'>
          <h1 className='text-xl font-semibold text-gray-800'>Course Description</h1>
          <p className='pt-3 rich-text'
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}>
          </p>
        </div>
      </div>

      {/* right column */}
      <div className='max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] '>
        {/* Showing preview or thumbnail */}
        {
          playerData
            ? <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName='w-full aspect-video' />
            : <img src={courseData.courseThumbnail} alt="thumbnail" className='rounded-t' />
        }

        <div className='p-5'>
          <div className='flex items-center gap-2'>
            <img className='w-3.5' src={assets.time_left_clock_icon} alt="time-left-clock-icon" />
            <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price</p>
          </div>

          <div className='flex gap-3 items-center pt-2'>
            <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency} {(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)}</p>
            <p className='md:text-lg text-gray-500 line-through'>{currency} {courseData.coursePrice}</p>
            <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
          </div>

          <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
            <div className='flex items-center gap-1'>
              <img src={assets.star} alt="star-icon" />
              <p>{calculateRating(courseData)}</p>
            </div>

            {/* Horizontal line */}
            <div className='w-[1px] h-4 bg-gray-500/40'></div>

            <div className='flex items-center gap-1'>
              <img src={assets.time_clock_icon} alt="time-clock-icon" />
              <p>{calculateCourseDuration(courseData)}</p>
            </div>

            {/* Horizontal line */}
            <div className='w-[1px] h-4 bg-gray-500/40'></div>

            <div className='flex items-center gap-1'>
              <img src={assets.lesson_icon} alt="lesson-icon" />
              <p>{calculateNoOfLectures(courseData)} lessons</p>
            </div>
          </div>

          <button
            onClick={enrollCourse}
            disabled={isAlreadyEnrolled || enrolling}
            className={`md:mt-6 mt-4 w-full py-3 rounded font-medium transition-all duration-200 ${isAlreadyEnrolled || enrolling ?
              'bg-gray-400 text-gray-700 cursor-not-allowed' :
              'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
              } `}>
            {isAlreadyEnrolled ? ('Already Enrolled') : (enrolling ? 'Enrolling...' : 'Enroll Now')}
          </button>

          <div className='pt-6'>
            <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
            <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
              <li>Lifetime access with free updates.</li>
              <li>Step-by-step, hands-on project guidance.</li>
              <li>Downloadable resources and source code.</li>
              <li>Quizzes to test your knowledge.</li>
              <li>Certificate of completion.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  ) : <>
    <Loading />
  </>
}

export default CourseDetail