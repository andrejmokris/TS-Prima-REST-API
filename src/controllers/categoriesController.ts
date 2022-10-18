import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getCategories = expressAsyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany()
    res.status(200).json(categories)
})

const createCategory = expressAsyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400)
        throw new Error('Category name not provided!')
    }
    const exist = await prisma.category.findFirst({
        where: {
            name: req.body.name
        }
    })
    if (exist) {
        res.status(400)
        throw new Error('Category already exists!')
    }
    const category = await prisma.category.create({
        data: {
            name: req.body.name
        }
    })
    if (category) {
        res.status(201).json(category)
    } else {
        res.status(400)
        throw new Error("Creation failed")
    }
})


module.exports = { 
    getCategories,
    createCategory
}