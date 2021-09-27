"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const node_fetch_1 = __importDefault(require("node-fetch"));
(0, dotenv_1.config)();
const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005
const router = express_1.default.Router();
const events = [];
router.post('/events', async (req, res, next) => {
    let { type, payload } = req.body;
    events.push({ type, payload });
    console.log('payload:::->>>', payload);
    switch (type) {
        case 'postCreated':
            console.log(`EVENT_BUSS is Processing EVENT : ${type}`);
            await (0, node_fetch_1.default)(`${query_ms_url}/newPost`, {
                method: 'POST',
                body: JSON.stringify({ type, payload }),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            });
            next();
            break;
        case 'commentCreated':
            let { id, postID, content, status } = payload;
            console.log('comment Created payload in event_bus :::->>>', payload);
            await (0, node_fetch_1.default)(`${query_ms_url}/newComment/${postID}`, {
                method: 'POST',
                body: JSON.stringify({ type: 'commentCreated', payload }),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            });
            await (0, node_fetch_1.default)(`${post_ms_url}/${postID}/comments/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'add_comment_to_post',
                    payload,
                }),
            });
            await (0, node_fetch_1.default)(`${moderation_ms_url}/newComment`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({ type: 'commentCreated', payload }),
            });
            next();
            break;
        case 'comment_status_updated':
            console.log('comment_status_updated received in event_bus');
            let postId = req.body.payload.postID;
            await (0, node_fetch_1.default)(`${query_ms_url}/comments/update/${postId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'update_comment_status',
                    payload,
                }),
            });
            await (0, node_fetch_1.default)(`${post_ms_url}/${postId}/comments/update/${req.body.payload.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'add_comment_to_post',
                    payload,
                }),
            });
            next();
        default:
            res.send('Break...');
    }
});
router.get('/events', (req, res, next) => {
    res.send(events).status(200);
});
exports.default = router;
