"use strict";
exports.__esModule = true;
exports.checkIfExist = void 0;
var mockData_1 = require("../../Common/DB/mockData");
var checkIfExist = function (req, res, next) {
    var title = req.body.title;
    console.log('title', title);
    var filtered = mockData_1.posts.filter(function (P) { return P.title === title; });
    console.log('filtered:::->>>', filtered);
    if (filtered.length > 0) {
        return res.send('Post already exist');
    }
    next();
};
exports.checkIfExist = checkIfExist;
