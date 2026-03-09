import { Link, useNavigate } from 'react-router-dom'
import { assets } from "../../assets/assets.js"
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useContext } from 'react';
import { AppContext } from '../../context/context.jsx';

const Navbar = () => {
  const isCourseListPage = location.pathname.includes('/course-list');
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const {isEducator} = useContext(AppContext);

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-while' : 'bg-cyan-100/70'}`} >
      <div className='cursor-pointer flex items-center gap-2'  onClick={()=> navigate('/')}>
        <img src="/favicon.webp" alt="nav-logo" className='lg:h-8 h-7'/>
        <span className='text-2xl font-semibold text-blue-600'>CoursEz</span>
      </div>
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
          {
            user &&
            <>
              <button onClick={()=>navigate('/educator/educator')}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button> |
              <Link to='/my-enrollments'>My Enrollments</Link>
            </>
          }

        </div>
        {
          user ?
            <UserButton /> :
            <button onClick={() => openSignIn()}
              className='bg-blue-600 text-white px-5 py-2 rounded-full'>
              Create Account
            </button>
        }
      </div>

      {/* for small screens */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          {
            user &&
            <>
              <button onClick={()=>navigate('/educator/educator')}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button> |
              <Link to='/my-enrollments'>My Enrollments</Link>
            </>
          }
        </div>
        {
          user ? <UserButton /> :
            <button onClick={()=> openSignIn()}><img src={assets.user_icon} alt="user_icon" /></button>
        }

      </div>
    </div>
  )
}

export default Navbar