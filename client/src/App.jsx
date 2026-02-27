import Home from "./pages/student/Home.jsx"
import { Route, Routes, useMatch } from 'react-router-dom'
import CoursesList from "./pages/student/CoursesList.jsx"
import CourseDetail from "./pages/student/CourseDetail.jsx"
import MyEnrollments from "./pages/student/MyEnrollments.jsx"
import Player from "./pages/student/Player.jsx"
import Loading from "./components/student/Loading.jsx"
import Educator from "./pages/educator/Educator.jsx"
import DashBoard from "./pages/educator/DashBoard.jsx"
import AddCourse from "./pages/educator/AddCourse.jsx"
import MyCourses from "./pages/educator/MyCourses.jsx"
import StudentEnrolled from "./pages/educator/StudentEnrolled.jsx"
import Navbar from "./components/student/Navbar.jsx"
import Footer from "./components/student/Footer.jsx"

const App = () => {
  const isEducatorRoute = useMatch('/educator/*');
  return (
    <div className="text-default min-h-screen bg-white">
      {isEducatorRoute ?"" : <Navbar/> }

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/course-list' element={<CoursesList/>} />
        <Route path='/course-list/:input' element={<CoursesList/>} />

        <Route path="/course/:id" element={<CourseDetail/>} />
        <Route path="/my-enrollments" element={<MyEnrollments/>} />
        <Route path="/player/:courseId" element={<Player/>} />
        <Route path="/loading/:path" element={<Loading/>} />
        {/* Nested routes for educator */}
        <Route path="/educator" element={<Educator/>} >
          <Route path="educator" element={<DashBoard/>} />
          <Route path="add-course" element={<AddCourse/>} />
          <Route path="my-course" element={<MyCourses/>} />
          <Route path="student-enrolled" element={<StudentEnrolled/>} />
        </Route>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App