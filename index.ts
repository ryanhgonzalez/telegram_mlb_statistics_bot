import { Bot, webhookCallback } from "grammy";
import dotenv from "dotenv";
import { BotResponseConstants } from "./botResponseConstants";
import { Teams } from "./teamIdentifier";
import express from "express";

dotenv.config();

const bot = new Bot(process.env.CYCLIC_AUTH_TOKEN as string);
const MLBStatsAPI = require('mlb-stats-api');
const mlbStats = new MLBStatsAPI();

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply(BotResponseConstants.startResponse));

// Handle the /about command.
bot.command("about", (ctx) => ctx.reply(BotResponseConstants.aboutResponse));

//Handle the /team_roster command. 
bot.command("team_roster", async (ctx) => {
    const user_input = ctx.match;
    const user_input_table_matcher = user_input.toLowerCase();
    let selected_team;

    for (let key of Teams.keys()){
        if (key.includes(user_input_table_matcher)){
            selected_team = Teams.get(key) as number;
        }
    }

    let message_builder = [];
    try{
        const response = await mlbStats.getTeamRoster({ pathParams: { teamId: selected_team }});
        const team_roster = response.data.roster;
        message_builder.push(user_input.toUpperCase() + " Team Roster:");
        for (const person in team_roster) {
            message_builder.push("#" + team_roster[person].jerseyNumber + "   " + team_roster[person].position.abbreviation + "   " + team_roster[person].person.fullName);
        }
    } catch {
        message_builder.push("Team " + user_input + " not found.");
    }
    await ctx.reply(message_builder.join('\n'));
});

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