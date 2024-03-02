<template>
    <div class="column" style="padding: 5px;">
        <div class="col-grow" style="height: calc(100vh - 111px );;overflow: auto;">
            <div v-for="(item, index) in Messages" :key="index" class="caption doc-content">
                <MiChatCard :Sender="item.Sender" :Content="item.Content" :IncludeSession="item.IncludeSession" />
            </div>
        </div>

        <div style="height: 40px; margin-bottom: 10px;">
            <q-input dense v-model="InputText" outlined placeholder="输入任何问题，与AI互动...">
                <template v-slot:append>
                    <q-btn dense flat icon="send" @click="StreamChat" />
                </template>
            </q-input>
        </div>

    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { useAIAssistantStore } from "stores/aiassistant";
import MiChatCard from 'components/chat/MiChatCard.vue'

type Message = {
    Content: string;
    Sender: boolean;
    IncludeSession: boolean;
}

type GptMessage = {
    role: string;
    content: string
}

const store = useAIAssistantStore()
let Messages = ref<Message[]>(store.ChatMessages)
let GptMessages = ref<GptMessage[]>(store.GPTMessages)

Messages.value.push({
    Sender: false,
    Content: "Hello, I am Satic AI. How can I help you?",
    IncludeSession: false
})

let InputText = ref('')
let waitText = ref('')
let Loading = ref(false)
let Waiting = ref(false)

async function StreamChat() {
    if (InputText.value == '') {
        return
    }
    Messages.value.push({
        Sender: true,
        Content: InputText.value,
        IncludeSession: true
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
            GptMessages.value.push({
                role: 'assistant',
                content: waitText.value
            })
            Messages.value.push({
                Sender: false,
                Content: waitText.value,
                IncludeSession: true
            })
            // await nextTick()
            // inputCom.value.focus()
            break
        }
    }
}

</script>
  
  