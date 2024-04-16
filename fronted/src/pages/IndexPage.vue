<template>
    <yu-Terminal 
        ref="terminalRef"
        full-screen
        :on-submit-command="onSubmitCommand"
    />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { doCommandExecute } from "../core/commandExecutor";

const terminalRef = ref();

const onSubmitCommand = async (inputText: string) => {
    if(!inputText) {
        return;
    } 
    const terminal = terminalRef.value.terminal;
    
    await doCommandExecute(inputText,terminal);
    
}

</script>

<style scoped>

</style>