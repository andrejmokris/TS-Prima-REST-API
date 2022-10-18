import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const protect = expressAsyncHandler(async (req : Request, res : Response, next : NextFunction) => {
    let token;

    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const { id } = jwt.verify(token, process.env.JWT_Secret as string) as jwt.JwtPayload
            req.user = id
            next()
        } catch (error) {
            res.status(401)
            throw new Error('Not authorized')
        }
    } else {
        res.status(400)
        throw new Error('Not token')
    }
})