"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPosts = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const node_fetch_1 = __importDefault(require("node-fetch"));
const interfaces_1 = require("../../interfaces/interfaces");
(0, dotenv_1.config)();
const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005
const common_db_url = process.env.COMMON_DB_URL; //5006
const router = express_1.default.Router();
let posts = [];
const fetchPosts = async () => {
    try {
        const res = await (0, node_fetch_1.default)(`${common_db_url}/posts`);
        const data = await res.json();
        posts = data;
        return posts;
    }
    catch (error) {
        console.log('error:::->>>', error);
        return posts;
    }
};
exports.fetchPosts = fetchPosts;
router.get('/comments', async (req, res) => {
    await (0, exports.fetchPosts)();
    let comments = [];
    posts.map((post) => {
        return post.comments.map((comment) => comments.push(comment));
    });
    res.send(comments);
});
router.post('/comments/:postId', async (req, res, next) => {
    await (0, exports.fetchPosts)();
    let postID = req.params.postId;
    const { content } = req.body;
    let newComment = {
        postID,
        content,
        status: interfaces_1.Status.PENDING,
    };
    let foundedPost = posts.find((post) => post.id == postID);
    if (foundedPost) {
        console.log('foundedPost:::->>>', foundedPost);
        foundedPost.comments = [
            ...foundedPost.comments,
            { newComment },
        ];
        await (0, node_fetch_1.default)(`${common_db_url}/posts/${foundedPost.id}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(foundedPost),
        });
        res.send(foundedPost);
        next();
    }
    else {
        console.log('post not founded ');
        res.send('Post not found ');
        next();
    }
    await (0, node_fetch_1.default)(`${event_bus_ms}/events`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            type: 'commentCreated',
            payload: newComment,
        }),
    });
    console.log('comment added event, raised to event-bus ');
    res.send(foundedPost);
    next();
});
exports.default = router;
