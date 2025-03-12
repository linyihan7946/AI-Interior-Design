<!--
 * @Author: LinYiHan
 * @Date: 2025-03-12 06:59:31
 * @Description: 
 * @Version: 1.0
-->
<template>
  <div id="app">
    <div class="canvas-container">
      <Canvas3D ref="canvas3D" />
      <Canvas2D ref="canvas2D" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Canvas3D from '@/components/Canvas3D.vue';
import Canvas2D from '@/components/Canvas2D.vue';
import { Api } from '@/core/Api';

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
        if (canvas3D.value && canvas3D.value.canvasRef && canvas2D.value && canvas2D.value.canvas2d) {
          Api.init({
            view3dId: canvas3D.value.canvasRef.id,
            view2dId: canvas2D.value.canvas2d.id
          });
        }
        Api.executeCommand("newFile", {});
        Api.executeCommand("createOneWall", {});
      }
    });

    return {
      canvas3D,
      canvas2D
    };
  }
});
</script>

<style>
.canvas-container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.canvas-container > * {
  flex: 1;
  height: 100%;
  width: 50%; /* 明确设置宽度为50% */
}

.canvas-container > Canvas3D {
  order: 1; /* 将 Canvas3D 放在左边 */
  width: 50%; /* 明确设置 Canvas3D 的宽度为50% */
}

.canvas-container > Canvas2D {
  order: 2; /* 将 Canvas2D 放在右边 */
  width: 50%; /* 明确设置 Canvas2D 的宽度为50% */
}
</style>