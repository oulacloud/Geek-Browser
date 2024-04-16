<template>
    <div class="yu-terminal-wrapper" @click="handleClickWrapper" :style="wrapperStyle">
        
        <div ref="terminalRef" class="yu-terminal" :style="mainStyle">
            <a-collapse v-model:activeKeys="activeKeys" :bordered="false" expand-icon-position="right">
                <template v-for="(output, index) in outputList" :key="index"> 
                    <!-- 折叠 -->
                    <a-collapse-panel v-if="output.collapsible" :key="index" class="terminal-row">
                        <template #header>
                            <span style="user-select: none; margin-right: 10px">
                                {{ prompt }}
                            </span>
                        </template>
                    </a-collapse-panel>
                    <!-- 不折叠 -->
                    <template v-else>
                        <!-- 输出命令及结果 -->
                        <template v-if="output.type === 'command'">
                            <div class="terminal-row">
                                <span style="user-select: none; margin-right: 10px">
                                    {{ prompt }}
                                </span>
                                <span> {{ output.text  }}</span>
                            </div>
                        </template>
                        <!-- 打印信息 -->
                        <template v-else>
                            <div class="terminal-row">
                                打印信息
                            </div>
                        </template>
                    </template>
                </template>
            </a-collapse>
            <div class="terminal-row">
                <a-input ref="commandInputRef" 
                    v-model:value="inputCommand.text" 
                    autofocus
                    class="command-input" 
                    :bordered="false" 
                    :placeholder="inputCommand.placeholder" 
                    @press-enter="doSubmitCommand" 
                    :disabled="isRunning"
                >
                    <template #addonBefore>
                        <span class="command-input-prompt">{{ prompt }}</span>
                    </template>
                </a-input>
            </div>
            <!-- 输入提示-->
            <div style="margin-bottom: 16px" />
        </div>
    </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  Ref,
  ref,
  StyleValue,
  toRefs,
  watchEffect,
} from "vue";
import OutputType  = YuTerminal.OutputType;
import CommandInputType = YuTerminal.CommandInputType;
import CommandOutputType = YuTerminal.CommandOutputType;
import TerminalType = YuTerminal.TerminalType
import { useTerminalConfigStore } from "../core/commands/terminal/config/terminalConfigStore";

interface YuTerminalProps {
    height?: string | number;
    fullScreen?: boolean;
    onSubmitCommand?: (inputText: string) => void;
}

const props = withDefaults(defineProps<YuTerminalProps>(),{
    height: "400px",
    fullScreen: false
})

const activeKeys = ref<number[]>();
// 输出列表
const outputList = ref<OutputType[]>([]);
// 命令列表
const commandList = ref<CommandOutputType[]>([]);
// 命令是否允许
const isRunning = ref<boolean>(false);
// 引入终端配置状态
const configStore = useTerminalConfigStore();

const commandInputRef = ref();

const handleClickWrapper = (event: Event) => {
    // @ts-ignore
    if(event.target.className === 'yu-terminal') {
        focusInput();
    }
    
}

/**
 * 输入框聚焦
 */
const focusInput = () => {
    commandInputRef.value.focus();
}

/**
 * 获取输入框是否聚焦
 */
const isInputFocused = () => {
    return (
        (commandInputRef.value.input as HTMLInputElement) === document.activeElement
    );
}



// 记录当前命令，便于写入结果
let currentNewCommand: CommandOutputType;

/**
 * 初始命令
 */
 const initCommand: CommandInputType = {
  text: "",
  placeholder: "",
};

/**
 * 待输入命令
 */
const inputCommand = ref<CommandInputType>({
    ...initCommand
})


/**
 * 输入提示符
 */
 const prompt = computed(() => {
  return '[local]$';
});


/**
 * 提交命令（enter）
 */
 const doSubmitCommand = async () => {
    isRunning.value = true;
    // TODO显示提示信息
    
    let inputText = inputCommand.value.text;
    

    //  TODO 执行某条历史命令

    // 执行命令
    const newCommand: CommandOutputType = {
        text: inputText,
        type: "command",
        resultList: []
    };

    // 记录当前命令
    currentNewCommand = newCommand;
    // 执行命令
    await props.onSubmitCommand?.(inputText);
    // 添加输出（为空也要输出换行）
    outputList.value.push(newCommand);
    // 不为空字符串才算是有效命令
    if(inputText) {
        commandList.value.push(newCommand);
        // TODO 
    }
    inputCommand.value = { ...initCommand };
    // 默认展开折叠面板
    activeKeys.value?.push(outputList.value.length -1);

    isRunning.value = false;
}


/**
 * 终端主样式
 */
const mainStyle = computed(() => {
    const fullScreenStyle: StyleValue = { 
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };

    return props.fullScreen ? fullScreenStyle : { height: props.height }

})

/**
 * 终端包装类主样式
 */
const wrapperStyle = computed(() => {
    const { background } = configStore;
    const style = {
    ...mainStyle.value,
  };
  if (background.startsWith("http")) {
    style.background = `url(${background})`;
  } else {
    style.background = background;
  }
  return style;
})


/**
 * 清空所有输出
 */
 const clear = () => {
  outputList.value = [];
};


/**
 * 操作终端的对象
 */
const terminal: TerminalType = {
    clear,
    isInputFocused
}


defineExpose({
    terminal
})

</script>

<style scoped>
.yu-terminal-wrapper {
  background: black;
}

.yu-terminal {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  overflow: scroll;
}

.yu-terminal::-webkit-scrollbar {
  display: none;
}

.yu-terminal span {
  font-size: 16px;
}

.yu-terminal
  :deep(.ant-collapse-icon-position-right
    > .ant-collapse-item
    > .ant-collapse-header) {
  color: white;
  padding: 0;
}

.yu-terminal :deep(.ant-collapse) {
  background: none;
}

.yu-terminal :deep(.ant-collapse-borderless > .ant-collapse-item) {
  border: none;
}

.yu-terminal :deep(.ant-collapse-content > .ant-collapse-content-box) {
  padding: 0;
}

.command-input {
  caret-color: white;
}

.command-input :deep(input) {
  color: white !important;
  font-size: 16px;
  padding: 0 10px;
}

.command-input :deep(.ant-input-group-addon) {
  background: none;
  border: none;
  padding: 0;
}

.command-input-prompt {
  color: white;
  background: transparent;
}

.terminal-row {
  color: white;
  font-size: 16px;
  font-family: courier-new, courier, monospace;
}
</style>