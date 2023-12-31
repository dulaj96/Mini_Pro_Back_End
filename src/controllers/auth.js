import authService from '../services/auth.js'
import ApiError from '../utils/errors/ApiError.js'

import { StatusCodes, ReasonPhrases } from 'http-status-codes'

const registerUser = async (req, res) => {
    const { email, password, name } = req.body //TODO add validation
    var user = {
        email,
        name,
    }
    const doc = await authService.registerUser(user, password)
    res.staus(StatusCodes.OK).json({ status: ReasonPhrases.OK, data: doc })
}

const localLogin = async (req, res) => {
    if (req.isAuthenticated()) {
        var { _id, role, emailVerified } = req.user

        if (!emailVerified) {
            throw new ApiError(
                StatusCodes.UNAUTHORIZED,
                ReasonPhrases.UNAUTHORIZED,
                'Email Not Verified'
            )
        }

        var payload = { _id, role }
        var token = authService.getToken(payload)
        res.staus(StatusCodes.OK).json({
            status: ReasonPhrases.OK,
            token: token,
        })
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
            status: ReasonPhrases.UNAUTHORIZED,
        })
    }
}

const googleCallback = async (req, res) => {
    // Successful authentication, redirect home.
    //res.redirect('/')

    var { _id, role, emailVerified } = req.user

    if (!emailVerified) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED,
            'Email Not Verified'
        )
    }

    var payload = { _id, role }
    var token = authService.getToken(payload)

    res.staus(StatusCodes.OK).json({
        status: ReasonPhrases.OK,
        user: req.user,
        token: token,
    })
}



export default { registerUser, localLogin, googleCallback }
