import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateToken_and_setCookie.js";
import { v2 as cloudinary } from "cloudinary";

/* get routes */
const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({username}).select("-password").select("-updatedAt");

        if (!user) {
            return res.status(400).json({ error: "User not found." });
        }

        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Get user profile error: " + err.message);
    }
};

/* post routes */
const signupUser = async(req, res) => {
    try {
        const { name, email, username, password } = req.body;

        // if email or username exists
        const user = await User.findOne({$or: [{email, username}]});

        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        if (newUser) {
            // set cookie
            generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Signup error: " + err.message)
    }
};

const loginUser = async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        
        // check password or username does not exist
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // generate token
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
        });
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log("Login error: ", err.message);
    }
};

const logoutUser = (req, res) => {
    try {
        // clear cookie
        res.cookie("jwt", "", {maxAge:1});
        res.status(200).json({ message: "Logout success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Signup error: " + err.message);
    }
};

const followUnfollowUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({
                error: "You cannot follow/unfollow your own account."
            });
        }

        if (!userToModify || !currentUser) {
            return res.status(400).json({
                error: "User not found."
            });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // unfollow user
            // modify current user following, followers of userToModify
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { following:id }
            });

            await User.findByIdAndUpdate(id, {
                $pull: {followers: req.user._id}
            });

            res.status(200).json({
                message: "User unfollowed successfully."
            });
        } else {
            // follow user
            // modify current user following, followers of userToModify
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following:id }
            });

            await User.findByIdAndUpdate(id, {
                $push: {followers: req.user._id}
            });

            res.status(200).json({
                message: "User followed successfully."
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in followUnfollowUser: " + err.message)
    }
};

const updateUser = async (req,res) => {
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                error: "User not found."
            });
        }

        if (req.params.id !== userId.toString()) {
            return res.status(400).json({
                error: "You cannot update other user's profile."
            });
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        // profile photo is provided in frontend
        if (profilePic) {
            // change the old profile photo with the new one
            if (user.profilePic) {
                // destroy old profile photo from cloudinary
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        // password should be null in response
        user.password = null;

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Update user error: " + err.message);
    }
};

export {
    signupUser,
    loginUser,
    logoutUser,
    followUnfollowUser,
    updateUser,
    getUserProfile
};