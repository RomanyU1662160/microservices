"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = require("dotenv");
var node_fetch_1 = __importDefault(require("node-fetch"));
var interfaces_1 = require("../../interfaces/interfaces");
var mockData_1 = require("../../../Common/DB/mockData");
dotenv_1.config();
var post_ms_url = process.env.POStS_MS_URL; //5000
var comments_ms_url = process.env.COMMENTS_MS_URL; //5001
var query_ms_url = process.env.QUERY_MS_URL; //5002
var moderation_ms_url = process.env.MODERATION_MS_URL; //5003
var event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005
var router = express_1.default.Router();
router.get('/comments', function (req, res) {
    var comments = [];
    mockData_1.posts.map(function (post) {
        return post.comments.map(function (comment) { return comments.push(comment); });
    });
    res.send(comments);
});
router.post('/comments/:postId', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var postID, foundedPost, content, newComment, comments, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                postID = req.params.postId;
                foundedPost = mockData_1.posts.find(function (post) { return post.id == +postID; });
                content = req.body.content;
                newComment = {
                    postID: postID,
                    content: content,
                    status: interfaces_1.Status.PENDING,
                };
                if (!!foundedPost) return [3 /*break*/, 1];
                res.send('post not founded');
                console.log('post not founded');
                next();
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                comments = foundedPost.comments;
                newComment.id = comments.length + 1;
                comments.push(newComment);
                return [4 /*yield*/, node_fetch_1.default(event_bus_ms + "/events", {
                        method: 'POST',
                        headers: { 'Content-type': 'application/json; charset=UTF-8' },
                        body: JSON.stringify({
                            type: 'commentCreated',
                            payload: newComment,
                        }),
                    })];
            case 2:
                _a.sent();
                console.log('comment added event, raised to event-bus ');
                res.send(foundedPost);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1.message);
                res.send(error_1.message);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;