import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/context';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from "react-youtube";
import Rating from '../../components/student/Rating';
import Loading from '../../components/student/Loading'
import axios from 'axios';
import { toast } from 'react-toastify';

const Player = () => {
  const { courseId } = useParams();
  const { enrolledCourses, calculateChapterTime, VITE_BACKEND_URL, userData, getToken, fetchUserEnrolledCourses } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initailRating, setInitialRating] = useState(0);

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);

        course.courseRatings.map((data) => {
          if (data.userId === userData._id) {
            setInitialRating(data.rating);
          }
        });
      }
    });
  }

  const toggleSections = (index) => {
    setOpenSections((prev) => (
      { ...prev, [index]: !prev[index] }
    ));
  }

  useEffect(() => {
    if (enrolledCourses) {
      getCourseData();
    }
  }, [enrolledCourses]);

  // Function of fetch the course Progress data.
  const getProgressData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${VITE_BACKEND_URL}/api/user/get-course-progress`, { courseId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    }
    catch (err) {
      toast.error(err.message);
    }
  }

  // Function to update the course progress (lecture completed)
  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${VITE_BACKEND_URL}/api/user/update-course-progress`, { courseId, lectureId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        // lecture marked as completed, again needs updated course Progress.
        getProgressData();
      } else {
        toast.error(data.message);
      }
    }
    catch (err) {
      toast.error(err.message);
    }
  }

  const handleRating = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${VITE_BACKEND_URL}/api/user/add-rating`, { courseId, rating }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      }
      else {
        toast.error(data.message);
      }
    }
    catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    getProgressData()
  }, []);

  return courseData ? (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        {/* left column */}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>

          <div className='pt-5'>
            {
              courseData && courseData?.courseContent?.map((chapter, idx) => (
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
                  <div className={`overflow-hidden transition-all duration-300 ${openSections[idx] ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className='list-disc md:pl-10 px-4 py-2 text-gray-600 border-t border-gray-300'>
                      {
                        chapter.chapterContent.map((lecture, i) => (
                          <li key={i} className='flex items-center gap-2 py-1'>

                            <img src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="play-icon" className='w-4 h-4 mt-1' />

                            <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                              <p>{lecture.lectureTitle}</p>
                              <div className='flex gap-2'>
                                {lecture.lectureUrl && <p
                                  className='text-blue-500 cursor-pointer'
                                  onClick={() => setPlayerData(

                                    // inserting 2 more pair in lec. obj to track ch. no. and lec.no.
                                    { ...lecture, chapter: idx + 1, lecture: i + 1 }

                                  )}>
                                  Watch
                                </p>}

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

          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-bold'>Rate this Course:</h1>
            <Rating initailRating={initailRating} onRate={handleRating} />
          </div>

        </div>

        {/* right column */}
        <div className='md:mt-10'>
          {
            // initially -> playerData -> null;
            // user click -> 'watch' -> setPlayerData({...lecture, lec and ch})
            // now playerData -> {lecture}
            playerData ?
              (
                <div>
                  <YouTube videoId={playerData.lectureUrl.split('/').pop()} iframeClassName='w-full aspect-video' />
                  <div className='flex justify-between items-center mt-1'>
                    <p>{playerData.chapter}.{playerData.lecture}: {playerData.lectureTitle}</p>
                    <button onClick={() => markLectureAsCompleted(playerData.lectureId)}
                      className={progressData && progressData.lectureCompleted.includes(playerData.lectureId)? 'text-green-600': 'text-blue-600'}>
                      {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed' : 'Mark as Completed'}
                    </button>
                  </div>
                </div>
              )
              :
              <img src={courseData ? courseData.courseThumbnail : null} alt="course-thumbnail" />
          }
        </div>
      </div>
    </>
  ) :
    <Loading />
}

export default Player;