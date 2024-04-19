import getopts, { ParsedOptions } from "getopts";
import TerminalType = YuTerminal.TerminalType;
import { CommandOptionType, CommandType } from "./command";
import { commandMap } from "./commandRegister";
import helpCommand from "./commands/terminal/help/helpCommand";

export const doCommandExecute = async (
    text: string,
    terminal: TerminalType,
    parentCommand?: CommandType
) => {
    console.log("------",text);
    // 去除命令首尾空格
    text = text.trim();
    if (!text) {
        return;
    } 

    // 解析命令，得到命令
    const command:CommandType = getCommand(text,parentCommand);

    if(!command) {
        terminal.writeTextErrorResult("找不到命令");
        return;
    }

    // 解析参数，得到命令
    const parsedOptions = doParse(text,command.options);

    console.log("parsedOptions",parsedOptions);

    const { _ } = parsedOptions;


    // 有子命令，执行
    if(
        _.length > 0 &&
        command.subCommands &&
        Object.keys(command.subCommands).length > 0
    ) {
        const subText = text.substring(text.indexOf(" ") + 1);
        await doCommandExecute(subText,terminal,command);
        return;   
    }

    await doAction(command,parsedOptions,terminal,parentCommand);

}

/**
 * 获取命令（匹配）
 * @param text 
 * @param parentCommand 
 */
const getCommand = (text: string,parentCommand?: CommandType):CommandType => {
    let func = text.split(" ",1)[0];
    func = func.toLowerCase();
    let commands = commandMap;
    // 有父命令，则从父命令查找
    if(
        parentCommand && 
        parentCommand.subCommands &&
        Object.keys(parentCommand.subCommands).length > 0 
    ) {
        commands = parentCommand.subCommands;
    }
    const command = commands[func];
    return command;

    
}


/**
 * 解析参数
 * @param text
 * @param commandOptions
 */
const doParse = (
    text: string,
    commandOptions: CommandOptionType[]
  ): getopts.ParsedOptions => {
    // 过滤掉关键词
    const args: string[] = text.split(" ").slice(1);
    // 转换
    const options: getopts.Options = {
      alias: {},
      default: {},
      string: [],
      boolean: [],
    };
    commandOptions.forEach((commandOption) => {
      const { alias, key, type, defaultValue } = commandOption;
      if (alias && options.alias) {
        options.alias[key] = alias;
      }
      options[type]?.push(key);
      if (defaultValue && options.default) {
        options.default[key] = defaultValue;
      }
    });
    const parsedOptions = getopts(args, options);
    return parsedOptions;
  };

/**
 * 执行
 * @param command 
 * @param options 
 * @param terminal 
 * @param parentCommand 
 */
const doAction = async (
    command: CommandType,
    options: ParsedOptions,
    terminal: TerminalType,
    parentCommand?: CommandType
) => {

    const { help } = options;


    if(command.collapsible || help) {
        console.log("command",command);
        terminal.setCommandCollapsible(true);
    }
  

    if(help) {
        const newOptions = { ...options,_:[command.func] };
        helpCommand.action(newOptions,terminal,parentCommand);
        return;
    }



    await command.action(options,terminal);
}