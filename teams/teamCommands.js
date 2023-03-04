"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamRoster = exports.getTeamCoaches = exports.getTeam = void 0;
const teamIdentifiers_1 = require("../identifiers/teamIdentifiers");
const MLBStatsAPI = require('mlb-stats-api');
const mlbStats = new MLBStatsAPI();
//Handle the /get_team command.
function getTeam(bot) {
    bot.command("get_team", (ctx) => __awaiter(this, void 0, void 0, function* () {
        const userInput = ctx.match;
        const userInputToLower = userInput.toLowerCase();
        let selectedTeam;
        let messageBuilder = [];
        for (let key of teamIdentifiers_1.Teams.keys()) {
            if (key.toLowerCase() === userInputToLower) {
                selectedTeam = teamIdentifiers_1.Teams.get(key);
            }
        }
        try {
            const response = yield mlbStats.getTeam({ pathParams: { teamId: selectedTeam } });
            const teamInformation = response.data.teams;
            messageBuilder.push("Team Information:");
            for (const team in teamInformation) {
                messageBuilder.push(teamInformation[team].locationName + " " + teamInformation[team].teamName + "\n" +
                    "Spring League: " + teamInformation[team].springLeague.name + "\n" +
                    "Venue: " + teamInformation[team].venue.name + "\n" +
                    "First Year Of Play: " + teamInformation[team].firstYearOfPlay + "\n" +
                    "League: " + teamInformation[team].league.name + "\n" +
                    "Division: " + teamInformation[team].division.name + "\n");
            }
        }
        catch (e) {
            messageBuilder.push(e);
        }
        yield ctx.reply(messageBuilder.join('\n'));
    }));
}
exports.getTeam = getTeam;
//Handle the /get_team_coaches command. 
function getTeamCoaches(bot) {
    bot.command("get_team_coaches", (ctx) => __awaiter(this, void 0, void 0, function* () {
        const userInput = ctx.match;
        const userInputToLower = userInput.toLowerCase();
        let selectedTeam;
        let messageBuilder = [];
        for (let key of teamIdentifiers_1.Teams.keys()) {
            if (key.toLowerCase() === userInputToLower) {
                selectedTeam = teamIdentifiers_1.Teams.get(key);
            }
        }
        try {
            const response = yield mlbStats.getTeamCoaches({ pathParams: { teamId: selectedTeam } });
            const teamRoster = response.data.roster;
            messageBuilder.push(userInput + " Team Coaches Roster:");
            for (const person in teamRoster) {
                messageBuilder.push("#" +
                    teamRoster[person].jerseyNumber +
                    "   " +
                    teamRoster[person].job +
                    "   " +
                    teamRoster[person].person.fullName);
            }
        }
        catch (e) {
            messageBuilder.push(e);
        }
        yield ctx.reply(messageBuilder.join('\n'));
    }));
}
exports.getTeamCoaches = getTeamCoaches;
//Handle the /get_team_roster command. 
function getTeamRoster(bot) {
    bot.command("get_team_roster", (ctx) => __awaiter(this, void 0, void 0, function* () {
        const userInput = ctx.match;
        const userInputToLower = userInput.toLowerCase();
        let selectedTeam;
        let messageBuilder = [];
        for (let key of teamIdentifiers_1.Teams.keys()) {
            if (key.toLowerCase() === userInputToLower) {
                selectedTeam = teamIdentifiers_1.Teams.get(key);
            }
        }
        try {
            const response = yield mlbStats.getTeamRoster({ pathParams: { teamId: selectedTeam } });
            const teamRoster = response.data.roster;
            messageBuilder.push(userInput + " Team Roster:");
            for (const person in teamRoster) {
                messageBuilder.push("#" +
                    teamRoster[person].jerseyNumber +
                    "   " +
                    teamRoster[person].position.abbreviation +
                    "   " +
                    teamRoster[person].person.fullName);
            }
        }
        catch (e) {
            messageBuilder.push(e);
        }
        yield ctx.reply(messageBuilder.join('\n'));
    }));
}
exports.getTeamRoster = getTeamRoster;
