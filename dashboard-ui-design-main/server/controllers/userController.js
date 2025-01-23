import { User } from "../models/User.js";

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        user = await User.create({
            username,
            password,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
