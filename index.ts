import { Bot, webhookCallback } from "grammy";
import dotenv from "dotenv";
import express from "express";
import { getTeam, getTeamCoaches, getTeamRoster } from "./teams/teamCommands";
import { getStartCommand, getAboutCommand } from "./generic/genericCommands";

dotenv.config();

const bot = new Bot(process.env.CYCLIC_AUTH_TOKEN as string);
getStartCommand(bot);
getAboutCommand(bot);
getTeam(bot);
getTeamCoaches(bot);
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