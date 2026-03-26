import { clerkClient } from "@clerk/express";

// Middleware (Protect Educator Route)
export const protectEducator = async (req, res, next) => {
    try {
        const {userId} = req.auth();
        const user = await clerkClient.users.getUser(userId);

        if (user.publicMetadata.role !== 'educator') {
            return res.json({ success: false, message: "Unauthorized Access."}); 
        }

        next();
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}