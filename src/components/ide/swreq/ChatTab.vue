<template>
    <div class="flex flex-column" style="padding: 5px;">

        <div class=" flex-auto">
            <q-chat-message style="white-space: pre-wrap;" v-for="(msg, index) in DisplayMessages" :key="index"
                :name='msg.sent ? "Me" : "Seyond AI"' :text=[msg.text] :avatar='msg.sent ? meImg : aiImg' :sent=msg.sent
                :bg-color='msg.sent ? "blue-3" : "grey-3"' />
            <q-chat-message style="white-space: pre-wrap;" v-if="Waiting" name="Seyond AI" :avatar="aiImg" :text=[waitText]
                bg-color="grey-3" />
        </div>

        <q-input dense v-model="InputText" outlined placeholder="输入任何问题，与AI互动回答...">
            <template v-slot:append>
                <q-btn dense flat icon="send" @click="StreamChat" />
            </template>
        </q-input>

    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { useAIAssistantStore } from "stores/aiassistant";

type Message = {
    text: string;
    sent: boolean;
}

type GptMessage = {
    role: string;
    content: string
}

const store = useAIAssistantStore()
let DisplayMessages = ref<Message[]>(store.DisplayMessages)
let GptMessages = ref<GptMessage[]>(store.GPTMessages)

let InputText = ref('')
let waitText = ref('')
let Loading = ref(false)
let Waiting = ref(false)
const meImg = './imgs/me.jpg'
const aiImg = './imgs/ai.png'

async function StreamChat() {
    if (InputText.value == '') {
        return
    }

    DisplayMessages.value.push({
        sent: true,
        text: InputText.value
    })

    GptMessages.value.push({
        role: 'user',
        content: InputText.value
    })

    InputText.value = ''
    waitText.value = ''

    // 流式聊天
    Loading.value = true
    const response = await fetch('/api/stream-api', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            'model': 'gpt-3.5-turbo',
            // "model": "gpt-4",
            'messages': GptMessages.value,
            'temperature': 0.7,
        })
    })

    const reader = response.body!.getReader()
    const decoder = new TextDecoder('utf-8')

    while (true) {
        const { value, done } = await reader.read()
        Loading.value = false
        Waiting.value = true

        if (value) {
            let text = decoder.decode(value)
            waitText.value = waitText.value + text
        }

        if (done) {
            Waiting.value = false
            GptMessages.value?.push({
                role: 'assistant',
                content: waitText.value
            })
            DisplayMessages.value.push({
                sent: false,
                text: waitText.value
            })
            // await nextTick()
            // inputCom.value.focus()
            break
        }
    }
}

</script>
  
  