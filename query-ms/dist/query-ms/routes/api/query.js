"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const mockData_1 = require("../../../Common/DB/mockData");
dotenv_1.config();
const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_URL; //5005
const router = express_1.default.Router();
router.post('/newPost', (req, res, next) => {
    console.log('/query-ms/newPost endpoint called');
    let { type, payload } = req.body;
    console.log('payload in the query-ms:::->>>', payload);
    let { id, title, comments } = req.body.payload;
    mockData_1.queryData.push({ postId: id, title, comments });
    console.log('queryData:::->>>', mockData_1.queryData);
    console.log('new post added into the query_ms');
    next();
});
router.post('/newComment/:postId', (req, res, next) => {
    let { type, payload } = req.body;
    let { postID, content, status } = payload;
    let post = mockData_1.queryData.find((post) => post.postId == postID);
    if (post) {
        post.comments.push(payload);
        console.log('comment added to post', content);
        console.log(post);
        next();
    }
    else {
        console.log('post not found');
        next();
    }
});
router.post('/comments/update/:postId', (req, res, next) => {
    let postId = req.params.postId;
    console.log('postId:::->>>', postId);
    let { payload } = req.body;
    console.log('payload in query-ms:::->>>', payload);
    let post = mockData_1.queryData.find((post) => post.postId == postId);
    if (post) {
        let foundedComment = post.comments.filter((comment) => {
            return (comment.postID = req.params.postId);
        })[0];
        if (foundedComment) {
            foundedComment = payload;
            console.log('foundedComment:::->>>', foundedComment);
            next();
        }
        else {
            console.log('comment not founded');
            next();
        }
    }
    else {
        console.log('post not founded dddd ');
        next();
    }
});
exports.default = router;
