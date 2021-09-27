"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfExist = void 0;
const mockData_1 = require("../../Common/DB/mockData");
const checkIfExist = (req, res, next) => {
    const { title } = req.body;
    console.log('title', title);
    let filtered = mockData_1.posts.filter((P) => P.title === title);
    console.log('filtered:::->>>', filtered);
    if (filtered.length > 0) {
        return res.send('Post already exist');
    }
    next();
};
exports.checkIfExist = checkIfExist;
