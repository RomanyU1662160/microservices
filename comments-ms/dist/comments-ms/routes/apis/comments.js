"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const node_fetch_1 = __importDefault(require("node-fetch"));
const interfaces_1 = require("../../interfaces/interfaces");
const mockData_1 = require("../../../Common/DB/mockData");
(0, dotenv_1.config)();
const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005
const router = express_1.default.Router();
router.get('/comments', (req, res) => {
    let comments = [];
    mockData_1.posts.map((post) => {
        return post.comments.map((comment) => comments.push(comment));
    });
    res.send(comments);
});
router.post('/comments/:postId', async (req, res, next) => {
    // let id = comments.length + 1;
    let postID = req.params.postId;
    let foundedPost = mockData_1.posts.find((post) => post.id == +postID);
    let { content } = req.body;
    let newComment = {
        postID,
        content,
        status: interfaces_1.Status.PENDING,
    };
    if (!foundedPost) {
        res.send('post not founded');
        console.log('post not founded');
        next();
    }
    else {
        try {
            let comments = foundedPost.comments;
            newComment.id = comments.length + 1;
            comments.push(newComment);
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
        }
        catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }
});
exports.default = router;
