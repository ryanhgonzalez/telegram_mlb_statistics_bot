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
exports.getTeamRoster = void 0;
const teamIdentifiers_1 = require("../identifiers/teamIdentifiers");
const MLBStatsAPI = require('mlb-stats-api');
const mlbStats = new MLBStatsAPI();
//Handle the /get_team_roster command. 
function getTeamRoster(bot) {
    bot.command("get_team_roster", (ctx) => __awaiter(this, void 0, void 0, function* () {
        const user_input = ctx.match;
        const user_input_table_matcher = user_input.toLowerCase();
        let selected_team;
        for (let key of teamIdentifiers_1.Teams.keys()) {
            if (key.includes(user_input_table_matcher)) {
                selected_team = teamIdentifiers_1.Teams.get(key);
            }
        }
        let message_builder = [];
        try {
            const response = yield mlbStats.getTeamRoster({ pathParams: { teamId: selected_team } });
            const team_roster = response.data.roster;
            message_builder.push(user_input.toUpperCase() + " Team Roster:");
            for (const person in team_roster) {
                message_builder.push("#" + team_roster[person].jerseyNumber + "   " + team_roster[person].position.abbreviation + "   " + team_roster[person].person.fullName);
            }
        }
        catch (_a) {
            message_builder.push("Team " + user_input + " not found.");
        }
        yield ctx.reply(message_builder.join('\n'));
    }));
}
exports.getTeamRoster = getTeamRoster;
