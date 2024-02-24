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

// export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//       const token = req.headers.authorization?.split(' ')[1];
//       console.log("cek Token", token)
//     // const token = req.header('Authorization')


//     if(!token) {
//         return res.status(401).json({message: "Token tidak tesedia, access denied"})
//     }

//     try {
        
//         let secret = process.env.TOKEN_SECRET
//         jwt.verify(token, <Secret>secret, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'Token tidak valid' });
//         }
//         req.body = decoded;
//         next();
//     });
//     } catch (e) {
//         return res.status(401).json({message: "Token invalid"})    
//     }
// }

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    console.log("Header Authorization:", authorizationHeader);


    if (!authorizationHeader) {
        return res.status(401).json({ message: "Header Authorization tidak tersedia, akses ditolak" });
    }

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: "Format token tidak valid, akses ditolak" });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
        req.body = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token kedaluwarsa, akses ditolak" });
        }
        return res.status(401).json({ message: "Token tidak valid, akses ditolak" });
    }
};