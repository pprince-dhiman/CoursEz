import Course from "../models/Course.js"

// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator' });

        res.json({ success: true, allCourses });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get course by Id
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const courseData = await Course.findById(id)
            .populate({ path: 'educator' });

        // Remove lec Url if preview is false
        courseData.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            })
        });

        res.json({ success: true, courseData })
    }
    catch (err) {
        res.json({ success: false, message: err.message });
    }
}