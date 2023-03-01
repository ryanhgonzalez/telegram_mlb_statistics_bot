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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const dotenv_1 = __importDefault(require("dotenv"));
const botResponseConstants_1 = require("./botResponseConstants");
const teamIdentifier_1 = require("./teamIdentifier");
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
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
// Start the server
if (process.env.NODE_ENV === "production") {
    // Use Webhooks for the production server
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, grammy_1.webhookCallback)(bot, "express"));
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Bot listening on port ${PORT}`);
    });
}
else {
    // Use Long Polling for development
    bot.start();
}
