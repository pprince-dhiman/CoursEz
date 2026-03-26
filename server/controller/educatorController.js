import { clerkClient } from "@clerk/express"
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";

export const updateRoleToEducator = async (req, res) => {
    try {
        const { userId } = req.auth();
        console.log(userId);

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        });

        res.json({ success: true, message: "You can publish a course now." });
    }
    catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Add New Course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const { userId } = req.auth();
        const educatorId = userId;

        if (!imageFile) {
            return res.json({ success: false, message: "Thumbnail not uploaded." });
        }

        const parsedCourseData = await JSON.parse(courseData);
        parsedCourseData.educator = educatorId;

        const newCourse = await Course.create(parsedCourseData);

        const uploadedImage = await cloudinary.uploader.upload(imageFile.path, { folder: 'LMS/course-thumbnails' });
        newCourse.courseThumbnail = uploadedImage.secure_url;
        await newCourse.save();

        res.json({ success: true, message: "Course Added" })
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const { userId } = req.auth();
        const courses = await Course.find({ educator: userId });
        res.json({ success: true, courses });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Educator Dashboard data (Total Earnings, Enrolled students, No. of courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const courses = await Course.find({ educator: userId });
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // calculate total earning from purchase
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: completed
        });

        const totalEarning = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // collect enrolled students IDs with thier course title
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach((student) => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student,
                });
            });
        }

        res.json({
            success: true, dashboardData: {
                totalCourses, totalEarning, enrolledStudentsData
            }
        });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        // Get all educator's published courses
        const { userId } = req.auth();
        const courses = await Course.find({ educator: userId });

        // get all course id's in courseIds (array)
        const courseIds = courses.map(course => course._id);

        // Purchased courses.
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map((purchase) => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchasedDate: purchase.createdAt,
        }));

        res.json({ success: true, enrolledStudents });
    }
    catch (err) {
        res.json({ success: false, message: err.message });
    }
}