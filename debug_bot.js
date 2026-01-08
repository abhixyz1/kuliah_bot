require("dotenv").config();
const config = require("./src/config/config");

console.log("--- DEBUG START ---");
console.log("Current Directory:", process.cwd());
console.log("Token exists:", !!process.env.TELEGRAM_BOT_TOKEN);
console.log("Token length:", process.env.TELEGRAM_BOT_TOKEN ? process.env.TELEGRAM_BOT_TOKEN.length : 0);
console.log("Config Token exists:", !!config.telegramToken);

try {
    require("./src/services/journalService");
    console.log("Service: Journal loaded");
    require("./src/services/materialService");
    console.log("Service: Material loaded");
    require("./src/commands/start");
    console.log("Command: Start loaded");
    require("./src/commands/help");
    console.log("Command: Help loaded");
    require("./src/commands/journal");
    console.log("Command: Journal loaded");
    require("./src/commands/material");
    console.log("Command: Material loaded");
    require("./src/commands/video");
    console.log("Command: Video loaded");
} catch (e) {
    console.error("Module loading error:", e);
}

console.log("--- DEBUG END ---");
