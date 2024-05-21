import { connectDB } from "../db/db.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const getAllUsers = asyncHandler (async (req, res) => {
    try {
        let results = await User.find({});
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
})

const getUserById = async (req, res) => {
    try {
        res.status(200).json({ message: "Get user by id" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const createNewUser = async (req, res) => {
    try {

        //get data from user
        //validation - not empty
        //check if user already exist
        //create user object and enter into DB
        //remove password and refresh token field from response
        //check for user creation
        //return the response

        const { firstName, lastName, email, password, phoneNumber, address, postalCode, dateOfBirth, collegeName, studentId, isAdmin} = req.body
        if([firstName, lastName, email, password].some((field) => field?.trim() === "")){
            throw new ApiError(400, "All Fields are required")
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            throw new ApiError(409, "User already exist with same email...")
        }
        const user = await User.create({
            firstName, lastName, 
            email, password,
             phoneNumber, address, 
             postalCode, dateOfBirth, 
             collegeName, studentId, 
             isAdmin  
        })

        const createdUser = await User.findById(user._id).select("-password")

        if(!createdUser){
            throw new ApiError(500, "something went wrong while creating user")
        }
         return res.status(201).json(
            new ApiResponse(200, createdUser, "User Registered successfully")
         )
   
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const updateUser = async (req,res) => {
    console.log("got update req");
    const updatedData = req.body;

    console.log("updating ...");
    const updatingUser = await User.findOneAndUpdate(updatedData.email,updatedData);

    console.log("saving update");
    await updatingUser.save();
    res.status(200).json({ message: "User Updated "})
};

export { getAllUsers, getUserById, createNewUser, updateUser};
