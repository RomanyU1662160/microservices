"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const interfaces_1 = require("../../../Common/interfaces");
const node_fetch_1 = __importDefault(require("node-fetch"));
(0, dotenv_1.config)();
const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005
let postsQuery = [];
let commentQuery = [];
function filterResult(target, rule) {
    return target.includes(rule) ? false : true;
}
const router = express_1.default.Router();
router.post('/newComment', async (req, res, next) => {
    let { payload } = req.body;
    console.log('payload in moderation :::->>>', payload);
    console.log('moderation/newComment endpoint called   ');
    const isOkay = filterResult(payload.content, 'orange');
    isOkay
        ? (payload.status = interfaces_1.Status.APPROVED)
        : (payload.status = interfaces_1.Status.REJECTED);
    console.log('Updated moderated status (payload):::->>>', payload);
    await (0, node_fetch_1.default)(`${event_bus_ms}/events`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ type: 'comment_status_updated', payload }),
    });
    next();
});
exports.default = router;
