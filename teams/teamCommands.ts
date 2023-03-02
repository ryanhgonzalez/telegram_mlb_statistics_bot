import { Bot, webhookCallback } from "grammy";
import { Teams } from "../identifiers/teamIdentifiers";

const MLBStatsAPI = require('mlb-stats-api');
const mlbStats = new MLBStatsAPI();

//Handle the /get_team_roster command. 
export function getTeamRoster(bot: Bot) {
    bot.command("get_team_roster", async (ctx) => {
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
}