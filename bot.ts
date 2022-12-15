import { Bot } from "grammy";
import { BotResponseConstants } from "./botResponseConstants";
import { UserToken } from "./userToken";
import { Teams } from "./teamIdentifier";

const bot = new Bot(UserToken.token);
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

    const response = await mlbStats.getTeamRoster({ pathParams: { teamId: selected_team }});

    const team_roster = response.data.roster;
    let message_builder = [];
    message_builder.push(user_input.toUpperCase() + " Team Roster:");
    for (const person in team_roster) {
        message_builder.push("#" + team_roster[person].jerseyNumber + "   " + team_roster[person].position.abbreviation + "   " + team_roster[person].person.fullName);
    }
    
    ctx.reply(message_builder.join('\n'));
});

bot.start();