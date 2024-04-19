import { CommandType } from "./command";

import pingCommand from "./commands/pingCommand";
import dateCommand from "./commands/dateCommand";
import gotoCommand from "./commands/gotoCommand";
import helpCommand from "./commands/terminal/help/helpCommand";

/**
 * 命令列表
 */
const commandList: CommandType[] = [
    pingCommand,
    dateCommand,
    gotoCommand,
    helpCommand
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