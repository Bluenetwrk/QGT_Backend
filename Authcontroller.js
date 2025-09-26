const router = require('./Routes/StudentProfileRoutes');
const User = require('./Schema/UserModel');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch'); // Ensure this is installed: npm install node-fetch
const URLSearchParams = require('url').URLSearchParams;

const getAccessToken = async (code) => {
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/AuthRoute/callback',
    });

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'post',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const accessToken = await response.json();
    return accessToken;
};

const getUserData = async (accessToken) => {
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
        method: 'get',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const userData = await response.json();
    return userData;
};

const linkedInCallback = async (req, res) => {
    try {
        const { code } = req.query;

        const accessToken = await getAccessToken(code);
        const userData = await getUserData(accessToken.access_token);

        if (!userData) {
            return res.status(500).json({
                success: false,
                error: 'Failed to retrieve user data'
            });
        }

        let user = await User.findOne({ email: userData.email });

        if (!user) {
            user = new User({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                picture: userData.picture
            });
            await user.save();
        }

        const token = jwt.sign(
            { name: user.name, email: user.email, picture: user.picture },
            process.env.JWT_SECRET
        );

        res.cookie('token', token, { httpOnly: true });
        res.redirect('https://www.itwalkin.com');
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getUser = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ success: false });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

module.exports = {
    linkedInCallback,
    getUser
};