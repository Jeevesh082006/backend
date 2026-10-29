const UserService = require('../services/userservices');

class UserController {

    // SIGNUP
    async signup(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    message: 'Name, email, and password are required.'
                });
            }

            const result = await UserService.signup(
                name,
                email,
                password
            );

            return res.status(201).json({
                message: 'User registered successfully',
                user: result
            });

        } catch (error) {
            console.error('Error during signup:', error);

            if (error.message === 'User with this email already exists.') {
                return res.status(409).json({
                    message: error.message
                });
            }

            return res.status(500).json({
                message: 'Internal server error'
            });
        }
    }


    // LOGIN
    async login(req, res) {
        try {
            const { email, password } = req.body;

            console.log('Login request:', email);

            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email and password are required.'
                });
            }

            const result = await UserService.loginUser(
                email,
                password
            );

            console.log('Login successful');

            return res.status(200).json({
                message: 'Login successful',
                user: result.user,
                token: result.token
            });

        } catch (error) {
            console.error('LOGIN ERROR:', error);

            if (error.message === 'User not found.') {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }

            if (error.message === 'Invalid password.') {
                return res.status(401).json({
                    message: 'Invalid password.'
                });
            }

            return res.status(500).json({
                message: 'Internal server error'
            });
        }
    }

    // GET ALL USERS
    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json({
                message: 'Users retrieved successfully',
                users: users
            });
        } catch (error) {
            console.error('Error fetching all users:', error);
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
    }
    async addUserProfile(req, res) {
        try {
            const userId = req.params.userId;
            const profileData = req.body;
            if(!userId){
                return res.status(400).json({ message: 'User ID is required' });
            }
            const userProfile = await UserService.addUserProfile(userId, profileData);
            res.status(201).json(newUserProfile);
        } catch (error) {
            if(error.message===11000) {
                return res.status(409).json({ message: 'User profile already exists.' });
            }
            console.error('Error adding user profile:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
module.exports = new UserController();