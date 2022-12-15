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
const grammy_1 = require("grammy");
const botResponseConstants_1 = require("./botResponseConstants");
const teamIdentifier_1 = require("./teamIdentifier");
const bot = new grammy_1.Bot(process.env.CYCLIC_AUTH_TOKEN);
const MLBStatsAPI = require('mlb-stats-api');
const mlbStats = new MLBStatsAPI();
// Handle the /start command.
bot.command("start", (ctx) => ctx.reply(botResponseConstants_1.BotResponseConstants.startResponse));
// Handle the /about command.
bot.command("about", (ctx) => ctx.reply(botResponseConstants_1.BotResponseConstants.aboutResponse));
//Handle the /team_roster command. 
bot.command("team_roster", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const user_input = ctx.match;
    const user_input_table_matcher = user_input.toLowerCase();
    let selected_team;
    for (let key of teamIdentifier_1.Teams.keys()) {
        if (key.includes(user_input_table_matcher)) {
            selected_team = teamIdentifier_1.Teams.get(key);
        }
    }
    const response = yield mlbStats.getTeamRoster({ pathParams: { teamId: selected_team } });
    const team_roster = response.data.roster;
    let message_builder = [];
    message_builder.push(user_input.toUpperCase() + " Team Roster:");
    for (const person in team_roster) {
        message_builder.push("#" + team_roster[person].jerseyNumber + "   " + team_roster[person].position.abbreviation + "   " + team_roster[person].person.fullName);
    }
    ctx.reply(message_builder.join('\n'));
}));
bot.start();
