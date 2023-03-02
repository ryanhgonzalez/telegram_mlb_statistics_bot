import { Bot, webhookCallback } from "grammy";
import dotenv from "dotenv";
import { BotConstants } from "./constants/botConstants";
import express from "express";
import { getTeamRoster } from "./teams/teamCommands";

dotenv.config();

const bot = new Bot(process.env.CYCLIC_AUTH_TOKEN as string);

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply(BotConstants.startResponse));

// Handle the /about command.
bot.command("about", (ctx) => ctx.reply(BotConstants.aboutResponse));

getTeamRoster(bot);

// Start the server
if (process.env.NODE_ENV === "production") {
    // Use Webhooks for the production server
    const app = express();
    app.use(express.json());
    app.use(webhookCallback(bot, "express"));
  
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Bot listening on port ${PORT}`);
    });
  } else {
    // Use Long Polling for development
    bot.start();
  }