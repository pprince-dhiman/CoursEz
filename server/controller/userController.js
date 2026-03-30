import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import CourseProgress from "../models/courseProgress.js";

// Get user data
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        // console.log(userId);
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        res.json({ success: true, user });
    }
    catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// get User Enrolled all courses with lecture link
export const userEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.auth();
        const userData = await User.findById(userId)
            .populate('enrolledCourses');

        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }

}

// Purchase course
export const purchaseCourse = async (req, res) => {
    try {
        const { origin } = req.headers;
        const { userId } = req.auth();
        const { courseId } = req.body;

        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData || !courseData) {
            return res.json({ success: false, message: "Data not found." });
        }

        const calAmount = courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100);
        const finalAmount = Number(calAmount.toFixed(2));

        const purchasedData = { courseId, userId, amount: finalAmount };
        const newCoursePurchase = await Purchase.create(purchasedData);

        // stripe gateway initialized
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        // Creating line_items for stripe
        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.round(finalAmount * 100)
            },
            quantity: 1
        }]

        // Create payment session
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `https://coursez-flax.vercel.app/loading/my-enrollments`,
            cancel_url: `https://coursez-flax.vercel.app/`,
            line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newCoursePurchase._id.toString(),
            }
        });

        // console.log("Session: ", session);

        res.json({ success: true, session_url: session.url });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Update user course Progress
export const updateUserCourseProgress = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { courseId, lectureId } = req.body;

        const progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: "Lecture already completed." })
            }
            progressData.lectureCompleted.push(lectureId);
            await progressData.save();
        }
        else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            });
        }

        res.json({ success: true, message: "Course Progress Updated." });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Get the user course progres
export const getUserCourseProgress = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { courseId } = req.body;

        const progressData = await CourseProgress.findOne({ userId, courseId });

        res.json({ success: true, progressData });
    }
    catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Add user rating to course
export const addUserRating = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { courseId, rating } = req.body;

        if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
            return res.json({ success: false, message: "Invalid Data" });
        }
        const courseData = await Course.findById(courseId);
        if (!courseData) {
            return res.json({ success: false, message: "Course not found." });
        }

        const userData = await User.findById(userId);
        if (!userData || !userData.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: "You are not enrolled to this course." });
        }

        let found = false;
        for (const ratingData of courseData.courseRatings) {
            if (ratingData.userId === userId) {
                ratingData.rating = rating;
                found = true;
                break;
            }
        }

        if (!found) courseData.courseRatings.push({ userId, rating });

        await courseData.save();

        res.json({ success: true, message: "Rating added." });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}