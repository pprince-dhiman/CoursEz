import { Link } from "react-router-dom"
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>

        <div className='flex flex-col md:items-start items-center w-full'>
          <div className='cursor-pointer flex items-center gap-2'>
            <img src="/favicon.webp" alt="nav-logo" className='lg:h-8 h-7' />
            <span className='text-2xl font-semibold text-white'>CoursEz</span>
          </div>
          <p className='mt-6 text-center md:text-left text-sm text-white/80'>
            Enroll in courses, follow structured learning paths, and gain practical
            knowledge from experienced instructors.
          </p>
        </div>

        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><Link to='/' onClick={() => scrollTo(0, 0)}>Home</Link></li>
            <li><Link to='/about' onClick={() => scrollTo(0, 0)}>About us</Link></li>
            <li><p>contact: dhimanprince55555@gmail.com</p></li>
          </ul>
        </div>

        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
          <p className='text-sm text-white/80'>
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className='flex items-center gap-2 pt-4'>
            <input
              type="email"
              placeholder='Enter your email'
              className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'
            />
            <button className='bg-blue-600 w-24 h-9 text-white rounded'>
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-around items-center max-w-3xl mx-auto">
        <p className="py-4 text-center text-xs md:text-sm text-white/60">Copyright 2025 &copy; CoursEz. All Right Reserved.</p>
        <div className="flex space-x-7 justify-center items-center text-white">
          <a
            href="https://github.com/pprince-dhiman/"
            target="_blank"
            className="hover:scale-[95%] transition-all duration-200"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/prince-kumar-980654291/" target="_blank"
            className="hover:scale-[95%] transition-all duration-200"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://x.com/PrinceK9535221"
            target="_blank"
            className="hover:scale-[95%] transition-all duration-200"
          >
            <FaSquareXTwitter size={24} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer