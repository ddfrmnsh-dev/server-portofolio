import { Request, Response, NextFunction } from "express";
import jwt, {Secret} from 'jsonwebtoken';
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // const token = req.header('Authorization')
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({message: "Token tidak tesedia, access denied"})
    }

    try {
        
        let secret = process.env.TOKEN_SECRET
        jwt.verify(token, <Secret>secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token tidak valid' });
        }
        next();
    });
    } catch (e) {
        return res.status(401).json({message: "Token invalid"})    
    }
}

