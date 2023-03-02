"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const dotenv_1 = __importDefault(require("dotenv"));
const botConstants_1 = require("./constants/botConstants");
const express_1 = __importDefault(require("express"));
const teamCommands_1 = require("./teams/teamCommands");
dotenv_1.default.config();
const bot = new grammy_1.Bot(process.env.CYCLIC_AUTH_TOKEN);
// Handle the /start command.
bot.command("start", (ctx) => ctx.reply(botConstants_1.BotConstants.startResponse));
// Handle the /about command.
bot.command("about", (ctx) => ctx.reply(botConstants_1.BotConstants.aboutResponse));
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
