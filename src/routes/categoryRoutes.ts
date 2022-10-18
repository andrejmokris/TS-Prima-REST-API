import express from 'express';

const router = express.Router();

const {
    getCategories,
    createCategory
} = require('../controllers/categoriesController');

router.route('/').get(getCategories).post(createCategory)

module.exports = router