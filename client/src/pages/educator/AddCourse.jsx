import React, { useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill' // for rich text editor
import { assets } from '../../assets/assets';
import { dummyCourses } from '../../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../../context/context';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddCourse = () => {
  const { VITE_BACKEND_URL, getToken } = useContext(AppContext);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const [showPopUp, setShowPopUp] = useState(false);

  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false
  });

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt("Enter Chapter name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1
        };
        setChapters([...chapters, newChapter]);
      }
    }
    else if (action === 'remove') {
      const updatedChapters = chapters.filter((chapter) => chapter.chapterId !== chapterId);
      setChapters(updatedChapters);
    }
    else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) => (
          chapter.chapterId === chapterId ?
            { ...chapter, collapsed: !chapter.collapsed } :
            chapter
        ))
      );
    }
  }

  const handleLecture = (action, chapterId, lectureIdx) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopUp(true);
    }
    else if (action === 'remove') {
      chapters.map((chapter) => {
        if (chapter.chapterId === chapterId) {
          chapter.chapterContent.splice(lectureIdx, 1);
        }
        return chapter;
      });
      setChapters([...chapters]);
    }
  }

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            // add lecture duration & lec id to newLecture
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid(),
          }
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );

    setShowPopUp(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false
    });
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if(!image){
        toast.error("Thumbnail not selected.");
        return ;
      }
      setIsAdding(true);

      const courseData = {
        courseTitle, 
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }

      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      formData.append('image', image);

      const token = await getToken();
      const { data } = await axios.post(`${VITE_BACKEND_URL}/api/educator/add-course`, formData, { headers: { Authorization: `Bearer ${token}`}});

      if(data.success){
        toast.success(data.message);
        setCourseTitle('');
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML='';
      }
      else{
        toast.error(data.message);
      }
    }
    catch (err) {
      toast.error(err.message);
    }
    finally{
      setIsAdding(false);
    }
  }

  useEffect(() => {
    // Initiate quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 p-4 pt-8 pb-0'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-md w-full text-gray-500'>
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle} type="text" placeholder='Type here...'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required />
        </div>
        <div className='flex flex-col gap-1'>
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>

        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input onChange={(e) => setCoursePrice(e.target.value)} value={coursePrice} type="number"
              className='outline-none md:py-2.5 py-2 w-28 px-3 border border-gray-500 rounded'
              required />
          </div>

          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImg" className='flex items-center gap-3'>
              <img src={assets.file_upload_icon} alt="file_upload_icon" className='p-3 bg-blue-500 rounded' />
              <input type="file" id="thumbnailImg" onChange={e => setImage(e.target.files[0])} accept='image/*' hidden />
              <img src={image ? URL.createObjectURL(image) : null} />
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <p>Discount %</p>
          <input type="number" min={0} max={100} placeholder='0'
            onChange={(e) => setDiscount(e.target.value)} value={discount}
            className='outline-none p-3 w-28 rounded border border-gray-500' required />
        </div>

        {/* Adding chapters and lectures */}
        <div>
          {
            chapters ? chapters.map((chapter, idx) => (
              <div key={idx} className='bg-white border rounded-lg mb-4'>
                <div className='flex justify-between items-center p-4 border-b'>
                  <div className='flex items-center gap-3'>
                    <img src={assets.dropdown_icon} className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && '-rotate-90'}`}
                      width={14} onClick={() => handleChapter('toggle', chapter.chapterId)} />
                    <span>Ch {idx + 1}. {chapter.chapterTitle}</span>
                  </div>

                  <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>

                  <img src={assets.cross_icon} className='cursor-pointer'
                    onClick={() => handleChapter('remove', chapter.chapterId)} />
                </div>
                {
                  !chapter.collapsed && (
                    <div className='p-4'>
                      {
                        chapter.chapterContent.map((lecture, lecIdx) => (
                          <div key={lecIdx} className='flex items-center justify-between mb-2'>
                            <span>{lecIdx + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target='_blank' className='text-blue-500 hover:underline'>Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}</span>

                            <img src={assets.cross_icon} alt="cross_icon" className='cursor-pointer'
                              onClick={() => handleLecture('remove', chapter.chapterId, lecIdx)} />
                          </div>
                        ))
                      }

                      <div onClick={() => handleLecture('add', chapter.chapterId)}
                        className='inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2'>+ Add Lecture</div>
                    </div>
                  )
                }
              </div>
            )) : <p className='text-red-400'>Please add a chapter.</p>
          }
          <div onClick={() => handleChapter('add')}
            className='flex items-center justify-center bg-blue-100 p-2 rounded-lg cursor-pointer'>
            + Add Chapter
          </div>

          {
            showPopUp && (
              <div className='fixed inset-0 flex items-center justify-center bg-gray-800/50'>
                <div className='bg-white text-gray-700 p-4 rounded relative w-full max-w-80 shadow-md'>
                  <h2 className='text-lg font-semibold mb-4'>Add Lecture</h2>
                  <div className='mb-2'>
                    <p>Lecture Title</p>
                    <input type="text"
                      className='mt-1 block w-full border rounded py-1 px-2'
                      value={lectureDetails.lectureTitle}
                      onChange={(e) => setLectureDetails((prev) => ({ ...prev, lectureTitle: e.target.value }))} />
                  </div>

                  <div className='mb-2'>
                    <p>Duration (minutes)</p>
                    <input type="number"
                      className='mt-1 block w-full border rounded py-1 px-2'
                      value={lectureDetails.lectureDuration}
                      onChange={(e) => setLectureDetails((prev) => ({ ...prev, lectureDuration: e.target.value }))} />
                  </div>

                  <div className='mb-2'>
                    <p>Lecture URL</p>
                    <input type="text"
                      className='mt-1 block w-full border rounded py-1 px-2'
                      value={lectureDetails.lectureUrl}
                      onChange={(e) => setLectureDetails((prev) => ({ ...prev, lectureUrl: e.target.value }))} />
                  </div>

                  <div className='flex gap-2 my-4'>
                    <p>Is Preview Free?</p>
                    <input type="checkbox" className='mt-1 scale-125'
                      checked={lectureDetails.isPreviewFree} onChange={(e) => setLectureDetails((prev) => ({ ...prev, isPreviewFree: e.target.checked }))} />
                  </div>

                  <button type='button' className='w-full bg-blue-400 rounded text-white px-4 py-2' onClick={addLecture}>Add Lecture</button>

                  <img src={assets.cross_icon} alt="cross_icon" className='absolute top-4 right-4 w-4 cursor-pointer' onClick={() => setShowPopUp(false)} />
                </div>
              </div>
            )
          }
        </div>

        <button disabled={isAdding}
        type='submit' className={`${isAdding ? 'cursor-not-allowed bg-gray-600': 'bg-gray-800'}  px-4 py-2 w-20 rounded text-white mx-auto my-5`}>
          { isAdding ? 'Adding...' : 'ADD' }
        </button>
      </form>
    </div>
  )
}

export default AddCourse;