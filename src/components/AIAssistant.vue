<template>
  <div class="q-pa-md justify-center" style="max-height: 500px">
    <div class="row">
      <q-icon name="assistant" size="sm" class="text-pink-2"/>
      Seyond AI助手
    </div>
    <div style="width: 100%; width: 400px; padding-right: 8px; padding-left: 8px">
      <q-chat-message
        style="white-space: pre-wrap;"
        v-for="(msg, index) in DisplayMessages" :key="index"
        :name='msg.sent ? "Me": "Seyond AI"'
        :text=[msg.text]
        :avatar='msg.sent ? meImg: aiImg'
        :sent=msg.sent
        :bg-color='msg.sent ? "blue-3": "grey-3"'
      />
      <q-chat-message
        style="white-space: pre-wrap;"
        v-if="Waiting"
        name="Seyond AI"
        :avatar="aiImg"
        :text=[waitText]
        bg-color="grey-3"

      />
    </div>
    <q-input dense v-model="InputText" outlined placeholder="输入任何问题，与AI互动回答..."
             style="margin-top:10px; margin-bottom: 10px">

      <template v-slot:append>
        <q-btn round dense flat icon="send" @click="StreamChat"/>
      </template>
    </q-input>

    <div class="text-grey-6" style="width: 100%; width: 400px">
      <div>看看大家在问什么：</div>
      <q-chip square>
        <q-avatar color="red" text-color="white">1</q-avatar>
        什么是polygon？
      </q-chip>

      <q-chip square>
        <q-avatar color="red" text-color="white">2</q-avatar>
        工作模式有哪些？
      </q-chip>

      <q-chip square>
        <q-avatar color="red" text-color="white">3</q-avatar>
        什么情况下会进入Protection模式？
      </q-chip>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'

type Message = {
  text: string;
  sent: boolean;
}

type GptMessage = {
  role: string;
  content: string
}

export default defineComponent({
  name: 'AIAssistant',
  setup() {
    // ai asistant
    let DisplayMessages = ref<Message[]>([])
    let GptMessages = ref<GptMessage[]>([])
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
        const {value, done} = await reader.read()
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


    return {
      meImg,
      aiImg,
      DisplayMessages,
      InputText,
      waitText,
      Waiting,
      StreamChat,
    }
  }
})
</script>


<style scoped>

</style>
