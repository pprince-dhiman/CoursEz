import { clerkClient } from "@clerk/express"

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
const addCourse = async (req, res) => {
    try {
        
    } catch (err) {
        res.json({success: false, message: err.message});
    }
}