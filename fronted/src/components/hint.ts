import { ref } from 'vue';
import { getUsageStr } from '../core/commands/terminal/help/helpUtil';
import { commandMap } from '../core/commandRegister';
import _, { trim } from 'lodash';
import { useTerminalConfigStore } from "../core/commands/terminal/config/terminalConfigStore";

/**
 * 命令提示功能
 */
const useHint = () => {
    const hint = ref("");
    const { showHint } = useTerminalConfigStore();

    const setHint = (inputText: string) => {
        if (!showHint) {
            return;
        }
        if (!inputText) {
            hint.value = "";
            return;
        }

        const args = trim(inputText).split(" ");

        let func = args[0].toLowerCase();

        // 前缀匹配
        const likeKey = Object.keys(commandMap).filter((key) =>
            key.startsWith(func)
        )[0];

        let command = commandMap[likeKey];
        if (!command) {
            hint.value = "";
            return;
        }
        // 子命令提示
        if (
            command.subCommands &&
            Object.keys(command.subCommands) &&
            args.length > 1
        ) {
            hint.value = getUsageStr(command.subCommands[args[1]], command);
        } else {
            hint.value = getUsageStr(command);
        }
    }


    const debounceSetHint = _.debounce(function (inputText: string) {
        setHint(inputText);
    }, 500);

    return {
        hint,
        setHint,
        debounceSetHint
    }

}


export default useHint;