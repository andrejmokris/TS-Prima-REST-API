import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const userRegister = expressAsyncHandler(async (req, res) => {
    const { email, name, password } = req.body
    if (!email || !name || !password) {
        res.status(400)
        throw new Error('Credentials not provided')
    }
    if(password.length < 8) {
        res.status(400)
        throw new Error('Password has to be at least 8 characters long!')
    }

    const userExists = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword
        }
    })

    if (newUser) {
        res.status(201).json({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

const userLogin = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error('Credentials not provided')
    }

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            token: generateToken(user.id),
            _id: user.id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials')
    }
})

// https://stackoverflow.com/questions/71489497/how-to-query-update-a-self-relation-in-prisma
const userFollow = expressAsyncHandler(async (req, res) => {
    if(!req.params.id) {
        res.status(400)
        throw new Error('ID not provided')
    }
    const user = await prisma.follows.create({
        data: {
            followerId: Number(req.user),
            followingId: Number(req.params.id)
        }
    })
    res.status(200).json(user)
})

const generateToken = (id : Number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string)
}

module.exports = {
    userLogin,
    userRegister,
    userFollow
}
