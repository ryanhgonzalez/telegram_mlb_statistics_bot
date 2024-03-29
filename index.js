"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const teamCommands_1 = require("./teams/teamCommands");
const genericCommands_1 = require("./generic/genericCommands");
dotenv_1.default.config();
const bot = new grammy_1.Bot(process.env.CYCLIC_AUTH_TOKEN);
(0, genericCommands_1.getStartCommand)(bot);
(0, genericCommands_1.getAboutCommand)(bot);
(0, teamCommands_1.getTeam)(bot);
(0, teamCommands_1.getTeamCoaches)(bot);
(0, teamCommands_1.getTeamRoster)(bot);
// Start the server
if (process.env.NODE_ENV === "production") {
    // Use Webhooks for the production server
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, grammy_1.webhookCallback)(bot, "express"));
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Bot listening on port ${PORT}`);
    });
}
else {
    // Use Long Polling for development
    bot.start();
}
