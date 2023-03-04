import { Bot, webhookCallback } from "grammy";
import { BotConstants } from "../constants/botConstants";

// Handle the /start command.
export function getStartCommand(bot: Bot) {
    bot.command("start", (ctx) => ctx.reply(BotConstants.startResponse));
}

// Handle the /about command.
export function getAboutCommand(bot: Bot) {
    bot.command("about", (ctx) => ctx.reply(BotConstants.aboutResponse));
}