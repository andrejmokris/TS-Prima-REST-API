import express from 'express';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

const {
    userLogin,
    userRegister,
    userFollow
} = require('../controllers/userController');

router.route('/login').post(userLogin)
router.route('/register').post(userRegister)
router.route('/follow/:id').post(protect, userFollow)

module.exports = router