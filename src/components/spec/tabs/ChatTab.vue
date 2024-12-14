<template>
  <div
    class="column justify-between no-wrap"
    style="padding: 5px; height: calc(100vh - 51px)"
  >
    <div style="overflow: auto">
      <div v-for="item in Messages" :key="item.Id" class="caption doc-content">
        <MiChatCard
          :Sender="item.Sender"
          :Content="item.Content"
          :IncludeSession="item.IncludeSession"
        />
      </div>
    </div>

    <div style="margin-bottom: 10px; margin-top: 10px">
      <q-input
        dense
        autogrow
        v-model="InputText"
        outlined
        placeholder="输入任何问题，与AI互动..."
        @keydown.enter="handleEnter"
      >
        <template v-slot:append>
          <q-btn dense flat icon="send" @click="StreamChat" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAIAssistantStore } from 'stores/aiassistant';
import MiChatCard from 'components/chat/MiChatCard.vue';

type Message = {
  Id: number;
  Content: string;
  Sender: boolean;
  IncludeSession: boolean;
};

type GptMessage = {
  role: string;
  content: string;
};

const store = useAIAssistantStore();
let Messages = ref<Message[]>(store.ChatMessages);
let GptMessages = ref<GptMessage[]>(store.GPTMessages);

// Messages.value.push({
//     Id: Date.now(),
//     Sender: false,
//     Content: "Hello, I am Satic AI. How can I help you?",
//     IncludeSession: false
// })

let InputText = ref('');
let Loading = ref(false);
let Waiting = ref(false);

async function StreamChat() {
  if (InputText.value == '') {
    return;
  }
  Messages.value.push({
    Id: Date.now(),
    Sender: true,
    Content: InputText.value,
    IncludeSession: true,
  });

  GptMessages.value.push({
    role: 'user',
    content: InputText.value,
  });

  Messages.value.push({
    Id: Date.now(),
    Sender: false,
    Content: '',
    IncludeSession: true,
  });

  let lastMsg = Messages.value[Messages.value.length - 1];
  InputText.value = '';

  // 流式聊天
  Loading.value = true;
  const response = await fetch('/api/chat/stream-api', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      // "model": "gpt-4",
      messages: GptMessages.value,
      temperature: 0.7,
    }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { value, done } = await reader.read();
    Loading.value = false;
    Waiting.value = true;

    if (value) {
      let text = decoder.decode(value);
      lastMsg.Content = lastMsg.Content + text;
    }

    if (done) {
      Waiting.value = false;
      GptMessages.value.push({
        role: 'assistant',
        content: lastMsg.Content,
      });
      // await nextTick()
      // inputCom.value.focus()
      break;
    }
  }
}

function handleEnter(e: any) {
  if (e.ctrlKey) {
    StreamChat();
  }
}
</script>
