import { Request, Response, NextFunction } from "express";
import jwt, {Secret} from 'jsonwebtoken';
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')

    if(!token) {
        return res.status(401).json({message: "Token tidak tesedia, access denied"})
    }

    try {
        
        let secret = process.env.TOKEN_SECRET
        const decoded = jwt.verify(token, <Secret>secret)

        req.user = decoded

        // successCallback()
        next()
    } catch (e) {
        return res.status(401).json({message: "Token invalid"})    
    }
}

