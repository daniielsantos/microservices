import * as jwt from 'jsonwebtoken';

export async function isAuthenticated(req, res, next) {
    try {
        var token = req.headers.authorization.split(' ')[1];
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!token) {
        return res.status(401).json({
            message: 'Error: No token provided.'
        });
    }

    try {
        const user = jwt.verify(token, process.env.SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({
            message: 'Error: Failed to authenticate token.'
        });
    }
}
