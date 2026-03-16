const Post = require("../models/post.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// create post controller
exports.createPost = async(req, res) => {
    const {title, content, image} = req.body
    const post = await Post.create({title, content, image})
    res.status(201).json({message: "Post created successfully", post})
}

// get all posts controller
exports.getAllPosts = async(req, res) => {
    const posts = await Post.find()
    res.status(200).json({message: "All posts", posts})
}

// get post by id controller
exports.getPostById = async(req, res) => {
    const post = await Post.findById(req.params.id)
    res.status(200).json({message: "Post by id", post})
}

// update post controller
exports.updatePost = async(req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json({message: "Post updated successfully", post})
}

// delete post controller
exports.deletePost = async(req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id)
    res.status(200).json({message: "Post deleted successfully", post})
}