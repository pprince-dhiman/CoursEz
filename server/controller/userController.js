import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";

// Get user data
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        console.log(userId);
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

        const amount = (courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2);

        const purchasedData = { courseId, userId, amount };
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
                unit_amount: Math.floor(newCoursePurchase.amount) * 100
            },
            quantity: 1
        }]

        // Create payment session
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newCoursePurchase._id.toString(),
            }
        });

        console.log("Session: ",session);

        res.json({ success: true, session_url: session.url });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}