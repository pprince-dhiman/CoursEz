import CourseSection from '../../components/student/CourseSection'
import TestimonialSection from '../../components/student/TestimonialSection'
import CalltoAction from '../../components/student/CalltoAction'
import Background from '../../components/student/Background'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Background />
      <CourseSection/>
      <TestimonialSection/>
      <CalltoAction/>
    </div>
  )
}

export default Home