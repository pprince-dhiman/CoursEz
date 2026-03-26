import User from "../models/User.js";

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