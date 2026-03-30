import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets } from "../../assets/assets.js"
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useContext, useState } from 'react';
import { AppContext } from '../../context/context.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const location = useLocation();

  const isCourseListPage = location.pathname.includes('/course-list');
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { isEducator, VITE_BACKEND_URL, setIsEducator, getToken } = useContext(AppContext);

  const [loading, setLoading] = useState(false);

  const becomeEducator = async () => {
    // If user is already an educator.
    if (isEducator) {
      navigate('/educator/dashboard');
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      // console.log("Token: ", token);
      const { data } = await axios.post(`${VITE_BACKEND_URL}/api/educator/update-role`, {},  {
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log(data);
      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-while' : 'bg-cyan-100/70'}`} >
      <div className='cursor-pointer flex items-center gap-2' onClick={() => navigate('/')}>
        <img src="/favicon.webp" alt="nav-logo" className='lg:h-8 h-7' />
        <span className='text-2xl font-semibold text-blue-600'>CoursEz</span>
      </div>
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
          {
            user &&
            <>
              <button onClick={becomeEducator} disabled={loading}
               className={ (!isEducator) ? 'border rounded-md px-3 py-1 border-gray-400 hover:bg-blue-600 hover:text-white hover:border-none' : ''}>
                {(isEducator) ? ('Educator Dashboard') : (loading?'Making...':'Become Educator')}
              </button> |
              <Link to='/my-enrollments' 
                className='border border-black text-[#2c2f68] py-1 px-2 rounded-md shadow-sm  hover:text-white hover:bg-gray-600'
              >My Enrollments</Link>
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
              <button onClick={becomeEducator} disabled={loading}
               className={ (!isEducator) ? 'border rounded-md px-2 py-0.5 border-gray-400 hover:bg-blue-600 hover:text-white hover:border-none' : ''}>
                {(isEducator) ? ('Educator Dashboard') : (loading?'Making...':'Become Educator')}
              </button> |
              <Link to='/my-enrollments'>My Enrollments</Link>
            </>
          }
        </div>
        {
          user ? <UserButton /> :
            <button onClick={() => openSignIn()}><img src={assets.user_icon} alt="user_icon" /></button>
        }

      </div>
    </div>
  )
}

export default Navbar