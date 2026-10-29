const User = require('../models/usermodel');
const UserProfile = require('../models/userprofilemodel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const tokenService = require('../jwt/tokenservice');

class UserService {

    // SIGNUP
    async signup(name, email, password) {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error('User with this email already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isActive: true
        });

        return user;
    }

    // LOGIN
    async loginUser(email, password) {
        const user = await User.findOne({ email }).select('+password');

        if (!user || user.isActive === false) {
            throw new Error('User not found or inactive.');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Invalid password.');
        }

        const payload = {
            id: user._id,
            email: user.email,
            isActive: user.isActive
        };

        const token = tokenService.generateToken(payload);

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return {
            user: userWithoutPassword,
            token
        };
    }

    // GET ONLY ACTIVE USERS WITH PROFILES
    async getAllUsers() {
        const users = await User.find(
            { isActive: true },
            { password: 0 }
        );

        const userIds = users.map(user => user._id);

        const userProfiles = await UserProfile.find({
            user: { $in: userIds }
        });

        const userWithProfiles = users.map((user) => {
            const profile = userProfiles.find(
                (profile) =>
                    profile.user.toString() === user._id.toString()
            );

            return {
                ...user.toObject(),
                profile: profile || null
            };
        });

        return userWithProfiles;
    }

    // ADD USER PROFILE
    async addUserProfile(userId, profileData) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }

        const user = await User.findOne({
            _id: userId,
            isActive: true
        });

        if (!user) {
            throw new Error('Active user not found');
        }

        const existingProfile = await UserProfile.findOne({
            user: userId
        });

        if (existingProfile) {
            throw new Error('User profile already exists');
        }

        const userProfile = await UserProfile.create({
            user: userId,
            age: profileData.age,
            dob: profileData.dob,
            bio: profileData.bio
        });

        user.profile = userProfile._id;
        await user.save();

        return userProfile;
    }

    // SOFT DELETE USER
    async softDeleteUser(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }

        const user = await User.findOneAndUpdate(
            { _id: userId, isActive: true },
            { $set: { isActive: false } },
            { new: true }
        );

        if (!user) {
            throw new Error('Active user not found');
        }

        return {
            message: 'User soft-deleted successfully'
        };
    }
}

module.exports = new UserService();