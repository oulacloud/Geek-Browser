import { Ref, ref } from "vue";
import CommandOutputType = YuTerminal.CommandOutputType;
import CommandInputType = YuTerminal.CommandInputType;


const useHistory = (
    commandList: CommandOutputType[],
    inputCommand: Ref<CommandInputType>
) => {
    const commandHistoryPos = ref(commandList.length);

    

    const listCommandHistory = () => {
        return commandList;
    }

    const showNextCommand = () => {
        if(commandHistoryPos.value <commandList.length -1) {
            commandHistoryPos.value++;
            inputCommand.value.text = commandList[commandHistoryPos.value].text;
        } else if (commandHistoryPos.value === commandList.length -1) {
            commandHistoryPos.value ++;
            inputCommand.value.text = "";
        }

    }


    const showPrevCommand = () => {
        if(commandHistoryPos.value >=1) {
            commandHistoryPos.value--;
            inputCommand.value.text = commandList[commandHistoryPos.value].text;
        }
    }

    return {
        commandHistoryPos,
        listCommandHistory,
        showNextCommand,
        showPrevCommand
    }
}


export default useHistory;