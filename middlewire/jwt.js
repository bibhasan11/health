const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    // const counter = 
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Access denied. No JWT provided.');
    }
    try {
        res.send({message:"Already logged in"});
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid JWT.');
    }
}