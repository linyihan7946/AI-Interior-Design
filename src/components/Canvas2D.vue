<!--
 * @Author: LinYiHan
 * @Date: 2025-03-01 17:02:30
 * @Description: 
 * @Version: 1.0
-->
<template>
  <div class="canvas2d" id="view2d" ref="canvas2d">
    <canvas ref="canvas2dCanvas" id="canvas2dCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Canvas2D',
  setup() {
    const canvas2d = ref<HTMLElement | null>(null);
    const canvas2dCanvas = ref<HTMLCanvasElement | null>(null);

    return {
      canvas2d,
      canvas2dCanvas
    };
  }
});
</script>

<style scoped>
.canvas2d {
  width: 100%;
  height: 100%;
  position: relative;
}

#canvas2dCanvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>