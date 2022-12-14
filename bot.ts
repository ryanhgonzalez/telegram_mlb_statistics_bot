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
    let selected_team = 0;
    user_input.toLowerCase();

    for (let key of Teams.keys()){
        if (key.toLowerCase().includes(user_input)){
            selected_team = Teams.get(key) as number;
        }
    }

    const response = await mlbStats.getTeamRoster({ pathParams: { teamId: selected_team }});
    const team_roster = response.data.roster;
    let final_output = [];
    for (const person in team_roster) {
        final_output.push(team_roster[person].jerseyNumber + " " + team_roster[person].person.fullName + " " + team_roster[person].position.abbreviation + "\n");
        final_output.push("-----------------------------\n");
        //team_roster[person].jerseyNumber
        //team_roster[person].person.fullName 
        //team_roster[person].position.abbreviation
    }
    
    ctx.reply(final_output.toString());
});

bot.start();