import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";

const options = {
    httpOnly : true,
    secure : true
}

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken =  await user.generateAccessToken()
        const refreshToken = await user.generateRefereshToken()
        user.refreshToken = refreshToken
        user.save({validateBeforeSave: false})

        return {refreshToken, accessToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const loginUser = asyncHandler ( async (req, res) => {

    try {
        const {email, password} = req.body
    
        if(!email || !password){
            throw new ApiError(400, "Username and Password is required");
        }
    
        const user = await User.findOne({email})
    
        if(!user){
            throw new ApiError(404, " User Does not exist");
        }
    
        const isPasswordValid = await user.isPasswordCorrect(password)
    
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user Credentials")
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        const loggedInUser = await User.findById(user._id).
        select("-password -refreshtoken")
        
        
        return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "user LoggedIn Successfully"
        )
    )
    } catch (error) {
        return res.status(500).json({message :  error?.message})
        
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )


    return res.status(200).
    clearCookie("accessToken", options).
    clearCookie("refreshToken", options).
    json(new ApiResponse(200,{},"Logged Out Successfully"))


})

const refreshAccessToken = asyncHandler(async(req, res)=>{
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used")
        }
        const {accessToken, newRefresToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res.status(200).
        cookie("accessToken", accessToken).
        cookie("refreshToken", newRefresToken).
        json(
            new ApiResponse(
                200,{accessToken, refreshToken: newRefresToken},
                "access token refreshed"
            )
        )
    } catch (error) {
        new ApiError(401, error?.message || "invalid refresh token")
        
    }

});

export {loginUser, logoutUser, refreshAccessToken}
