import { User } from '../modules/user.modules.js';

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        return res.status(200).json({ sucess: true, user });
    } catch (err) {
        console.error("Get current user error:", err);
        return res.status(500).json({ sucess: false, message: "Internal server error" });
    }
};
