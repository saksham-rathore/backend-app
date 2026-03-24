const express = require("express");
const router = express.Router();
const multer = require("multer");
const postController = require("../controllers/post.controller");
const auth = require("../middleware/multer.middleware");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", auth, upload.single("image"), postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", auth, upload.single("image"), postController.updatePost);
router.delete("/:id", auth, postController.deletePost);

module.exports = router;
