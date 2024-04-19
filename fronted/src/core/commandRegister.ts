import { CommandType } from "./command";

import pingCommand from "./commands/pingCommand";
import dateCommand from "./commands/dateCommand";
import gotoCommand from "./commands/gotoCommand";
import helpCommand from "./commands/terminal/help/helpCommand";
import infoCommand from "./commands/terminal/info/infoCommand";
import shortcutCommand from "./commands/terminal/shortcut/shortcutCommand";
import clearCommand from "./commands/terminal/clearCommand";
import historyCommand from "./commands/terminal/historyCommand";

/**
 * 命令列表
 */
const commandList: CommandType[] = [
    pingCommand,
    dateCommand,
    gotoCommand,
    helpCommand,
    infoCommand,
    shortcutCommand,
    clearCommand,
    historyCommand
];

/**
 * 命令字典
 */
const commandMap: Record<string,CommandType> = {};

commandList.forEach((command) => {
    commandMap[command.func] = command;
    command.alias?.forEach((name) => {
        commandMap[name] = command;
    });
});

export { commandMap, commandList }