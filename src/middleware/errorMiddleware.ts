import { NextFunction, Response, Request } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next : NextFunction) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode).json({
        errorMessage: err.message,
    })
}
