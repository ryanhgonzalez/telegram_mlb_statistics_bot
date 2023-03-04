"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAboutCommand = exports.getStartCommand = void 0;
const botConstants_1 = require("../constants/botConstants");
// Handle the /start command.
function getStartCommand(bot) {
    bot.command("start", (ctx) => ctx.reply(botConstants_1.BotConstants.startResponse));
}
exports.getStartCommand = getStartCommand;
// Handle the /about command.
function getAboutCommand(bot) {
    bot.command("about", (ctx) => ctx.reply(botConstants_1.BotConstants.aboutResponse));
}
exports.getAboutCommand = getAboutCommand;
