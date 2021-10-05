"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPosts = exports.Status = void 0;
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = require("dotenv");
dotenv_1.config();
var Status;
(function (Status) {
    Status["APPROVED"] = "approved";
    Status["PENDING"] = "pending";
    Status["REJECTED"] = "rejected";
})(Status = exports.Status || (exports.Status = {}));
const router = express_1.default.Router();
const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005
const common_db_url = process.env.COMMON_DB_URL; //5006
let posts = [];
const fetchPosts = async () => {
    try {
        const res = await node_fetch_1.default(`${common_db_url}/posts`);
        const data = await res.json();
        console.log('data from json-server:::->>>', data);
        posts = data;
    }
    catch (error) {
        console.log('error:::->>>', error);
    }
};
exports.fetchPosts = fetchPosts;
router.get('/posts', async (req, res) => {
    await exports.fetchPosts();
    console.log('posts from json server :::->>>', posts);
    res.status(200).send(posts);
});
router.post('/posts', async (req, res, next) => {
    const { title } = req.body;
    const newPost = { id: posts.length + 1, title, comments: [] };
    try {
        await node_fetch_1.default(`${common_db_url}/posts`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(newPost),
        });
        await node_fetch_1.default(`${event_bus_ms}/events`, {
            method: 'POST',
            body: JSON.stringify({ type: 'postCreated', payload: newPost }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        await exports.fetchPosts();
        res.send(posts).status(200);
        next();
    }
    catch (error) {
        res.send(error);
        console.log('error:::->>>', error);
    }
});
router.post('/:postId/comments/new', async (req, res, next) => {
    await exports.fetchPosts();
    const { content, status } = req.body;
    const newComment = { content, status };
    console.log('payload:::->>>', newComment);
    let postId = req.params.postId;
    let foundedPost = posts.find((post) => post.id == +postId);
    if (foundedPost) {
        console.log('foundedPost:::->>>', foundedPost);
        foundedPost.comments = [
            ...foundedPost.comments,
            { newComment },
        ];
        console.log('updatedComments:::->>>', foundedPost.comments);
        await node_fetch_1.default(`${common_db_url}/posts/${foundedPost.id}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(foundedPost),
        });
        res.send(foundedPost);
        next();
    }
    else {
        console.log('post not founded ');
    }
});
router.post('/:postId/comments/update/:commentId', async (req, res, next) => {
    await exports.fetchPosts();
    let { postId, commentId } = req.params;
    let { payload } = req.body;
    let foundedPost = posts.find((post) => post.id == +postId);
    if (!foundedPost) {
        console.log('post not found');
        res.send('post not found');
        next();
    }
    else {
        foundedPost.comments.map((comment) => {
            if (comment.id == +commentId) {
                comment.status = payload.status;
                return comment;
            }
            else {
                console.log('comment not found ');
            }
        });
        res.send(foundedPost);
    }
});
exports.default = router;
