const User = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// user register controller
exports.register = async(req, res) => {
    const {username, email, password} = req.body

    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({message: "User already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({username, email, password: hashedPassword})
    res.status(201).json({message: "User created successfully", user})
}

// user login controller
exports.login = async(req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message: "User not found"})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(401).json({message: "Invalid password"})
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
    res.status(200).json({message: "User logged in successfully", user, token})
}

// user profile controller
exports.profile = async(req, res) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({message: "User profile", user})
}

// user update profile controller
exports.updateProfile = async(req, res) => {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {new: true})
    res.status(200).json({message: "User profile updated successfully", user})
}

// user delete profile controller
exports.deleteProfile = async(req, res) => {
    const user = await User.findByIdAndDelete(req.user.id)
    res.status(200).json({message: "User profile deleted successfully", user})
}
