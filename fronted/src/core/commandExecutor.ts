import TerminalType = YuTerminal.TerminalType;
import { CommandOptionType, CommandType } from "./command";

export const doCommandExecute = async (
    text: string,
    terminal: TerminalType,
    parentCommand?: CommandType
) => {
    // 去除命令首尾空格
    text = text.trim();
    if(!text) {
        return;
    }

    // 解析命令，得到命令
    const command = text;
    console.log("command",command);
}