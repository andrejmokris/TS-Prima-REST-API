import express from 'express';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

const {
    getPosts,
    getPost,
    deletePost,
    createPost,
    getPostsbyCategoryName,
    getPostsbyCategoryID
} = require('../controllers/postController');

router.route('/').get(protect, getPosts).post(protect, createPost)
router.route('/:id').get(protect, getPost).delete(protect, deletePost)
router.route('/category').get(getPostsbyCategoryName)
router.route('/category/:id').get(getPostsbyCategoryID)

module.exports = router