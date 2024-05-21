import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema } = mongoose; // Corrected line

const userSchema = new Schema({ // Corrected line
    // id: { type: String, required: true, index: true, auto: true, unique: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, dropDups: true, index: true },
    password: { type: String, required: [true, 'Password is required'] },
    phoneNumber: { type: String, required: true, length: 10 },
    address: { type: String, required: true },
    postalCode: { type: String, required: true, length: 6 },
    dateOfBirth: { type: Date, required: true },
    collegeName: { type: String, required: true },
    studentId: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        firstName: this.firstName
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

userSchema.methods.generateRefereshToken = async function () {
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};

const User = mongoose.model("User", userSchema);

export { User };
