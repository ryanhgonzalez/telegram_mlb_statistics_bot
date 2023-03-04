import { Bot, webhookCallback } from "grammy";
import { Teams } from "../identifiers/teamIdentifiers";

const MLBStatsAPI = require('mlb-stats-api');
const mlbStats = new MLBStatsAPI();

//Handle the /get_team command.
export function getTeam(bot: Bot) {
    bot.command("get_team", async (ctx) => {
        const userInput = ctx.match;
        const userInputToLower = userInput.toLowerCase();
        let selectedTeam;
        let messageBuilder = [];

        for (let key of Teams.keys()){
            if (key.toLowerCase() === userInputToLower){
                selectedTeam = Teams.get(key) as number;
            }
        }

        try {
            const response = await mlbStats.getTeam({ pathParams: { teamId: selectedTeam }});
            const teamInformation = response.data.teams;
            messageBuilder.push("Team Information:");
            for (const team in teamInformation) {
                messageBuilder.push(
                    teamInformation[team].locationName + " " + teamInformation[team].teamName + "\n" +
                    "Spring League: " + teamInformation[team].springLeague.name + "\n" +
                    "Venue: " + teamInformation[team].venue.name + "\n" +
                    "First Year Of Play: " + teamInformation[team].firstYearOfPlay + "\n" +
                    "League: " + teamInformation[team].league.name + "\n" +
                    "Division: " + teamInformation[team].division.name + "\n"
                );
            }
        } catch (e) {
            messageBuilder.push(e);
        }
        await ctx.reply(messageBuilder.join('\n'));
    });
}

//Handle the /get_team_coaches command. 
export function getTeamCoaches(bot: Bot) {
    bot.command("get_team_coaches", async (ctx) => {
        const userInput = ctx.match;
        const userInputToLower = userInput.toLowerCase();
        let selectedTeam;
        let messageBuilder = [];

        for (let key of Teams.keys()){
            if (key.toLowerCase() === userInputToLower){
                selectedTeam = Teams.get(key) as number;
            }
        }

        try {
            const response = await mlbStats.getTeamCoaches({ pathParams: { teamId: selectedTeam }});
            const teamRoster = response.data.roster;
            messageBuilder.push(userInput + " Team Coaches Roster:");
            for (const person in teamRoster) {
                messageBuilder.push(
                    "#" +
                    teamRoster[person].jerseyNumber +
                    "   " +
                    teamRoster[person].job +
                    "   " +
                    teamRoster[person].person.fullName
                );
            }
        } catch (e) {
            messageBuilder.push(e);
        }
        await ctx.reply(messageBuilder.join('\n'));
    });
}

//Handle the /get_team_roster command. 
export function getTeamRoster(bot: Bot) {
    bot.command("get_team_roster", async (ctx) => {
        const userInput = ctx.match;
        const userInputToLower = userInput.toLowerCase();
        let selectedTeam;
        let messageBuilder = [];

        for (let key of Teams.keys()){
            if (key.toLowerCase() === userInputToLower){
                selectedTeam = Teams.get(key) as number;
            }
        }

        try {
            const response = await mlbStats.getTeamRoster({ pathParams: { teamId: selectedTeam }});
            const teamRoster = response.data.roster;
            messageBuilder.push(userInput + " Team Roster:");
            for (const person in teamRoster) {
                messageBuilder.push(
                    "#" +
                    teamRoster[person].jerseyNumber +
                    "   " +
                    teamRoster[person].position.abbreviation +
                    "   " +
                    teamRoster[person].person.fullName
                );
            }
        } catch (e) {
            messageBuilder.push(e);
        }
        await ctx.reply(messageBuilder.join('\n'));
    });
}