import { useEffect, useState } from "react"
import { dummyStudentEnrolled } from "../../assets/assets.js"
import Loading from "../../components/student/Loading.jsx";
import { useContext } from "react";
import { AppContext } from "../../context/context.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const StudentEnrolled = () => {
  const [enrolledStudent, setEnrolledStudent] = useState(null);
  const { getToken, VITE_BACKEND_URL, isEducator } = useContext(AppContext);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${VITE_BACKEND_URL}/api/educator/enrolled-students`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setEnrolledStudent(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    if (isEducator)
      fetchEnrolledStudents();
  }, [isEducator]);

  return enrolledStudent ? (
    <div className="min-h-screen flex flex-col items-start justify-start md:p-8 md:pb-0 p-4 pt-8 pb-0 shadow-sm">
      <h2 className='pb-5 text-lg font-medium'>Enrolled Students</h2>

      {
        enrolledStudent.length === 0 ?
          (
            <div className="w-full h-[50vh] flex items-center justify-center bg-gray-50 rounded-lg border mt-5 max-w-4xl">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-400">
                  None Enrolled Yet
                </h2>
                <p className="mt-2 text-gray-400 text-sm md:text-base">
                  No one is enrolled to your courses yet.
                </p>
              </div>
            </div>
          ) :
          (
            <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
              <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">

                <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                    <th className="px-4 py-3 font-semibold">Student Name</th>
                    <th className="px-4 py-3 font-semibold">Course Title</th>
                    <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    enrolledStudent.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-500/20">

                        <td className="px-4 py-3 text-center hidden sm:table-cell">{idx + 1}</td>

                        <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                          <img src={item.student.imageUrl} className="w-9 h-9 rounded-full" />
                          <span className="truncate">{item.student.name}</span>
                        </td>

                        <td className="px-4 py-3 truncate">
                          {item.courseTitle}
                        </td>

                        <td className="px-4 py-3 hidden sm:table-cell">
                          {new Date(item.purchasedDate).toLocaleDateString()}
                        </td>

                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )
      }
    </div>
  ) :
    <Loading />
}

export default StudentEnrolled