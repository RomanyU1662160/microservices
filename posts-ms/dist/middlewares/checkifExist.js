"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfExist = void 0;
const posts_1 = require("./../routes/apis/posts");
let posts = [];
const checkIfExist = async (req, res, next) => {
    const { title } = req.body;
    await posts_1.fetchPosts();
    let filtered = posts.filter((P) => P.title === title);
    console.log('filtered:::->>>', filtered);
    if (filtered.length > 0) {
        return res.send('Post already exist');
    }
    next();
};
exports.checkIfExist = checkIfExist;
