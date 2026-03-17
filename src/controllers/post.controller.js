const Post = require("../models/post.model");
const User = require("../models/user.model");

// create post controller
exports.createPost = async(req, res) => {
    try {
        const {title, content} = req.body;
        
        // Handle image from either request body or multer file
        let image = req.body.image;
        if (req.file) {
            image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        }
        
        if (!image) {
            return res.status(400).json({message: "Image is required"});
        }

        const post = await Post.create({title, content, image, user: req.user.id});
        res.status(201).json({message: "Post created successfully", post});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}

// get all posts controller
exports.getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find().populate("user", "username email");
        res.status(200).json({message: "All posts", posts});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}

// get post by id controller
exports.getPostById = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("user", "username email");
        if (!post) return res.status(404).json({message: "Post not found"});
        res.status(200).json({message: "Post by id", post});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}

// update post controller
exports.updatePost = async(req, res) => {
    try {
        // Handle updated image if sent
        let updateData = { ...req.body };
        if (req.file) {
            updateData.image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        }

        const post = await Post.findByIdAndUpdate(req.params.id, updateData, {new: true});
        if (!post) return res.status(404).json({message: "Post not found"});
        res.status(200).json({message: "Post updated successfully", post});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}

// delete post controller
exports.deletePost = async(req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({message: "Post not found"});
        res.status(200).json({message: "Post deleted successfully", post});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}