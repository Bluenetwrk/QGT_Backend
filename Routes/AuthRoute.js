import express from 'express'
import { linkedInCallback, getUser } from '../Authcontroller.js'

const AuthRotues = express.Router()

AuthRotues.get('/callback', linkedInCallback)
AuthRotues.get('/get-user', getUser)

export default AuthRotues