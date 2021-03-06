"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const moderation_1 = __importDefault(require("./routes/api/moderation"));
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.config)();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(), () => [console.log('APP is using cors ')]);
app.use('/api', moderation_1.default);
console.log('APP is using cors ');
app.listen(port, () => {
    console.log('version:::->>> 0.0.2');
    console.log(`${process.env.APP_NAME} application is running on port ${port}`);
});
