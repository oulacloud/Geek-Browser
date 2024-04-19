import { CommandType } from "../../../command";
import { defineAsyncComponent } from "vue";
import ComponentOutputType = YuTerminal.ComponentOutputType;

const infoCommand: CommandType = {
    func: "info",
    name: "查看本站信息",
    alias: ["author","about"],
    options: [],
    action(options,terminal) {
        const output: ComponentOutputType = {
            type: "component",
            component: defineAsyncComponent(() => import("./infoBox.vue"))
        };
        terminal.writeResult(output);
    }
}

export default infoCommand;