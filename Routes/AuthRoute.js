const express = require('express');
const { linkedInCallback, getUser } = require('../Authcontroller');

const AuthRoutes = express.Router();

AuthRoutes.get('/callback', linkedInCallback);
AuthRoutes.get('/get-user', getUser);

module.exports = AuthRoutes;