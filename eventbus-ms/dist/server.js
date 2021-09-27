"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const event_bus_1 = __importDefault(require("./routes/api/event-bus"));
(0, dotenv_1.config)();
const port = process.env.PORT || 5005;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', event_bus_1.default);
app.listen(port, () => {
    console.log(`${process.env.APP_NAME}  application is running on port ${port}`);
});