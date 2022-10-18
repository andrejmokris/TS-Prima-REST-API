import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getPosts = expressAsyncHandler(async (req, res) => {
    const posts = await prisma.post.findMany({
        where: {
            authorId: Number(req.user)
        },
        orderBy: {
            createdAt: 'desc',
        },
    })
    res.status(200).json(posts)
})

const getPost = expressAsyncHandler(async (req, res) => {
    const post = await prisma.post.findFirst({
        where: {
            id: Number(req.params.id)
        }
    })
    if(post) {
        res.json(post)
    } else {
        res.status(400)
        throw new Error('Post not found')
    }
})

const createPost = expressAsyncHandler(async (req, res) => {
    if (!req.body.title) {
        res.status(400)
        throw new Error('Please add title')
    }
    const categories : number[] = req.body.category ? req.body.category : [];
    const allNumbers : boolean = categories.length === 0 || categories.every(function(element) {return typeof element === 'number';});
    if (!allNumbers) {
        res.status(400);
        throw new Error('Wrong data types')
    } 
    const post = await prisma.post.create({
        data: {
            title: req.body.title,
            published: true,
            authorId: Number(req.user),
            categories: {
                create: categories.map((categoryID) => ({
                    category: {
                        connect: {
                            id: categoryID
                        }
                    }
                }))
            }
        }
    })
    if (post) {
        res.status(200).json(post)
    } else {
        res.status(400)
        throw new Error('Creation failed')
    }
    
})

const deletePost = expressAsyncHandler(async (req, res) => {
    const post = await prisma.post.findUnique({
        where: {
            id: Number(req.params.id)
        }
    })
    if (!post) {
        res.status(400)
        throw new Error('Post not found')
    }
    await prisma.post.delete({
        where: {
            id: Number(req.params.id)
        }
    })
    res.status(200).json({ id: Number(req.params.id) })
})

const getPostsbyCategoryName = expressAsyncHandler(async (req, res) =>{
    if (!req.body.category) {
        res.status(400)
        throw new Error('No category name provided')
    }
    const posts = await prisma.post.findMany({
        where: {
            categories: {
                some: {
                    category: {
                        name: req.body.category,
                    }
                }
            }
        }
    })
    res.status(200).json(posts)
})

const getPostsbyCategoryID = expressAsyncHandler(async (req, res) =>{
    if (!req.params.id) {
        res.status(400)
        throw new Error('No category ID provided')
    }
    const posts = await prisma.post.findMany({
        where: {
            categories: {
                some: {
                    category: {
                        id: Number(req.params.id),
                    }
                }
            }
        }
    })
    res.status(200).json(posts)
})

module.exports = { 
    getPosts,
    getPost,
    createPost,
    deletePost,
    getPostsbyCategoryName,
    getPostsbyCategoryID
}