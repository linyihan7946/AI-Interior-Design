<template>
  <div id="app">
    <div class="canvas-container">
      <Canvas3D ref="canvas3D" />
      <Canvas2D ref="canvas2D" />
    </div>
    <!-- 悬浮对话窗口 -->
    <div class="chat-window">
      <input type="text" v-model="userInput" placeholder="请输入您的问题" />
      <button @click="handleChat">确定</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Canvas3D from '@/components/Canvas3D.vue';
import Canvas2D from '@/components/Canvas2D.vue';
import { Api } from './core/Api';

export default defineComponent({
  name: 'App',
  components: {
    Canvas3D,
    Canvas2D
  },
  setup() {
    const canvas3D = ref<InstanceType<typeof Canvas3D> | null>(null);
    const canvas2D = ref<InstanceType<typeof Canvas2D> | null>(null);

    onMounted(() => {
        if (canvas3D.value && canvas2D.value) {
            if (canvas3D.value && canvas3D.value.canvas3d && canvas2D.value && canvas2D.value.canvas2dCanvas) {
                Api.init({
                    view3dId: canvas3D.value.canvas3d.id,
                    view2dId: canvas2D.value.canvas2dCanvas.id
                });
            }
            Api.executeCommand("newFile", {});
            // Api.executeCommand("createOneWall", {});
            // Api.executeCommand("createRectangularRoom", {}); // 只调用创建矩形房间命令
        }
    });

    const userInput = ref('');

    const handleChat = async () => {
      if (userInput.value) {
        try {
          const response = await Api.getApp().executeCommand('aiChat', userInput.value);
          const parsedResponse = Api.parseLLMResponse(response);
          console.log('Parsed response:', parsedResponse);
        } catch (error) {
          console.error('Error executing aiChat command:', error);
        }
      }
    };

    return {
      canvas3D,
      canvas2D,
      userInput,
      handleChat,
    };
  },
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
}

.canvas-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.canvas-container > * {
  flex: 1;
  height: 100%;
  width: 50%;
}

.canvas-container > Canvas3D {
  order: 1;
}

.canvas-container > Canvas2D {
  order: 2;
}

/* 悬浮对话窗口样式 */
.chat-window {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 300px;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 1000;
}

.chat-window input {
  width: 100%;
  margin-bottom: 10px;
}

.chat-window button {
  width: 100%;
}
</style>